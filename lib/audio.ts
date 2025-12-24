// PATH: lib/audio.ts
export type SceneId = "rain" | "ocean" | "asmr" | "soft" | "xmas";
export type Scene = { id: SceneId; label: string; src: string; vibe: string };

export const SCENES: Scene[] = [
  { id: "rain", label: "Rain", src: "/audio/rain.mp3", vibe: "Pioggia sul vetro" },
  { id: "ocean", label: "Ocean", src: "/audio/ocean.mp3", vibe: "Onde lente" },
  { id: "asmr", label: "ASMR", src: "/audio/asmr.mp3", vibe: "Suoni morbidi" },
  { id: "soft", label: "Soft", src: "/audio/soft.mp3", vibe: "Fondo caldo" },
  { id: "xmas", label: "Xmas", src: "/audio/xmas.mp3", vibe: "Atmosfera natalizia" },
];

export function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export function setSafeVolume(a: HTMLAudioElement, v: number) {
  a.volume = clamp01(v);
}
