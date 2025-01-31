from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS
from pydub import AudioSegment
import yt_dlp
import torch
import os

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

@app.route("/summarize", methods=["POST"])
def summarize_video():
    try:
        data = request.get_json()
        video_url = data.get("video_url")
        # video_url = "https://youtu.be/-bt_y4Loofg?feature=shared"
        if not video_url:
            return jsonify({"error": "Missing video_url"}), 400
        
        download_audio(video_url)
        audio_file_path = "downloaded_audio.wav"
        chunks = split_audio_into_chunks(audio_file_path)
        all_summaries = process_audio_chunks(chunks)
        os.remove(audio_file_path)
        for chunk in chunks:
            os.remove(chunk)
        
        return jsonify({"summary": " ".join(all_summaries)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)