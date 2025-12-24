// PATH: components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/xmas", label: "Natale" },
  { href: "/", label: "Stanza relax" },
  { href: "/images", label: "Immagini" },
  { href: "/diary", label: "Diario" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-black/25 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="rr-chip">✨ Relax Room</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {items.map((it) => {
            const active = isActive(pathname, it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={[
                  "rounded-xl px-2.5 py-1.5 text-xs sm:text-sm transition ring-1",
                  active
                    ? "bg-white/18 text-white ring-white/18"
                    : "bg-white/8 text-zinc-200/90 ring-white/10 hover:bg-white/12",
                ].join(" ")}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
