// PATH: app/ClientGate.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getBool, setBool } from "@/lib/storage";

const FIRST_OPEN_KEY = "rr_first_open_done";

export default function ClientGate() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Prima apertura: redirect forzato su /xmas + banner Buon Natale
    const already = getBool(FIRST_OPEN_KEY, false);
    if (!already) {
      setBool(FIRST_OPEN_KEY, true);
      if (pathname !== "/xmas") router.replace("/xmas?first=1");
      return;
    }
  }, [pathname, router]);

  return null;
}
