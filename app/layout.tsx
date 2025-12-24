// PATH: app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import ClientGate from "./ClientGate";
import Navbar from "@/components/Navbar";
import DiaryDock from "@/components/DiaryDock";

export const metadata: Metadata = {
  title: "Relax Room",
  description: "Stanza relax – suoni, immagini, diario",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <ClientGate />
        <div className="min-h-dvh">
          <Navbar />
          <div className="mx-auto max-w-5xl px-4 pb-28 pt-6 md:pt-10">{children}</div>
          <DiaryDock />
        </div>
      </body>
    </html>
  );
}
