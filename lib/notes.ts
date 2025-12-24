// PATH: lib/notes.ts
import { getJson, setJson } from "./storage";

export type Note = {
  id: string;
  title: string;
  text: string;
  createdAt: number;
  updatedAt: number;
};

const NOTES_KEY = "rr_notes";

export function listNotes(): Note[] {
  return getJson<Note[]>(NOTES_KEY, []);
}

export function saveNote(input: { id?: string; title: string; text: string }): Note {
  const now = Date.now();
  const notes = listNotes();

  if (input.id) {
    const idx = notes.findIndex((n) => n.id === input.id);
    if (idx >= 0) {
      const updated: Note = { ...notes[idx]!, title: input.title, text: input.text, updatedAt: now };
      notes[idx] = updated;
      setJson(NOTES_KEY, notes);
      return updated;
    }
  }

  const created: Note = {
    id: crypto.randomUUID(),
    title: input.title.trim() || "Senza titolo",
    text: input.text,
    createdAt: now,
    updatedAt: now,
  };
  setJson(NOTES_KEY, [created, ...notes]);
  return created;
}

export function deleteNote(id: string) {
  const notes = listNotes().filter((n) => n.id !== id);
  setJson(NOTES_KEY, notes);
}
