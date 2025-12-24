// PATH: app/ClientGate.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const FIRST_OPEN_KEY = "rr_first_opened";

export default function ClientGate() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const already = localStorage.getItem(FIRST_OPEN_KEY);
    if (!already) {
      localStorage.setItem(FIRST_OPEN_KEY, "1");
      if (pathname !== "/xmas") router.replace("/xmas?first=1");
    }
  }, [pathname, router]);

  return null;
}

