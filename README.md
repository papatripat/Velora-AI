# 🤖 Velora AI - Chatbot

Chatbot AI sederhana (MVP) menggunakan **Next.js** + **Tailwind CSS** untuk frontend dan **FastAPI** + **OpenAI API** untuk backend.

![Velora AI](https://img.shields.io/badge/Velora_AI-v1.0-6c5ce7?style=for-the-badge)

---

## 📁 Struktur Folder

```
ChatBot/
├── backend/
│   ├── main.py            # Server FastAPI + endpoint /chat
│   ├── config.py          # Loader environment variable
│   ├── requirements.txt   # Dependensi Python
│   ├── .env.example       # Template API key
│   └── .env               # API key kamu (BUAT MANUAL)
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx     # Root layout
│   │   │   ├── page.tsx       # Halaman chat utama
│   │   │   └── globals.css    # Styling global
│   │   └── components/
│   │       ├── ChatMessage.tsx  # Komponen bubble chat
│   │       └── ChatInput.tsx    # Komponen input pesan
│   ├── package.json
│   └── tailwind.config.ts
└── README.md
```

---

## 🚀 Cara Menjalankan

### Prasyarat

- **Python** 3.10+
- **Node.js** 18+
- **OpenAI API Key** ([buat di sini](https://platform.openai.com/api-keys))

### 1️⃣ Setup Backend

```bash
# Masuk ke folder backend
cd backend

# Buat virtual environment (opsional tapi disarankan)
python -m venv venv
venv\Scripts\activate       # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependensi
pip install -r requirements.txt

# Buat file .env dan isi API key
copy .env.example .env
# Edit .env dan ganti "your-api-key-here" dengan API key kamu

# Jalankan server
uvicorn main:app --reload
```

Server akan berjalan di: **http://localhost:8000**

### 2️⃣ Setup Frontend

```bash
# Buka terminal baru, masuk ke folder frontend
cd frontend

# Install dependensi (sudah otomatis saat init, tapi jika perlu)
npm install

# Jalankan development server
npm run dev
```

Frontend akan berjalan di: **http://localhost:3000**

### 3️⃣ Buka dan Chat!

Buka browser dan akses **http://localhost:3000**. Ketik pesan dan mulai ngobrol dengan Velora AI! 🎉

---

## 📡 API Endpoint

### `POST /chat`

Mengirim pesan user ke AI dan menerima respons.

**Request:**
```json
{
  "message": "Apa itu machine learning?"
}
```

**Response:**
```json
{
  "response": "Machine learning adalah cabang dari kecerdasan buatan (AI) yang fokus pada pengembangan algoritma dan model statistik yang memungkinkan komputer untuk belajar dari data..."
}
```

**Contoh menggunakan curl:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Halo, siapa kamu?\"}"
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

| Layer    | Teknologi                         |
|----------|----------------------------------|
| Frontend | Next.js 14 + Tailwind CSS        |
| Backend  | Python + FastAPI                 |
| AI       | OpenAI API (gpt-3.5-turbo)       |

---

## 📝 Fitur

- ✅ Chat sederhana antara user dan AI
- ✅ UI dark theme modern (mirip ChatGPT)
- ✅ Loading indicator saat AI berpikir
- ✅ Error handling
- ✅ Auto-scroll ke pesan terbaru
- ✅ Animasi fade-in pada pesan
- ✅ Responsive design
