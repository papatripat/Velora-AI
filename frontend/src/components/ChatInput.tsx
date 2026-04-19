"use client";

import { useState, FormEvent, KeyboardEvent } from "react";

// ============================================================
// ChatInput - Komponen input pesan dengan tombol kirim
// ============================================================

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [input, setInput] = useState("");

    // Handle submit form
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSend(input.trim());
            setInput("");
        }
    };

    // Handle Enter key (Shift+Enter untuk new line di textarea)
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-end gap-3 p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]"
        >
            {/* Textarea input */}
            <textarea
                id="chat-input"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={disabled ? "Velora sedang berpikir..." : "Ketik pesan..."}
                disabled={disabled}
                className="flex-1 resize-none bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] rounded-xl px-4 py-3 text-sm border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all disabled:opacity-50"
            />

            {/* Tombol kirim */}
            <button
                id="send-button"
                type="submit"
                disabled={disabled || !input.trim()}
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white rounded-xl px-5 py-3 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            >
                {disabled ? (
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-white rounded-full dot-1" />
                        <span className="w-1.5 h-1.5 bg-white rounded-full dot-2" />
                        <span className="w-1.5 h-1.5 bg-white rounded-full dot-3" />
                    </span>
                ) : (
                    "Kirim"
                )}
            </button>
        </form>
    );
}
