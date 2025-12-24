// PATH: components/SoundMixer.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SCENES, SceneId, setSafeVolume } from "@/lib/audio";
import { THEMES, themeToCssVars } from "@/lib/themes";
import { getJson, setJson } from "@/lib/storage";

type MixerState = {
  sceneId: SceneId;
  isPlaying: boolean;
  volume: number;
  needsGesture: boolean;
  transitioning: boolean;
};

const MIXER_KEY = "rr_mixer_state";

function applyTheme(sceneId: SceneId) {
  const t = THEMES[sceneId];
  const vars = themeToCssVars(t);
  for (const [k, v] of Object.entries(vars)) {
    document.documentElement.style.setProperty(k, v);
  }
}

export default function SoundMixer() {
  const initial = getJson<MixerState>(MIXER_KEY, {
    sceneId: "xmas",
    isPlaying: false,
    volume: 0.85,
    needsGesture: false,
    transitioning: false,
  });

  const [state, setState] = useState<MixerState>(initial);

  const scene = useMemo(
    () => SCENES.find((s) => s.id === state.sceneId) ?? SCENES[0]!,
    [state.sceneId]
  );

  const activeRef = useRef<HTMLAudioElement | null>(null);
  const standbyRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const abortRef = useRef(false);

  const ensure = useCallback(
    (src: string) => {
      if (!activeRef.current) {
        const a = new Audio(src);
        a.loop = true;
        a.preload = "auto";
        setSafeVolume(a, state.volume);
        activeRef.current = a;
      }
      if (!standbyRef.current) {
        const b = new Audio(src);
        b.loop = true;
        b.preload = "auto";
        setSafeVolume(b, 0);
        standbyRef.current = b;
      }
    },
    [state.volume]
  );

  useEffect(() => {
    ensure(scene.src);
    applyTheme(state.sceneId);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      abortRef.current = true;
      activeRef.current?.pause();
      standbyRef.current?.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setJson(MIXER_KEY, state);
  }, [state]);

  useEffect(() => {
    applyTheme(state.sceneId);
  }, [state.sceneId]);

  useEffect(() => {
    if (activeRef.current && !state.transitioning) setSafeVolume(activeRef.current, state.volume);
  }, [state.volume, state.transitioning]);

  const play = useCallback(async () => {
    ensure(scene.src);
    const a = activeRef.current;
    if (!a) return;

    setState((s) => ({ ...s, needsGesture: false }));
    try {
      await a.play();
      setState((s) => ({ ...s, isPlaying: true }));
    } catch {
      setState((s) => ({ ...s, isPlaying: false, needsGesture: true }));
    }
  }, [ensure, scene.src]);

  const pause = useCallback(() => {
    activeRef.current?.pause();
    standbyRef.current?.pause();
    setState((s) => ({ ...s, isPlaying: false }));
  }, []);

  const toggle = useCallback(() => {
    if (state.isPlaying) pause();
    else void play();
  }, [pause, play, state.isPlaying]);

  const setVolume = (v: number) => {
    const vol = Math.max(0, Math.min(1, v));
    setState((s) => ({ ...s, volume: vol }));
  };

  const crossfadeTo = useCallback(
    async (nextId: SceneId) => {
      if (nextId === state.sceneId) return;

      ensure(scene.src);
      const active = activeRef.current;
      const standby = standbyRef.current;
      if (!active || !standby) return;

      abortRef.current = true;
      abortRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setState((s) => ({ ...s, transitioning: true, sceneId: nextId }));

      const next = SCENES.find((s) => s.id === nextId);
      if (!next) return;

      standby.src = next.src;
      standby.currentTime = 0;
      standby.loop = true;
      standby.preload = "auto";
      setSafeVolume(standby, 0);

      const wantPlay = state.isPlaying;

      if (wantPlay) {
        try {
          await standby.play();
        } catch {
          setState((s) => ({ ...s, transitioning: false, isPlaying: false, needsGesture: true }));
          return;
        }
      }

      const start = performance.now();
      const duration = 650;
      const startActiveVol = wantPlay ? state.volume : 0;

      const step = (now: number) => {
        if (abortRef.current) return;

        const t = Math.min(1, (now - start) / duration);
        setSafeVolume(active, startActiveVol * (1 - t));
        setSafeVolume(standby, state.volume * t);

        if (t < 1) {
          rafRef.current = requestAnimationFrame(step);
          return;
        }

        active.pause();
        setSafeVolume(active, 0);

        const tmp = activeRef.current;
        activeRef.current = standbyRef.current;
        standbyRef.current = tmp;

        if (activeRef.current) setSafeVolume(activeRef.current, state.volume);
        if (standbyRef.current) setSafeVolume(standbyRef.current, 0);

        setState((s) => ({ ...s, transitioning: false, isPlaying: wantPlay }));
      };

      rafRef.current = requestAnimationFrame(step);
    },
    [ensure, scene.src, state.isPlaying, state.sceneId, state.volume]
  );

  return (
    <section className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Sound Mixer</h2>
        <p className="text-sm text-zinc-300/80">Scegli una scena. Il cambio è morbido (crossfade).</p>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-zinc-200">
          Scena: <strong className="font-semibold">{scene.label}</strong>
          {state.transitioning ? <span className="opacity-70">• transizione…</span> : null}
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggle}
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            {state.isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      </div>

      {state.needsGesture ? (
        <div className="mt-3 rounded-2xl border border-amber-200/20 bg-amber-200/10 px-4 py-3 text-sm text-amber-50">
          Autoplay bloccato: <strong>tocca Play</strong> per attivare l’audio.
        </div>
      ) : null}

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="flex items-center gap-3">
          <span className="w-10 text-xs text-zinc-300">Vol</span>
          <input
            className="w-full accent-white/80"
            type="range"
            min={0}
            max={100}
            value={Math.round(state.volume * 100)}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
          />
          <span className="w-12 text-right text-xs text-zinc-300">{Math.round(state.volume * 100)}%</span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {SCENES.map((s) => (
          <button
            key={s.id}
            disabled={state.transitioning}
            onClick={() => void crossfadeTo(s.id)}
            className={[
              "rounded-2xl border p-4 text-left transition",
              s.id === state.sceneId ? "border-white/25 bg-white/15" : "border-white/10 bg-white/5 hover:bg-white/10",
              state.transitioning ? "opacity-70 cursor-not-allowed" : "",
            ].join(" ")}
          >
            <div className="font-semibold">{s.label}</div>
            <div className="mt-1 text-xs text-zinc-400">{s.vibe}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
