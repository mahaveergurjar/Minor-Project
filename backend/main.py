from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS
from pydub import AudioSegment
import yt_dlp
import torch
import os
import spacy
# import graphviz
from collections import defaultdict, Counter
# from IPython.display import display, Image

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

def dynamic_tokenizer_kwargs(input_length):
    max_length = min(1024, max(10, input_length // 2))
    min_length = max(10, input_length // 4)
    return {'truncation': True, 'max_length': max_length, 'min_length': min_length}

def process_audio_chunks(audio_chunks):
    texts = [asr_pipe(chunk)["text"] for chunk in audio_chunks]
    summaries = []
    for text in texts:
        input_length = len(text.split())
        tokenizer_kwargs = dynamic_tokenizer_kwargs(input_length)
        summary = summarizer(text, do_sample=False, **tokenizer_kwargs)
        summaries.append(summary[0]['summary_text'])
    return summaries

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

def extract_main_topics(text, top_n=6):
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

def find_sentence_relations(keywords, sentences, max_sentences=5):
    keyword_sentences = defaultdict(list)
    for sentence in sentences:
        for keyword in keywords:
            if keyword.lower() in sentence.lower():
                if len(keyword_sentences[keyword]) < max_sentences:
                    keyword_sentences[keyword].append(sentence)
    return keyword_sentences


@app.route("/summarize", methods=["POST"])
def summarize_video():
    try:
        data = request.get_json()
        video_url = data.get("video_url")
        if not video_url:
            return jsonify({"error": "Missing video_url"}), 400
        
        download_audio(video_url)
        audio_file_path = "downloaded_audio.wav"
        chunks = split_audio_into_chunks(audio_file_path)
        all_summaries = process_audio_chunks(chunks)
        os.remove(audio_file_path)
        for chunk in chunks:
            os.remove(chunk)
        
        full_summary = " ".join(all_summaries)
        mind_map_data = generate_mind_map(full_summary)
        points = extract_sentences(full_summary)
        text_data = "\n".join(points)

        # Extract main topics (keywords)
        main_topics = extract_main_topics(text_data)

        # Find relationships between keywords and sentences
        keyword_sentences = find_sentence_relations(main_topics, points)
        topic = extract_topic(full_summary)

        print(topic)
        print(keyword_sentences)

        return jsonify({
            "summary": full_summary,
            "mind_map": keyword_sentences,
            # "keyValue": keyword_sentences,
            "central": topic
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)
