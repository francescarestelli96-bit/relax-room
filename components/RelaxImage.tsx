// PATH: components/RelaxImage.tsx
"use client";

import { useMemo, useState } from "react";

function buildUrl(seed: number, tags: string[]) {
  const q = encodeURIComponent(tags.join(","));
  // "featured" cambia spesso; seed come cache-buster controllato
  return `https://source.unsplash.com/featured/1600x1000/?${q}&sig=${seed}`;
}

export default function RelaxImage() {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 10_000));
  const tags = useMemo(() => ["nature", "calm", "soft", "minimal", "ocean", "forest"], []);

  const url = useMemo(() => buildUrl(seed, tags), [seed, tags]);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="Immagine rilassante" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
      </div>

      <div className="relative p-6 md:p-8">
        <h2 className="text-2xl font-semibold">Respira con gli occhi</h2>
        <p className="mt-2 text-sm text-zinc-200/85 max-w-2xl">
          Immagini rilassanti prese da internet (royalty-free). Se ti piace, fermati. Se no, cambia.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={() => setSeed((s) => s + 1)}
            className="rounded-2xl border border-white/10 bg-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/20"
          >
            Cambia immagine
          </button>
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-zinc-200">
            Fonte: Unsplash
          </span>
        </div>
      </div>
    </section>
  );
}
