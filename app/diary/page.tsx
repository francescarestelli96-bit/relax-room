// PATH: app/diary/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getNotes, deleteNote, Note } from "@/lib/notes";
import DiaryDock from "@/components/DiaryDock";

export default function DiaryPage() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    setNotes(getNotes());
  }, []);

  return (
    <main className="min-h-screen px-4 py-6">
      <h1 className="text-xl font-semibold text-white">Diario</h1>
      <p className="mt-1 text-sm text-zinc-300">
        Pensieri liberi. Nessuna forma. Nessun giudizio.
      </p>

      <div className="mt-6 space-y-4">
        {notes.length === 0 && (
          <p className="text-sm text-zinc-400">Nessuna nota ancora.</p>
        )}

        {notes.map((n) => (
          <div
            key={n.id}
            className="rounded-xl bg-white/10 p-4 ring-1 ring-white/10"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-white">{n.title}</h3>
              <button
                onClick={() => {
                  const next = deleteNote(n.id);
                  setNotes(next);
                }}
                className="text-xs text-zinc-400"
              >
                Elimina
              </button>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-200">
              {n.body}
            </p>
          </div>
        ))}
      </div>

      <DiaryDock />
    </main>
  );
}
