// PATH: app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { applyThemeForScene, isSceneId, SCENES, type SceneId } from "@/lib/themes";

type Note = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
};

const NOTES_KEY = "rr_notes_v1";
const SCENE_KEY = "rr_scene";

const AUDIO: Record<SceneId, string> = {
  rain: "/audio/rain.mp3",
  ocean: "/audio/ocean.mp3",
  asmr: "/audio/asmr.mp3",
  soft: "/audio/soft.mp3",
  xmas: "/audio/xmas.mp3",
};

function now() {
  return Date.now();
}

function uid() {
  return Math.random().toString(16).slice(2) + "-" + Math.random().toString(16).slice(2);
}

function readNotes(): Note[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Note[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeNotes(notes: Note[]) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function safeReadScene(): SceneId {
  const raw = localStorage.getItem(SCENE_KEY);
  return isSceneId(raw) ? raw : "xmas";
}

function clamp01(v: number) {
  if (Number.isNaN(v)) return 0;
  return Math.min(1, Math.max(0, v));
}

function fmtTime(ms: number) {
  return new Date(ms).toLocaleString("it-IT");
}

export default function HomePage() {
  // scene + theme
  const [scene, setScene] = useState<SceneId>("xmas");

  // audio
  const activeRef = useRef<HTMLAudioElement | null>(null);
  const standbyRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  // special modal
  const [specialOpen, setSpecialOpen] = useState(false);

  // diary dock (mini)
  const [notes, setNotes] = useState<Note[]>([]);
  const [dockOpen, setDockOpen] = useState(false);

  // editor
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const sceneMeta = useMemo(() => SCENES.find((s) => s.id === scene), [scene]);

  useEffect(() => {
    const s = safeReadScene();
    setScene(s);
    applyThemeForScene(s);
    setNotes(readNotes());
  }, []);

  useEffect(() => {
    localStorage.setItem(SCENE_KEY, scene);
    applyThemeForScene(scene);
    // preload standby for next switch
    ensureAudio(standbyRef, AUDIO[scene], 0);
  }, [scene]);

  function ensureAudio(ref: React.MutableRefObject<HTMLAudioElement | null>, src: string, vol: number) {
    if (ref.current && ref.current.src.includes(src)) {
      ref.current.volume = clamp01(vol);
      return;
    }
    const a = new Audio(src);
    a.loop = true;
    a.preload = "auto";
    a.volume = clamp01(vol);
    ref.current = a;
  }

  function stopRaf() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }

  function fadeVolumes(from: HTMLAudioElement, to: HTMLAudioElement, targetVol: number, ms = 800) {
    stopRaf();
    const start = performance.now();
    const fromStart = from.volume;
    const toStart = to.volume;
    const tv = clamp01(targetVol);

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      // ease in-out
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

      from.volume = clamp01(fromStart * (1 - e));
      to.volume = clamp01(toStart + (tv - toStart) * e);

      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else {
        from.volume = 0;
        to.volume = tv;
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }

  async function play() {
    setAutoplayBlocked(false);

    ensureAudio(activeRef, AUDIO[scene], volume);
    ensureAudio(standbyRef, AUDIO[scene], 0); // standby same src ok

    const a = activeRef.current!;
    try {
      await a.play();
      setIsPlaying(true);
    } catch {
      setAutoplayBlocked(true);
      setIsPlaying(false);
    }
  }

  function pause() {
    stopRaf();
    activeRef.current?.pause();
    standbyRef.current?.pause();
    setIsPlaying(false);
  }

  async function switchScene(next: SceneId) {
    setScene(next);

    if (!isPlaying) return;

    ensureAudio(activeRef, AUDIO[scene], volume);
    ensureAudio(standbyRef, AUDIO[next], 0);

    const from = activeRef.current!;
    const to = standbyRef.current!;

    try {
      await to.play();
      fadeVolumes(from, to, volume, 850);
      // swap refs after fade
      window.setTimeout(() => {
        from.pause();
        from.currentTime = 0;
        const tmp = activeRef.current;
        activeRef.current = standbyRef.current;
        standbyRef.current = tmp;
      }, 900);
    } catch {
      setAutoplayBlocked(true);
      setIsPlaying(false);
    }
  }

  function onVolume(v: number) {
    const vv = clamp01(v);
    setVolume(vv);
    if (activeRef.current) activeRef.current.volume = vv;
  }

  // diary dock
  function openDock() {
    setDockOpen(true);
    setEditingId("NEW");
    setTitle("");
    setBody("");
  }

  function closeDock() {
    setDockOpen(false);
    setEditingId(null);
    setTitle("");
    setBody("");
  }

  function saveNote() {
    const t = title.trim();
    const b = body.trim();
    if (!t && !b) return;

    const ts = now();

    if (editingId === "NEW") {
      const n: Note = {
        id: uid(),
        title: t || "Senza titolo",
        body: b,
        createdAt: ts,
        updatedAt: ts,
      };
      const next = [n, ...notes];
      setNotes(next);
      writeNotes(next);
      setTitle("");
      setBody("");
      return;
    }

    if (!editingId) return;

    const next = notes.map((n) =>
      n.id === editingId ? { ...n, title: t || "Senza titolo", body: b, updatedAt: ts } : n
    );
    setNotes(next);
    writeNotes(next);
  }

  const loveLetter = useMemo(
    () => `Ciao amore.

Questa è la tua stanza relax.
Un posto piccolo, calmo, tuo.

Quando il mondo fa rumore,
qui puoi scegliere un suono
e rallentare.

Ti amo (uguale).
Sempre e per sempre.

Fra`,
    []
  );

  return (
    <main className="min-h-screen px-4 py-6 sm:px-8">
      <header className="mx-auto max-w-5xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">Stanza relax</h1>
            <p className="mt-1 text-sm text-zinc-300">Scegli un suono. Respira. Rallenta.</p>
          </div>

          <nav className="flex flex-wrap justify-end gap-2 text-sm">
            <Link className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15 hover:bg-white/15" href="/xmas">
              Natale
            </Link>
            <Link className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15 hover:bg-white/15" href="/images">
              Immagini
            </Link>
            <Link className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15 hover:bg-white/15" href="/diary">
              Diario
            </Link>
          </nav>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setSpecialOpen(true)}
            className="rounded-full bg-white/15 px-4 py-2 text-sm text-zinc-100 ring-1 ring-white/15 hover:bg-white/20"
          >
            ✨ Momento speciale
          </button>

          <div className="flex items-center gap-2 rounded-full bg-black/20 px-4 py-2 ring-1 ring-white/10">
            <span className="text-sm text-zinc-200">Scena:</span>
            <span className="text-sm font-semibold text-zinc-100">{sceneMeta?.label}</span>
          </div>

          <button
            onClick={() => (isPlaying ? pause() : play())}
            className="rounded-full bg-white/15 px-5 py-2 text-sm text-zinc-100 ring-1 ring-white/15 hover:bg-white/20"
          >
            {isPlaying ? "Pausa" : "Play"}
          </button>

          <div className="flex flex-1 items-center gap-3 rounded-full bg-black/20 px-4 py-2 ring-1 ring-white/10">
            <span className="text-xs text-zinc-300">Vol</span>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(volume * 100)}
              onChange={(e) => onVolume(Number(e.target.value) / 100)}
              className="w-full"
            />
          </div>
        </div>

        {autoplayBlocked && (
          <div className="mt-3 rounded-2xl bg-white/10 p-3 text-sm text-zinc-100 ring-1 ring-white/15">
            Audio bloccato dal browser: <b>tocca Play</b>.
          </div>
        )}
      </header>

      <section className="mx-auto mt-6 grid max-w-5xl gap-4 lg:grid-cols-2">
        {SCENES.map((s) => (
          <button
            key={s.id}
            onClick={() => switchScene(s.id)}
            className={[
              "text-left rounded-3xl p-4 backdrop-blur-xl ring-1 transition",
              s.id === scene
                ? "bg-white/15 ring-white/25"
                : "bg-white/10 ring-white/15 hover:bg-white/12",
            ].join(" ")}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">{s.label}</h3>
              <span className="text-xs text-zinc-300">{s.id === scene ? "attiva" : "seleziona"}</span>
            </div>
            <p className="mt-2 text-sm text-zinc-300">
              {s.id === "rain" && "Pioggia sul vetro"}
              {s.id === "ocean" && "Onde lente"}
              {s.id === "asmr" && "Suoni morbidi"}
              {s.id === "soft" && "Fondo caldo"}
              {s.id === "xmas" && "Atmosfera natalizia"}
            </p>
          </button>
        ))}
      </section>

      {/* Diario dock sempre visibile */}
      <div className="mx-auto mt-6 max-w-5xl">
        <div className="rounded-3xl bg-white/10 p-4 backdrop-blur-xl ring-1 ring-white/15">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">📝 Diario</h2>
              <p className="mt-1 text-sm text-zinc-300">Scrivi qui. Anche brutto. Anche poco.</p>
            </div>
            <button
              onClick={openDock}
              className="rounded-2xl bg-white/15 px-4 py-2 text-sm text-zinc-100 ring-1 ring-white/15 hover:bg-white/20"
            >
              Apri
            </button>
          </div>

          {notes.slice(0, 2).length > 0 && (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {notes
                .slice()
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .slice(0, 2)
                .map((n) => (
                  <div key={n.id} className="rounded-2xl bg-black/15 p-3 ring-1 ring-white/10">
                    <div className="text-sm font-semibold text-zinc-100">{n.title}</div>
                    <div className="mt-1 line-clamp-2 text-sm text-zinc-300">{n.body}</div>
                    <div className="mt-2 text-xs text-zinc-400">{fmtTime(n.updatedAt)}</div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal speciale */}
      {specialOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
          <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white/10 p-5 backdrop-blur-xl ring-1 ring-white/20">
            <Stars />
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-semibold text-zinc-100">Ciao amore.</h2>
              <button
                onClick={() => setSpecialOpen(false)}
                className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-zinc-100 ring-1 ring-white/15 hover:bg-white/15"
              >
                Chiudi
              </button>
            </div>
            <pre className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">
              {loveLetter}
            </pre>
          </div>
        </div>
      )}

      {/* Dock editor */}
      {dockOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-4 sm:items-center">
          <div className="w-full max-w-2xl rounded-3xl bg-white/10 p-5 backdrop-blur-xl ring-1 ring-white/20">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">Diario</h2>
                <p className="mt-1 text-sm text-zinc-300">Scrivi. Salva. Fine.</p>
              </div>
              <button
                onClick={closeDock}
                className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-zinc-100 ring-1 ring-white/15 hover:bg-white/15"
              >
                Chiudi
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titolo"
                className="rounded-2xl bg-black/20 px-4 py-2 text-sm text-zinc-100 ring-1 ring-white/10 placeholder:text-zinc-400"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Testo…"
                rows={8}
                className="resize-none rounded-2xl bg-black/20 px-4 py-3 text-sm text-zinc-100 ring-1 ring-white/10 placeholder:text-zinc-400"
              />

              <div className="flex gap-2">
                <button
                  onClick={saveNote}
                  className="flex-1 rounded-2xl bg-white/15 px-4 py-2 text-sm text-zinc-100 ring-1 ring-white/15 hover:bg-white/20"
                >
                  Salva
                </button>
                <Link
                  href="/diary"
                  className="rounded-2xl bg-white/10 px-4 py-2 text-sm text-zinc-100 ring-1 ring-white/10 hover:bg-white/15"
                >
                  Vai al diario →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Stars() {
  // semplice animazione senza librerie
  const stars = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 60,
        delay: Math.random() * 1.2,
        dur: 1.2 + Math.random() * 1.2,
        size: 2 + Math.random() * 3,
        o: 0.25 + Math.random() * 0.35,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity: s.o,
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes twinkle {
          0% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.8); opacity: 0.7; }
          100% { transform: scale(1); opacity: 0.25; }
        }
      `}</style>
    </div>
  );
}
