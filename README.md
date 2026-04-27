# 🤖 Velora AI - Chatbot

A simple AI chatbot (MVP) built with **Next.js** + **Tailwind CSS** for the frontend, **FastAPI** for the backend, and **Groq API** for AI inference.

![Velora AI](https://img.shields.io/badge/Velora_AI-v2.0-6c5ce7?style=for-the-badge)

---

## ✨ Features

- 💬 **Chat with AI** — Real-time conversation powered by Groq (Llama 3.3 70B)
- 🖼️ **Image Analysis** — Upload images and let AI describe/analyze them (Groq Vision)
- 📄 **PDF Analysis** — Upload PDF files and get AI-generated summaries
- 📝 **Markdown Rendering** — AI responses rendered with proper formatting (code blocks, lists, tables)
- 📋 **Copy to Clipboard** — Hover over AI messages to copy text
- 💾 **Chat History** — Conversations are saved in localStorage and persist across refreshes
- 📂 **Chat Sidebar** — Browse, switch between, and delete past conversations
- ⏳ **Loading Indicator** — Animated dots while AI is thinking
- ⚠️ **Error Handling** — User-friendly error messages
- 🎨 **Dark Theme UI** — Modern, premium design with purple accent colors

---

## 📁 Project Structure

```
ChatBot/
├── backend/
│   ├── main.py              # FastAPI server + /chat & /chat-with-file endpoints
│   ├── config.py            # Environment variable loader
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # API key template
│   └── .env                 # Your API key (create manually)
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx       # Root layout
│   │   │   ├── page.tsx         # Main chat page
│   │   │   └── globals.css      # Global styles + markdown
│   │   └── components/
│   │       ├── ChatMessage.tsx   # Message bubble component
│   │       ├── ChatInput.tsx     # Input + file upload component
│   │       └── ChatSidebar.tsx   # Chat history sidebar
│   ├── public/
│   │   └── velora-logo.png      # AI logo
│   ├── package.json
│   └── tailwind.config.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python** 3.10+
- **Node.js** 18+
- **Groq API Key** (free) — [Get it here](https://console.groq.com/keys)

### 1️⃣ Backend Setup

```bash
# Navigate to backend folder
cd backend

# (Optional) Create virtual environment
python -m venv venv
venv\Scripts\activate         # Windows
# source venv/bin/activate    # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file with your API key
copy .env.example .env
# Edit .env → replace with your Groq API key

# Start the server
uvicorn main:app --reload
```

Server runs at: **http://localhost:8000**

### 2️⃣ Frontend Setup

```bash
# Open a new terminal, navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: **http://localhost:3000**

### 3️⃣ Open & Chat!

Open your browser at **http://localhost:3000** and start chatting with Velora AI! 🎉

---

## 📡 API Endpoints

### `POST /chat`

Send a text message and receive an AI response.

**Request:**
```json
{
  "message": "What is machine learning?"
}
```

**Response:**
```json
{
  "response": "Machine learning is a branch of artificial intelligence..."
}
```

### `POST /chat-with-file`

Send a message with an image or PDF attachment.

**Request** (multipart/form-data):
- `file` — Image (JPG/PNG/WebP) or PDF file
- `message` — Optional text prompt

**Response:**
```json
{
  "response": "The image shows a beautiful sunset over the ocean..."
}
```

### `GET /`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Velora AI API is running 🚀"
}
```

---

## 🛠️ Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | Next.js 16 + Tailwind CSS           |
| Backend  | Python + FastAPI                    |
| AI       | Groq API (Llama 3.3 70B + Vision)   |

---

## 📸 Screenshots

### Chat Interface
![Chat UI](https://via.placeholder.com/800x450?text=Velora+AI+Chat+Interface)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
