// PATH: components/DiaryDock.tsx
"use client";

import { useState } from "react";
import { saveNote } from "@/lib/notes";

export default function DiaryDock() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saved, setSaved] = useState(false);

  function onSave() {
    if (!title.trim() && !body.trim()) return;
    saveNote({ title: title.trim(), body: body.trim() });
    setTitle("");
    setBody("");
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  }

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 px-4">
      <div className="mx-auto max-w-xl rounded-2xl bg-black/40 backdrop-blur-xl ring-1 ring-white/15">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm text-zinc-200"
        >
          <span>📓 Diario</span>
          <span className="opacity-70">{open ? "Chiudi" : "Apri"}</span>
        </button>

        {open && (
          <div className="space-y-2 px-4 pb-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titolo"
              className="w-full rounded-md bg-white/10 px-3 py-2 text-sm text-white outline-none"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Scrivi qui. Anche brutto. Anche poco."
              rows={4}
              className="w-full rounded-md bg-white/10 px-3 py-2 text-sm text-white outline-none"
            />
            <div className="flex items-center justify-between">
              <button
                onClick={onSave}
                className="rounded-md bg-white/20 px-3 py-1.5 text-sm text-white"
              >
                Salva
              </button>
              {saved && <span className="text-xs text-zinc-300">Salvato ✓</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
