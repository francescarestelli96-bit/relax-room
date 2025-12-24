// PATH: components/SpecialMomentModal.tsx
"use client";

import { useEffect } from "react";

export const SPECIAL_MESSAGE = `Ciao amore.

Questa è la tua stanza relax.
Un posto piccolo, calmo, tuo.

Quando il mondo fa rumore,
qui puoi scegliere un suono
e rallentare.

Ti amo (uguale).
Sempre e per sempre.

Fra`;

export default function SpecialMomentModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/60" onClick={onClose} aria-label="Chiudi" />
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/12 bg-white/10 p-6 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Messaggio per Davide</h2>
              <p className="mt-1 text-sm text-zinc-300/80">Un micro-momento, ma di quelli veri.</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm hover:bg-black/30"
            >
              Chiudi
            </button>
          </div>

          <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/20 p-4 text-[15px] leading-relaxed text-zinc-100/90">
            {SPECIAL_MESSAGE}
          </pre>
        </div>
      </div>
    </div>
  );
}
