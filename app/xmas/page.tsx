// PATH: app/xmas/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { applyThemeForScene } from "@/lib/themes";
import { useSearchParams } from "next/navigation";

export default function XmasPage() {
  const sp = useSearchParams();
  const [toast, setToast] = useState(false);

  const text = useMemo(
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

  useEffect(() => {
    applyThemeForScene("xmas");
    if (sp.get("first") === "1") {
      setToast(true);
      const t = window.setTimeout(() => setToast(false), 3500);
      return () => window.clearTimeout(t);
    }
  }, [sp]);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-8">
      {toast && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full bg-white/15 px-4 py-2 text-sm text-zinc-100 backdrop-blur-md ring-1 ring-white/20">
          🎄 Buon Natale!
        </div>
      )}

      <header className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold text-zinc-100">Natale</h1>
        <p className="mt-1 text-sm text-zinc-300">Un posto piccolo, calmo, tuo.</p>

        <nav className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15 hover:bg-white/15" href="/">
            Stanza relax
          </Link>
          <Link className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15 hover:bg-white/15" href="/images">
            Immagini
          </Link>
          <Link className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15 hover:bg-white/15" href="/diary">
            Diario
          </Link>
        </nav>
      </header>

      <section className="mx-auto mt-6 max-w-3xl rounded-3xl bg-white/10 p-5 backdrop-blur-xl ring-1 ring-white/15">
        <h2 className="text-lg font-semibold text-zinc-100">Ciao amore.</h2>
        <pre className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">{text}</pre>
      </section>
    </main>
  );
}
