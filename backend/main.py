"""
main.py - Velora AI Backend Server
FastAPI server dengan endpoint /chat dan /chat-with-file untuk komunikasi dengan Groq API
"""

import base64
import io
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from PyPDF2 import PdfReader
from config import GROQ_API_KEY

# ============================================================
# Inisialisasi App & Groq Client
# ============================================================

app = FastAPI(
    title="Velora AI API",
    description="Backend API untuk Velora AI Chatbot",
    version="2.0.0",
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

# System prompt untuk Velora AI
SYSTEM_PROMPT = (
    "Kamu adalah Velora AI, asisten AI yang ramah dan membantu. "
    "Jawab pertanyaan user dengan jelas dan ringkas. "
    "Gunakan format Markdown jika diperlukan (bold, list, code block, dll). "
    "Kamu bisa menjawab dalam bahasa Indonesia maupun Inggris "
    "sesuai bahasa yang digunakan user."
)

# ============================================================
# Schema Request & Response
# ============================================================

class ChatRequest(BaseModel):
    """Schema untuk request chat teks biasa"""
    message: str

class ChatResponse(BaseModel):
    """Schema untuk response ke frontend"""
    response: str

# ============================================================
# Helper Functions
# ============================================================

def extract_pdf_text(file_bytes: bytes) -> str:
    """Ekstrak teks dari file PDF"""
    reader = PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    # Limit teks agar tidak terlalu panjang
    if len(text) > 8000:
        text = text[:8000] + "\n\n... (teks dipotong karena terlalu panjang)"
    return text.strip()

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
    Endpoint untuk chat teks biasa (tanpa file).
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Pesan tidak boleh kosong!")

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": request.message},
            ],
            max_tokens=1024,
            temperature=0.7,
        )

        ai_response = completion.choices[0].message.content
        return ChatResponse(response=ai_response)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gagal mendapatkan respons dari AI: {str(e)}",
        )


@app.post("/chat-with-file", response_model=ChatResponse)
async def chat_with_file(
    message: str = Form(default=""),
    file: UploadFile = File(...),
):
    """
    Endpoint untuk chat dengan file attachment (gambar atau PDF).
    - Gambar: dikirim ke Groq Vision model
    - PDF: teks diekstrak lalu dikirim ke model teks
    """
    try:
        file_bytes = await file.read()
        content_type = file.content_type or ""

        # ==================== GAMBAR ====================
        if content_type.startswith("image/"):
            # Encode gambar ke base64
            base64_image = base64.b64encode(file_bytes).decode("utf-8")
            user_prompt = message.strip() if message.strip() else "Jelaskan gambar ini."

            completion = client.chat.completions.create(
                model="llama-3.2-90b-vision-preview",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": user_prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:{content_type};base64,{base64_image}",
                                },
                            },
                        ],
                    },
                ],
                max_tokens=1024,
                temperature=0.7,
            )

            ai_response = completion.choices[0].message.content
            return ChatResponse(response=ai_response)

        # ==================== PDF ====================
        elif content_type == "application/pdf":
            pdf_text = extract_pdf_text(file_bytes)

            if not pdf_text:
                raise HTTPException(
                    status_code=400,
                    detail="Tidak bisa mengekstrak teks dari PDF. File mungkin berisi gambar/scan.",
                )

            user_prompt = message.strip() if message.strip() else "Rangkum isi dokumen ini."
            full_prompt = (
                f"{user_prompt}\n\n"
                f"--- Isi Dokumen PDF ({file.filename}) ---\n"
                f"{pdf_text}"
            )

            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": full_prompt},
                ],
                max_tokens=1024,
                temperature=0.7,
            )

            ai_response = completion.choices[0].message.content
            return ChatResponse(response=ai_response)

        # ==================== FILE TIDAK DIDUKUNG ====================
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Tipe file '{content_type}' tidak didukung. Gunakan gambar (JPG/PNG/WebP) atau PDF.",
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gagal memproses file: {str(e)}",
        )
