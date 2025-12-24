// PATH: app/images/page.tsx
"use client";

const IMAGES = [
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  "https://images.unsplash.com/photo-1470770903676-69b98201ea1c",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9",
];

export default function ImagesPage() {
  return (
    <main className="min-h-screen px-4 py-6">
      <h1 className="text-xl font-semibold text-white">Immagini</h1>
      <p className="mt-1 text-sm text-zinc-300">
        Guardare senza fare niente.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {IMAGES.map((src, i) => (
          <img
            key={i}
            src={`${src}?auto=format&fit=crop&w=1200&q=60`}
            className="rounded-2xl object-cover"
            alt="Relax"
          />
        ))}
      </div>
    </main>
  );
}
