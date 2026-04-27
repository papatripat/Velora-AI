"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ChatSidebar from "@/components/ChatSidebar";

// ============================================================
// Tipe data
// ============================================================

interface Message {
  role: "user" | "assistant";
  content: string;
  fileUrl?: string;
  fileName?: string;
}

interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
}

// Key untuk localStorage
const STORAGE_KEY = "velora-conversations";

// Generate ID unik
const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// ============================================================
// Halaman utama - Chat dengan Velora AI
// ============================================================

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Ambil pesan dari percakapan aktif
  const activeConversation = conversations.find((c) => c.id === activeId);
  const messages = activeConversation?.messages || [];

  // Load dari localStorage saat pertama render
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: Conversation[] = JSON.parse(saved);
        setConversations(parsed);
        // Buka percakapan terakhir
        if (parsed.length > 0) {
          setActiveId(parsed[0].id);
        }
      } catch {
        // Abaikan data corrupt
      }
    }
  }, []);

  // Simpan ke localStorage setiap kali conversations berubah
  const saveToStorage = useCallback((convs: Conversation[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
  }, []);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Buat percakapan baru
  const handleNewChat = () => {
    setActiveId(null);
    setError(null);
    setSidebarOpen(false);
  };

  // Pilih percakapan dari sidebar
  const handleSelectConversation = (id: string) => {
    setActiveId(id);
    setError(null);
    setSidebarOpen(false);
  };

  // Hapus percakapan
  const handleDeleteConversation = (id: string) => {
    const updated = conversations.filter((c) => c.id !== id);
    setConversations(updated);
    saveToStorage(updated);
    if (activeId === id) {
      setActiveId(updated.length > 0 ? updated[0].id : null);
    }
  };

  // Kirim pesan ke backend
  const handleSend = async (message: string, file?: File) => {
    setError(null);

    // Buat preview URL untuk file gambar
    let fileUrl: string | undefined;
    let fileName: string | undefined;
    if (file) {
      fileName = file.name;
      if (file.type.startsWith("image/")) {
        fileUrl = URL.createObjectURL(file);
      }
    }

    // Pesan user baru
    const userMessage: Message = {
      role: "user",
      content: message || (file ? `📎 ${file.name}` : ""),
      fileUrl,
      fileName,
    };

    // Jika belum ada percakapan aktif, buat baru
    let currentId = activeId;
    let updatedConversations: Conversation[];

    if (!currentId) {
      const newId = generateId();
      const title = message
        ? message.slice(0, 40) + (message.length > 40 ? "..." : "")
        : file
          ? `📎 ${file.name}`
          : "Chat baru";

      const newConv: Conversation = {
        id: newId,
        title,
        createdAt: Date.now(),
        messages: [userMessage],
      };

      updatedConversations = [newConv, ...conversations];
      currentId = newId;
      setActiveId(newId);
    } else {
      updatedConversations = conversations.map((c) =>
        c.id === currentId
          ? { ...c, messages: [...c.messages, userMessage] }
          : c
      );
    }

    setConversations(updatedConversations);
    saveToStorage(updatedConversations);
    setIsLoading(true);

    try {
      let data;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("message", message);

        const res = await fetch("http://localhost:8000/chat-with-file", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.detail || `Error ${res.status}`);
        }
        data = await res.json();
      } else {
        const res = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.detail || `Error ${res.status}`);
        }
        data = await res.json();
      }

      // Tambah pesan AI
      const aiMessage: Message = { role: "assistant", content: data.response };
      const finalId = currentId;
      setConversations((prev) => {
        const updated = prev.map((c) =>
          c.id === finalId
            ? { ...c, messages: [...c.messages, aiMessage] }
            : c
        );
        saveToStorage(updated);
        return updated;
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan yang tidak diketahui";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Data sidebar (tanpa messages untuk performa)
  const sidebarConversations = conversations.map(({ id, title, createdAt }) => ({
    id,
    title,
    createdAt,
  }));

  return (
    <div className="flex h-screen">
      {/* ========== Sidebar ========== */}
      <ChatSidebar
        conversations={sidebarConversations}
        activeId={activeId}
        isOpen={sidebarOpen}
        onSelect={handleSelectConversation}
        onNew={handleNewChat}
        onDelete={handleDeleteConversation}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* ========== Main Content ========== */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 md:px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] glow-effect">
          {/* Tombol buka sidebar */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[var(--color-text-muted)] hover:text-white transition-colors"
            title="Riwayat chat"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>

          <Image
            src="/velora-logo.png"
            alt="Velora AI"
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-white truncate">
              {activeConversation?.title || "Velora AI"}
            </h1>
            <p className="text-xs text-[var(--color-text-muted)]">
              Asisten AI pintar siap membantu Anda
            </p>
          </div>

          {/* Tombol New Chat di header */}
          <button
            onClick={handleNewChat}
            className="text-xs text-[var(--color-text-muted)] hover:text-white bg-[var(--color-surface-light)] hover:bg-[var(--color-primary)] px-3 py-2 rounded-lg transition-all"
            title="Mulai chat baru"
          >
            ✨ New Chat
          </button>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
          {/* Welcome screen */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
              <Image
                src="/velora-logo.png"
                alt="Velora AI"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover mb-6 glow-effect"
              />
              <h2 className="text-2xl font-bold text-white mb-2">
                Halo! Saya Velora AI 👋
              </h2>
              <p className="text-[var(--color-text-muted)] max-w-md text-sm leading-relaxed">
                Saya adalah asisten AI yang siap membantu Anda. Ketik pertanyaan
                apa saja, atau upload gambar dan PDF untuk dianalisis.
              </p>
            </div>
          )}

          {/* List pesan */}
          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              role={msg.role}
              content={msg.content}
              fileUrl={msg.fileUrl}
              fileName={msg.fileName}
            />
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start gap-3 animate-fade-in">
              <Image
                src="/velora-logo.png"
                alt="Velora AI"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
              />
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

        {/* Input Area */}
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
