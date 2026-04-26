"""
main.py - Velora AI Backend Server
FastAPI server dengan endpoint /chat untuk komunikasi dengan Groq API
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from config import GROQ_API_KEY

# ============================================================
# Inisialisasi App & Groq Client
# ============================================================

app = FastAPI(
    title="Velora AI API",
    description="Backend API untuk Velora AI Chatbot",
    version="1.0.0",
)

# CORS - izinkan frontend Next.js (localhost:3000) mengakses API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inisialisasi Groq client (kompatibel dengan OpenAI SDK)
client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1",
)

# ============================================================
# Schema Request & Response
# ============================================================

class ChatRequest(BaseModel):
    """Schema untuk request dari frontend"""
    message: str

class ChatResponse(BaseModel):
    """Schema untuk response ke frontend"""
    response: str

# ============================================================
# Endpoints
# ============================================================

@app.get("/")
def health_check():
    """Health check endpoint"""
    return {"status": "ok", "message": "Velora AI API is running 🚀"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Endpoint utama untuk chat dengan AI.
    Menerima pesan dari user, mengirim ke Groq, dan mengembalikan respons.
    """
    # Validasi input
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Pesan tidak boleh kosong!")

    try:
        # Kirim request ke Groq API
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Kamu adalah Velora AI, asisten AI yang ramah dan membantu. "
                        "Jawab pertanyaan user dengan jelas dan ringkas. "
                        "Kamu bisa menjawab dalam bahasa Indonesia maupun Inggris "
                        "sesuai bahasa yang digunakan user."
                    ),
                },
                {
                    "role": "user",
                    "content": request.message,
                },
            ],
            max_tokens=1024,
            temperature=0.7,
        )

        # Ambil respons dari Groq
        ai_response = completion.choices[0].message.content
        return ChatResponse(response=ai_response)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gagal mendapatkan respons dari AI: {str(e)}",
        )
