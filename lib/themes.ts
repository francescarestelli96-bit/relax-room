export const SCENES = [
  { id: "rain", label: "Rain", subtitle: "Pioggia sul vetro" },
  { id: "ocean", label: "Ocean", subtitle: "Onde lente" },
  { id: "asmr", label: "ASMR", subtitle: "Suoni morbidi" },
  { id: "soft", label: "Soft", subtitle: "Fondo caldo" },
  { id: "xmas", label: "Xmas", subtitle: "Atmosfera natalizia" },
] as const;

export type SceneId = (typeof SCENES)[number]["id"];

export type Theme = {
  bg1: string;
  bg2: string;
  bg3: string;
  glow1: string;
  glow2: string;
};

export const THEMES: Record<SceneId, Theme> = {
  rain: { bg1: "10 14 24", bg2: "15 23 42", bg3: "30 41 59", glow1: "56 189 248", glow2: "59 130 246" },
  ocean: { bg1: "6 18 32", bg2: "10 28 48", bg3: "15 45 74", glow1: "34 211 238", glow2: "16 185 129" },
  asmr: { bg1: "18 12 22", bg2: "31 18 42", bg3: "52 30 74", glow1: "244 114 182", glow2: "167 139 250" },
  soft: { bg1: "20 16 10", bg2: "32 24 16", bg3: "64 45 24", glow1: "251 191 36", glow2: "244 63 94" },
  xmas: { bg1: "10 14 22", bg2: "16 24 36", bg3: "24 40 28", glow1: "34 197 94", glow2: "239 68 68" },
};

export function isSceneId(x: string | null): x is SceneId {
  return !!x && SCENES.some((s) => s.id === x);
}

export function themeToCssVars(theme: Theme) {
  return {
    "--bg-1": theme.bg1,
    "--bg-2": theme.bg2,
    "--bg-3": theme.bg3,
    "--glow-1": theme.glow1,
    "--glow-2": theme.glow2,
  } as Record<string, string>;
}

export function applyThemeForScene(scene: SceneId) {
  if (typeof document === "undefined") return;
  const t = THEMES[scene] ?? THEMES.xmas;
  const vars = themeToCssVars(t);
  const root = document.documentElement;
  for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
}
