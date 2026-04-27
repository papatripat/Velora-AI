"use client";

import Image from "next/image";

// ============================================================
// ChatSidebar - Sidebar riwayat percakapan
// ============================================================

interface Conversation {
    id: string;
    title: string;
    createdAt: number;
}

interface ChatSidebarProps {
    conversations: Conversation[];
    activeId: string | null;
    isOpen: boolean;
    onSelect: (id: string) => void;
    onNew: () => void;
    onDelete: (id: string) => void;
    onToggle: () => void;
}

export default function ChatSidebar({
    conversations,
    activeId,
    isOpen,
    onSelect,
    onNew,
    onDelete,
    onToggle,
}: ChatSidebarProps) {
    // Format tanggal
    const formatDate = (ts: number) => {
        const d = new Date(ts);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return "Hari ini";
        if (days === 1) return "Kemarin";
        if (days < 7) return `${days} hari lalu`;
        return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    };

    return (
        <>
            {/* Overlay background */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full z-30 w-72 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Header sidebar */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--color-border)]">
                    <Image
                        src="/velora-logo.png"
                        alt="Velora AI"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-bold text-white flex-1">Velora AI</span>
                    <button
                        onClick={onToggle}
                        className="text-[var(--color-text-muted)] hover:text-white transition-colors"
                        title="Tutup sidebar"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                </div>

                {/* Tombol New Chat */}
                <div className="p-3">
                    <button
                        onClick={onNew}
                        className="w-full flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-95"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        New Chat
                    </button>
                </div>

                {/* Daftar percakapan */}
                <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
                    {conversations.length === 0 && (
                        <p className="text-center text-[var(--color-text-muted)] text-xs mt-8">
                            Belum ada riwayat chat
                        </p>
                    )}

                    {conversations.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => onSelect(conv.id)}
                            className={`group flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer transition-all ${activeId === conv.id
                                ? "bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30"
                                : "hover:bg-[var(--color-surface-light)] border border-transparent"
                                }`}
                        >
                            {/* Icon chat */}
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`shrink-0 ${activeId === conv.id
                                    ? "text-[var(--color-primary-light)]"
                                    : "text-[var(--color-text-muted)]"
                                    }`}
                            >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>

                            {/* Title + date */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-[var(--color-text)] truncate">
                                    {conv.title}
                                </p>
                                <p className="text-[10px] text-[var(--color-text-muted)]">
                                    {formatDate(conv.createdAt)}
                                </p>
                            </div>

                            {/* Delete button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(conv.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-red-400 transition-all text-xs shrink-0"
                                title="Hapus chat"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </aside>
        </>
    );
}
