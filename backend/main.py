from pydub import AudioSegment
import yt_dlp
import torch
import os
import spacy
import re
import requests
from bs4 import BeautifulSoup
from collections import defaultdict, Counter
from IPython.display import display, Image

from googletrans import Translator

translator = Translator()

app = Flask(__name__)

CORS(app)

# Initialize device and pipelines
device = "cuda:0" if torch.cuda.is_available() else "cpu"

asr_pipe = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-base",
    chunk_length_s=30,
    device=device,
    framework="pt"
)

summarizer = pipeline(
    "summarization",
    model="sshleifer/distilbart-cnn-12-6",
    device=device,
    framework="pt"
)

# Load NLP model for keyword extraction
nlp = spacy.load("en_core_web_sm")

def download_audio(video_url):
    ydl_opts = {
        'format': 'bestaudio',
        'postprocessors': [{'key': 'FFmpegExtractAudio', 'preferredcodec': 'wav'}],
        'outtmpl': 'downloaded_audio'
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([video_url])

def split_audio_into_chunks(audio_file_path, chunk_length_ms=60000):
    audio = AudioSegment.from_wav(audio_file_path)
    total_length = len(audio)
    chunks = []
    for start in range(0, total_length, chunk_length_ms):
        chunk = audio[start:start + chunk_length_ms]
        chunk_path = f"chunk_{start // chunk_length_ms}.wav"
        chunk.export(chunk_path, format="wav")
        chunks.append(chunk_path)
    return chunks

def dynamic_tokenizer_kwargs(input_length,length):
    max_length = min(1024, max(10, input_length // length))
    min_length = max(10, input_length // (2*length))
    return {'truncation': True, 'max_length': max_length, 'min_length': min_length}


def summarize_text(text, length):
    """Summarizes the given text after cleaning and chunking."""
    cleaned_sentences = remove_outliers(text)  # Remove unnecessary sentences
    full_transcription = " ".join(cleaned_sentences)

    summaries = []
    chunk_size = 300  # Summarization works best on ~300 words
    words = full_transcription.split()

    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        input_length = len(chunk.split())
        tokenizer_kwargs = dynamic_tokenizer_kwargs(input_length, length)
        summary = summarizer(chunk, do_sample=False, **tokenizer_kwargs)
        summaries.append(summary[0]['summary_text'])

    return " ".join(summaries), full_transcription


def generate_mind_map(summary_text):
    doc = nlp(summary_text)
    nodes = []
    links = []
    keyword_map = defaultdict(set)

    main_topics = set()

    # Extract key topics and relationships
    for token in doc:
        if token.pos_ in ["NOUN", "PROPN"]:  # Focus on nouns & proper nouns
            parent = token.head.text
            if parent != token.text:  # Avoid self-links
                keyword_map[parent].add(token.text)
                main_topics.add(parent)

    # Build nodes and links
    seen_nodes = set()
    for main_topic in main_topics:
        main_id = f"node-{main_topic}"
        if main_id not in seen_nodes:
            nodes.append({"id": main_id, "name": main_topic, "type": "heading"})
            seen_nodes.add(main_id)

        for sub in keyword_map[main_topic]:
            sub_id = f"node-{sub}"
            if sub_id not in seen_nodes:
                nodes.append({"id": sub_id, "name": sub, "type": "subtopic"})
                seen_nodes.add(sub_id)
            links.append({"source": main_id, "target": sub_id})

    return {"nodes": nodes, "links": links}

def extract_topic(text):
    doc = nlp(text)

    # Extract nouns and proper nouns
    words = [token.text for token in doc if token.pos_ in ["NOUN", "PROPN"] and not token.is_stop]

    # Count occurrences of each noun
    word_freq = Counter(words)

    # Prioritize words appearing in the first sentence(s)
    first_sentences = list(doc.sents)[:2]  # Look at the first two sentences
    first_mentions = [token.text for sent in first_sentences for token in sent if token.pos_ in ["NOUN", "PROPN"]]

    # Give extra weight to early mentions
    for word in first_mentions:
        word_freq[word] += 3  # Boost early mentions

    # Select the most frequently mentioned word
    main_topic = word_freq.most_common(1)

    return main_topic[0][0] if main_topic else "Unknown Topic"

def extract_sentences(summary):
    doc = nlp(summary)
    return [sent.text.strip() for sent in doc.sents if sent.text.strip()]

def extract_main_topics(text, top_n=10):
    doc = nlp(text)
    entities = [ent.text for ent in doc.ents if ent.label_ in ['ORG', 'PERSON', 'GPE', 'LOC', 'PRODUCT']]
    entity_freq = Counter(entities)

    if entity_freq:
        main_topics = [topic for topic, _ in entity_freq.most_common(top_n)]
    else:
        words = [token.text for token in doc if token.is_alpha and not token.is_stop]
        word_freq = Counter(words)
        main_topics = [word for word, _ in word_freq.most_common(top_n)]

    return main_topics

def find_sentence_relations(keywords, sentences, max_sentences=1):
    keyword_sentences = defaultdict(list)
    assigned_sentences = set()  # To keep track of assigned sentences

    for keyword in keywords:
        for sentence in sentences:
            if len(sentence.split()) > 10 and sentence not in assigned_sentences:
                if keyword.lower() in sentence.lower():
                    if len(keyword_sentences[keyword]) < max_sentences:
                        keyword_sentences[keyword].append(sentence)
                        assigned_sentences.add(sentence)  # Mark sentence as used
                        break  # Stop after assigning the sentence to the keyword

    return keyword_sentences

def get_video_title(url):
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")
    return soup.title.string.replace("- YouTube", "").strip()

def extract_most_frequent_title_word(title, text):
    doc = nlp(text.lower())  # Convert to lowercase for consistency
    words = [token.text for token in doc if token.is_alpha and not token.is_stop]  # Remove non-alphabetic words and stop words

    # Tokenize title words
    title_words = title.lower().split()

    # Count occurrences of title words in transcription
    word_freq = Counter(words)
    common_words = {word: word_freq[word] for word in title_words if word in word_freq}

    # Find the most frequent word
    return max(common_words, key=common_words.get, default="Unknown Title")

outro_patterns = [
    r"thanks for watching", r"see you in the next video", r"don't forget to subscribe",
    r"hit the (like|subscribe) button", r"leave a comment", r"hope you enjoyed",
    r"follow for more", r"stay tuned", r"this was all about", r"let me know in the comments",
    r"Welcome to this video", r"let's wrap up", r"in 100 seconds", r"this has been", r"for watching", r"video"
]

def remove_outliers(text):
    """ Removes unwanted sentences that match outro patterns. """
    sentences = list(nlp(text).sents)  # Segment into sentences
    filtered_sentences = []

    for sentence in sentences:
        sentence_text = sentence.text.strip()
        sentence_lower = sentence_text.lower()

        # Skip sentences matching engagement/outro phrases
        if any(re.search(pattern, sentence_lower) for pattern in outro_patterns):
            continue

        # Skip very short sentences (likely irrelevant)
        if len(sentence_text.split()) < 4:
            continue

        filtered_sentences.append(sentence_text)

    return filtered_sentences

def translate_text(text, target_language="es"):
    try:
        result = translator.translate(text, dest=target_language)
        return result.text
    except Exception as e:
        print("Translation Error:", str(e))
        return text  # Return the original text if translation fails




@app.route("/")
def home():
    return "Hello, Flask is running on Colab!"

@app.route("/summarize", methods=["POST"])
def summarize_video():
    try:
        data = request.get_json()
        video_url = data.get("video_url")
        if not video_url:
            return jsonify({"error": "Missing video_url"}), 400

        target_language = data.get("lang")
        if not target_language:
            return jsonify({"error": "Missing target language"}), 400

        # Determine summary length
        summary_length = data.get("summary_length", "Normal")
        length = {"Short": 3, "Normal": 2, "Long": 1}.get(summary_length, 2)

        # Download and split audio
        download_audio(video_url)
        audio_file_path = "downloaded_audio.wav"
        chunks = split_audio_into_chunks(audio_file_path)

        # Perform transcription
        transcription = " ".join([asr_pipe(chunk)["text"] for chunk in chunks])

        # Summarization
        full_summary, full_transcription = summarize_text(transcription, length)

        points = extract_sentences(full_transcription)
        text_data = "\n".join(points)
       
        # Extract main topics (keywords)
        main_topics = extract_main_topics(text_data)

        # Determine central topic
        video_title = get_video_title(video_url)
        most_frequent_word = extract_most_frequent_title_word(video_title, full_transcription)

        # Find sentence relations for mind map
        keyword_sentences = find_sentence_relations(main_topics, points)

        # Translation (if needed)
        if target_language != "en":
            full_summary = translate_text(full_summary, target_language)
            full_transcription = translate_text(full_transcription, target_language)

        # Cleanup
        os.remove(audio_file_path)
        for chunk in chunks:
            os.remove(chunk)

        print(len(full_summary))


        return jsonify({
            "summary": full_summary,
            "transcription": full_transcription,
            "mind_map": keyword_sentences,
            "central": most_frequent_word
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=3000)

    