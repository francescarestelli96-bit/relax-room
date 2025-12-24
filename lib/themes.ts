// PATH: lib/themes.ts
export type SceneId = "rain" | "ocean" | "asmr" | "soft" | "xmas";

export type Theme = {
  bg1: [number, number, number];
  bg2: [number, number, number];
  bg3: [number, number, number];
  glow1: [number, number, number];
  glow2: [number, number, number];
};

export const THEMES: Record<SceneId, Theme> = {
  rain: {
    bg1: [15, 23, 42],
    bg2: [30, 41, 59],
    bg3: [51, 65, 85],
    glow1: [245, 158, 11],
    glow2: [236, 72, 153],
  },
  ocean: {
    bg1: [2, 44, 34],
    bg2: [6, 78, 59],
    bg3: [15, 118, 110],
    glow1: [34, 211, 238],
    glow2: [16, 185, 129],
  },
  asmr: {
    bg1: [46, 16, 101],
    bg2: [76, 29, 149],
    bg3: [109, 40, 217],
    glow1: [217, 70, 239],
    glow2: [168, 85, 247],
  },
  soft: {
    bg1: [43, 31, 31],
    bg2: [75, 46, 46],
    bg3: [107, 63, 63],
    glow1: [251, 191, 36],
    glow2: [244, 114, 182],
  },
  xmas: {
    bg1: [63, 29, 43],
    bg2: [127, 29, 29],
    bg3: [185, 28, 28],
    glow1: [250, 204, 21],
    glow2: [34, 197, 94],
  },
};

export function themeToCssVars(t: Theme) {
  const rgb = (v: [number, number, number]) => `${v[0]} ${v[1]} ${v[2]}`;
  return {
    "--bg-1": rgb(t.bg1),
    "--bg-2": rgb(t.bg2),
    "--bg-3": rgb(t.bg3),
    "--glow-1": rgb(t.glow1),
    "--glow-2": rgb(t.glow2),
  } as const;
}
