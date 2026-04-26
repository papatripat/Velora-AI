"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";

// ============================================================
// Tipe data untuk pesan chat
// ============================================================

interface Message {
  role: "user" | "assistant";
  content: string;
}

// ============================================================
// Halaman utama - Chat dengan Velora AI
// ============================================================

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Kirim pesan ke backend
  const handleSend = async (message: string) => {
    // Reset error
    setError(null);

    // Tambah pesan user ke list
    const userMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Kirim request ke FastAPI backend
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.detail || `Error ${res.status}`);
      }

      const data = await res.json();

      // Tambah pesan AI ke list
      const aiMessage: Message = { role: "assistant", content: data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* ========== Header ========== */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] glow-effect">
        <Image src="/velora-logo.png" alt="Velora AI" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
        <div>
          <h1 className="text-lg font-bold text-white">Velora AI</h1>
          <p className="text-xs text-[var(--color-text-muted)]">
            Asisten AI pintar siap membantu Anda
          </p>
        </div>
      </header>

      {/* ========== Chat Area ========== */}
      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-5">
        {/* Pesan selamat datang */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <Image src="/velora-logo.png" alt="Velora AI" width={80} height={80} className="w-20 h-20 rounded-full object-cover mb-6 glow-effect" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Halo! Saya Velora AI 👋
            </h2>
            <p className="text-[var(--color-text-muted)] max-w-md text-sm leading-relaxed">
              Saya adalah asisten AI yang siap membantu Anda. Ketik pertanyaan
              apa saja dan saya akan berusaha menjawabnya dengan sebaik mungkin.
            </p>
          </div>
        )}

        {/* List pesan */}
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 animate-fade-in">
            <Image src="/velora-logo.png" alt="Velora AI" width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
            <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-[var(--color-ai-bubble)] border border-[var(--color-border)]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[var(--color-primary-light)] rounded-full dot-1" />
                <span className="w-2 h-2 bg-[var(--color-primary-light)] rounded-full dot-2" />
                <span className="w-2 h-2 bg-[var(--color-primary-light)] rounded-full dot-3" />
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mx-auto max-w-md text-center bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm animate-fade-in">
            ⚠️ {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* ========== Input Area ========== */}
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
