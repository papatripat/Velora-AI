"use client";

import { useState, useRef, FormEvent, KeyboardEvent } from "react";

// ============================================================
// ChatInput - Komponen input pesan + file upload
// ============================================================

interface ChatInputProps {
    onSend: (message: string, file?: File) => void;
    disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [input, setInput] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle submit form
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if ((input.trim() || file) && !disabled) {
            onSend(input.trim(), file || undefined);
            setInput("");
            clearFile();
        }
    };

    // Handle Enter key (Shift+Enter untuk new line)
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Validasi tipe file
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "application/pdf",
        ];
        if (!allowedTypes.includes(selectedFile.type)) {
            alert("File tidak didukung! Gunakan gambar (JPG/PNG/WebP) atau PDF.");
            return;
        }

        // Validasi ukuran (max 10MB)
        if (selectedFile.size > 10 * 1024 * 1024) {
            alert("Ukuran file maksimal 10MB!");
            return;
        }

        setFile(selectedFile);

        // Buat preview untuk gambar
        if (selectedFile.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => setFilePreview(reader.result as string);
            reader.readAsDataURL(selectedFile);
        } else {
            setFilePreview(null);
        }
    };

    // Hapus file yang dipilih
    const clearFile = () => {
        setFile(null);
        setFilePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
            {/* File preview bar */}
            {file && (
                <div className="flex items-center gap-3 px-4 pt-3">
                    <div className="flex items-center gap-2 bg-[var(--color-bg)] rounded-lg px-3 py-2 border border-[var(--color-border)]">
                        {filePreview ? (
                            <img
                                src={filePreview}
                                alt="Preview"
                                className="w-10 h-10 rounded object-cover"
                            />
                        ) : (
                            <span className="text-xl">📄</span>
                        )}
                        <span className="text-xs text-[var(--color-text-muted)] max-w-[180px] truncate">
                            {file.name}
                        </span>
                        <button
                            onClick={clearFile}
                            className="text-[var(--color-text-muted)] hover:text-red-400 transition-colors text-sm ml-1"
                            title="Hapus file"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Input form */}
            <form
                onSubmit={handleSubmit}
                className="flex items-end gap-3 p-4"
            >
                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {/* Tombol attach file */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary-light)] hover:border-[var(--color-primary)] transition-all disabled:opacity-40"
                    title="Upload gambar atau PDF"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                </button>

                {/* Textarea input */}
                <textarea
                    id="chat-input"
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                        disabled ? "Velora sedang berpikir..." : "Ketik pesan..."
                    }
                    disabled={disabled}
                    className="flex-1 resize-none bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] rounded-xl px-4 py-3 text-sm border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all disabled:opacity-50"
                />

                {/* Tombol kirim */}
                <button
                    id="send-button"
                    type="submit"
                    disabled={disabled || (!input.trim() && !file)}
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
        </div>
    );
}
