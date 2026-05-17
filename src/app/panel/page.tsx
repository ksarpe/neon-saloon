"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, LogOut, Trash2, Loader2, Send } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Question {
  id: string;
  text: string;
  createdAt: string;
}

// ─── Nigdy przenigdy tab ──────────────────────────────────────────────────────

function NeverTab() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/questions/never");
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!text.trim()) return;
    setAdding(true);
    setError(null);
    try {
      const res = await fetch("/api/questions/never", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setQuestions((prev) => [created, ...prev]);
      setText("");
    } catch {
      setError("Nie udało się dodać pytania.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await fetch(`/api/questions/never/${id}`, { method: "DELETE" });
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Add form */}
      <div
        className="rounded-2xl border p-5 flex flex-col gap-3"
        style={{
          borderColor: "rgba(255,220,180,0.12)",
          backgroundColor: "rgba(13,8,24,0.5)",
        }}
      >
        <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--neon-pink)" }}>
          Nowe wyznanie
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !adding && handleAdd()}
            maxLength={200}
            placeholder="Nigdy przenigdy nie…"
            className="flex-1 bg-saloon-surface border-2 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none transition-colors"
            style={{
              borderColor: text.trim() ? "var(--neon-pink)" : "var(--saloon-border)",
            }}
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={!text.trim() || adding}
            onClick={handleAdd}
            className="px-4 rounded-xl border-2 flex items-center justify-center disabled:opacity-30 shrink-0"
            style={{
              borderColor: "var(--neon-pink)",
              backgroundColor: "rgba(255,16,240,0.1)",
              color: "var(--neon-pink)",
            }}
          >
            {adding ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          </motion.button>
        </div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className="animate-spin" style={{ color: "var(--neon-pink)" }} />
        </div>
      ) : questions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3 py-16 text-center"
        >
          <span className="text-5xl">🙈</span>
          <p className="text-sm text-text-muted">
            Nie masz jeszcze żadnych własnych wyznań.<br />
            Dodaj pierwsze powyżej!
          </p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-widest text-text-muted font-semibold">
            Twoje wyznania ({questions.length})
          </p>
          <AnimatePresence initial={false}>
            {questions.map((q) => (
              <motion.div
                key={q.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl border group"
                style={{
                  borderColor: "rgba(255,220,180,0.1)",
                  backgroundColor: "rgba(13,8,24,0.4)",
                }}
              >
                <span className="flex-1 text-sm text-text-primary leading-snug">
                  {q.text}
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(q.id)}
                  disabled={deletingId === q.id}
                  className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  style={{
                    backgroundColor: "rgba(239,68,68,0.1)",
                    color: "#f87171",
                    border: "1px solid rgba(239,68,68,0.2)",
                  }}
                >
                  {deletingId === q.id
                    ? <Loader2 size={13} className="animate-spin" />
                    : <Trash2 size={13} />}
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PanelPage() {
  const { data: session } = useSession();

  return (
    <div className="w-full min-h-dvh flex flex-col">

      {/* Header */}
      <div className="relative z-10 shrink-0 border-b" style={{ borderColor: "rgba(255,220,180,0.1)" }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between px-6 py-4">
          <h1
            className="text-xl tracking-widest shimmer-text"
            style={{ fontFamily: "var(--font-app)" }}
          >
            Panel szeryfa
          </h1>
          <div className="flex items-center gap-3">
            {session?.user?.name && (
              <span className="text-xs text-text-muted hidden sm:block">{session.user.name}</span>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors"
              style={{ borderColor: "rgba(255,220,180,0.15)", color: "rgba(255,220,180,0.55)" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; e.currentTarget.style.color = "#f87171"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,220,180,0.15)"; e.currentTarget.style.color = "rgba(255,220,180,0.55)"; }}
            >
              <LogOut size={12} />
              Wyloguj
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 flex-1 max-w-3xl mx-auto w-full px-6 py-8 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-widest"
            style={{
              backgroundColor: "rgba(255,16,240,0.1)",
              borderColor: "rgba(255,16,240,0.25)",
              color: "var(--neon-pink)",
            }}
          >
            <BookOpen size={13} />
            Nigdy przenigdy
          </div>
          <p className="text-xs text-text-muted">własne wyznania dokładane do talii</p>
        </div>

        <NeverTab />
      </div>
    </div>
  );
}
