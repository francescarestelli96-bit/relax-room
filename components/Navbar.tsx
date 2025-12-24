// PATH: components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const p = usePathname();
  const active = p === href;
  return (
    <Link
      href={href}
      className={[
        "rounded-2xl px-4 py-2 text-sm border transition",
        active ? "bg-white/15 border-white/15" : "bg-white/5 border-white/10 hover:bg-white/10",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 border border-white/10">
            ✨
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Relax Room</div>
            <div className="text-[11px] text-zinc-300/80">piccola, calma, tua</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NavLink href="/xmas">Natale</NavLink>
          <NavLink href="/">Stanza relax</NavLink>
          <NavLink href="/visual">Immagini</NavLink>
          <NavLink href="/diary">Diario</NavLink>
        </div>
      </div>
    </div>
  );
}
