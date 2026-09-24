import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Artivices — Websites built for businesses that mean it",
  description:
    "Artivices designs and builds bespoke websites for ambitious companies. Strategy, design and engineering, delivered as one considered piece of work.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-body antialiased bg-ink text-linen">
        {children}
      </body>
    </html>
  );
}
