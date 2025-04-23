# 🎥 YouTube Video Summarizer 📝

A web application that extracts audio from YouTube videos, transcribes it using **OpenAI Whisper**, and generates a concise summary using **DistilBART** with **multilingual support**.

## 🚀 Features

✅ Provides **Authorization** to the application 
✅ Download audio from YouTube videos 🎵  
✅ Convert speech to text with **Whisper** 🤖  
✅ Summarize the transcribed text using **DistilBART** 📄  
✅ **Multilingual support** for summaries in multiple languages 🌎  
✅ REST API built with **Flask**  
✅ Frontend powered by **React + Vite**

---

## 🫠 Tech Stack

### **Backend**

- Python 🐍
- Flask 🔥
- Transformers (Whisper + DistilBART)
- PyDub (Audio Processing)
- yt-dlp (YouTube Audio Download)
- Helsinki-NLP Translation Models
- Flask-CORS
- Express.js
- Node.js
- Mongoose
### **Frontend**

- React ⚛️
- TailwindCSS 🎨
- Axios (API Requests)
- Lucide-react (Icons)
- Language selection component

---

## 📌 Installation Guide

### 1️⃣ **Clone the Repository**

```sh
git clone https://github.com/mahaveergurjar/Minor-Project.git
cd Minor-Project
```

### 2️⃣ **Backend Setup**

#### Install Dependencies

```sh
cd backend
pip install -r requirements.txt
npm intall mongoose express express-validator cors body-parser dotenv
joi jsonwebtoken bcrypt
```

#### Run Flask Server

```sh
npm start
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
4. Select your preferred language from the dropdown to view the summary in that language.

---

## 📌 API Endpoints

### 🎹 **Summarize Video**

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

### 🌐 **Translate Summary**

- **Endpoint:** `POST /translate`
- **Payload:**

```json
{ 
  "text": "This is the text to be translated", 
  "language": "fr" 
}
```

- **Response:**

```json
{
  "translated_summary": "Voici le texte traduit"
}
```

---

## ⚠️ Requirements

- Python 3.8+
- Node.js 16+
- `ffmpeg` installed for audio processing (`sudo apt install ffmpeg`)

---

## 🌐 Supported Languages

The application currently supports the following languages:
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Hindi (hi)

---

## 🤖 Future Improvements

- Add **more language options** 🌍
- Improve **UI with better visualization** 🎨
- Optimize **processing speed** ⚡
- Add **sentiment analysis** of video content 📊
- Add more **security** to the application 
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
- [Helsinki-NLP Translation Models](https://huggingface.co/Helsinki-NLP)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
