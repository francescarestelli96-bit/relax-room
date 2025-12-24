// PATH: app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Relax Room",
  description: "Una stanza piccola, calma, tua.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>
        <div className="rr-shell">
          <Navbar />
          <div className="rr-container">{children}</div>
        </div>
      </body>
    </html>
  );
}
