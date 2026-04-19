"""
config.py - Konfigurasi environment variable
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file (path eksplisit ke folder yang sama dengan config.py)
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

# Ambil API key dari environment variable
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError(
        "OPENAI_API_KEY belum di-set! "
        "Buat file .env di folder backend/ dan isi dengan API key kamu. "
        "Contoh: OPENAI_API_KEY=sk-xxxxxxxx"
    )
