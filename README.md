# 🎥 YouTube Video Summarizer 📜

A web application that extracts audio from YouTube videos, transcribes it using **OpenAI Whisper**, and generates a concise summary using **DistilBART**.

## 🚀 Features

✅ Download audio from YouTube videos 🎵  
✅ Convert speech to text with **Whisper** 🤖  
✅ Summarize the transcribed text using **DistilBART** 📄  
✅ REST API built with **Flask**  
✅ Frontend powered by **React + Vite**

---

## 🛠️ Tech Stack

### **Backend**

- Python 🐍
- Flask 🔥
- Transformers (Whisper + DistilBART)
- PyDub (Audio Processing)
- yt-dlp (YouTube Audio Download)
- Flask-CORS

### **Frontend**

- React ⚛️
- TailwindCSS 🎨
- Axios (API Requests)
- Lucide-react (Icons)

---

## 📌 Installation Guide

### 1️⃣ **Clone the Repository**

```sh
git clone https://github.com/mahaveergurjare/Minor-Project.git
cd Minor-Project
```

### 2️⃣ **Backend Setup**

#### Install Dependencies

```sh
cd beckend
pip install flask transformers torch pydub yt-dlp flask-cors
```

#### Run Flask Server

```sh
python main.py
```

---

### 3️⃣ **Frontend Setup**

#### Install Dependencies

```sh
cd frontend
npm install
```

#### Run Development Server

```sh
npm run dev
```

---

## 🎯 Usage

1. Enter a YouTube video URL in the frontend UI.
2. The Flask backend downloads the audio and processes the text.
3. The summarized text is displayed on the frontend.

---

## 📌 API Endpoints

### 🎙️ **Summarize Video**

- **Endpoint:** `POST /summarize`
- **Payload:**

```json
{ "video_url": "https://youtu.be/example" }
```

- **Response:**

```json
{
  "summary": "This is the summarized content of the video."
}
```

---

## ⚠️ Requirements

- Python 3.8+
- Node.js 16+
- `ffmpeg` installed for audio processing (`sudo apt install ffmpeg`)

---

## 🤖 Future Improvements

- Add **multi-language support** 🌍
- Improve **UI with better visualization** 🎨
- Optimize **processing speed** ⚡

---

## 📜 License

This project is **open-source** under the **MIT License**.

---

## ✨ Contributing

Want to improve this project? Contributions are welcome!

1. Fork the repository
2. Create a new branch (`git checkout -b feature-xyz`)
3. Commit changes and push (`git push origin feature-xyz`)
4. Open a Pull Request 🚀

---

## 🙌 Acknowledgments

- [OpenAI Whisper](https://openai.com/whisper)
- [Hugging Face Transformers](https://huggingface.co/)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
