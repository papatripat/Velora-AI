"use client";

import { useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ============================================================
// ChatMessage - Komponen untuk menampilkan satu bubble pesan
// ============================================================

interface ChatMessageProps {
    role: "user" | "assistant";
    content: string;
    fileUrl?: string;
    fileName?: string;
}

export default function ChatMessage({
    role,
    content,
    fileUrl,
    fileName,
}: ChatMessageProps) {
    const isUser = role === "user";
    const [copied, setCopied] = useState(false);

    // Copy teks ke clipboard
    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className={`flex items-start gap-3 animate-fade-in msg-wrapper ${isUser ? "flex-row-reverse" : "flex-row"
                }`}
        >
            {/* Avatar */}
            {isUser ? (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 bg-[var(--color-primary)] text-white">
                    U
                </div>
            ) : (
                <Image
                    src="/velora-logo.png"
                    alt="Velora AI"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                />
            )}

            {/* Message bubble */}
            <div className="flex flex-col max-w-[75%]">
                <span
                    className={`text-xs font-medium mb-1 ${isUser
                            ? "text-right text-[var(--color-primary-light)]"
                            : "text-left text-[var(--color-text-muted)]"
                        }`}
                >
                    {isUser ? "You" : "Velora AI"}
                </span>

                {/* File preview (jika user upload file) */}
                {isUser && fileUrl && (
                    <div className="mb-2">
                        {fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                            <img
                                src={fileUrl}
                                alt={fileName}
                                className="max-w-[200px] rounded-lg border border-[var(--color-border)]"
                            />
                        ) : (
                            <div className="flex items-center gap-2 bg-[var(--color-surface-light)] rounded-lg px-3 py-2 text-xs text-[var(--color-text-muted)]">
                                <span>📄</span>
                                <span className="truncate max-w-[180px]">{fileName}</span>
                            </div>
                        )}
                    </div>
                )}

                <div
                    className={`relative px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser
                            ? "bg-[var(--color-user-bubble)] text-white rounded-br-md"
                            : "bg-[var(--color-ai-bubble)] text-[var(--color-text)] border border-[var(--color-border)] rounded-bl-md"
                        }`}
                >
                    {/* Konten pesan */}
                    {isUser ? (
                        <span className="whitespace-pre-wrap">{content}</span>
                    ) : (
                        <div className="markdown-content">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {content}
                            </ReactMarkdown>
                        </div>
                    )}

                    {/* Copy button (hanya untuk pesan AI) */}
                    {!isUser && (
                        <button
                            onClick={handleCopy}
                            className="copy-btn absolute -bottom-6 left-0 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary-light)] transition-colors flex items-center gap-1"
                            title="Salin pesan"
                        >
                            {copied ? "✓ Tersalin" : "📋 Salin"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
