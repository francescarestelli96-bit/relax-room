// PATH: lib/notes.ts
export type Note = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
};

const KEY = "rr_notes_v1";

function uid() {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
}

export function getNotes(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveNote(input: { title: string; body: string }) {
  const notes = getNotes();
  const now = Date.now();

  const note: Note = {
    id: uid(),
    title: input.title || "Senza titolo",
    body: input.body,
    createdAt: now,
    updatedAt: now,
  };

  const next = [note, ...notes];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function deleteNote(id: string) {
  const next = getNotes().filter((n) => n.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
