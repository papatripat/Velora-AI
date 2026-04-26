"use client";

import Image from "next/image";

// ============================================================
// ChatMessage - Komponen untuk menampilkan satu bubble pesan
// ============================================================

interface ChatMessageProps {
    role: "user" | "assistant";
    content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
    const isUser = role === "user";

    return (
        <div
            className={`flex items-start gap-3 animate-fade-in ${isUser ? "flex-row-reverse" : "flex-row"
                }`}
        >
            {/* Avatar */}
            {isUser ? (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 bg-[var(--color-primary)] text-white">
                    U
                </div>
            ) : (
                <Image src="/velora-logo.png" alt="Velora AI" width={32} height={32} className="w-8 h-8 rounded-full object-cover shrink-0" />
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
                <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${isUser
                        ? "bg-[var(--color-user-bubble)] text-white rounded-br-md"
                        : "bg-[var(--color-ai-bubble)] text-[var(--color-text)] border border-[var(--color-border)] rounded-bl-md"
                        }`}
                >
                    {content}
                </div>
            </div>
        </div>
    );
}
