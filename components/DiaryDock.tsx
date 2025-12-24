// PATH: components/DiaryDock.tsx
"use client";

import { useMemo, useState } from "react";
import { saveNote } from "@/lib/notes";

export default function DiaryDock() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [savedPing, setSavedPing] = useState(false);

  const canSave = useMemo(() => title.trim().length > 0 || text.trim().length > 0, [title, text]);

  const onSave = () => {
    if (!canSave) return;
    saveNote({ title: title.trim() || "Senza titolo", text });
    setTitle("");
    setText("");
    setSavedPing(true);
    window.setTimeout(() => setSavedPing(false), 1200);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-5xl px-4 pb-4">
        <div className="rounded-3xl border border-white/10 bg-black/25 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden">
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-full px-5 py-3 flex items-center justify-between gap-3 hover:bg-white/5"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 border border-white/10">
                📝
              </span>
              <div className="text-left">
                <div className="text-sm font-semibold">Diario</div>
                <div className="text-[11px] text-zinc-300/80">
                  Scrivi qui. Anche brutto. Anche poco.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {savedPing ? (
                <span className="text-xs rounded-full border border-white/10 bg-white/10 px-3 py-1">
                  Salvato ✓
                </span>
              ) : null}
              <span className="text-sm opacity-80">{open ? "Chiudi" : "Apri"}</span>
            </div>
          </button>

          {open ? (
            <div className="px-5 pb-5">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titolo"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-white/20"
              />
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Scrivi qui…"
                rows={4}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-white/20"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-zinc-300/70">Salva in locale (localStorage)</span>
                <button
                  onClick={onSave}
                  disabled={!canSave}
                  className={[
                    "rounded-2xl px-4 py-2 text-sm font-semibold border transition",
                    canSave
                      ? "border-white/10 bg-white/15 hover:bg-white/20"
                      : "border-white/10 bg-white/5 opacity-60 cursor-not-allowed",
                  ].join(" ")}
                >
                  Salva
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
