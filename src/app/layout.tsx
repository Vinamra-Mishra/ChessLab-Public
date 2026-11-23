import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteNav } from "@/components/SiteNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChessLab — Offline-First Desktop Chess Analysis & Coaching",
  description:
    "100% local, offline-first desktop chess analysis, Stockfish 19 game review, spaced-repetition repertoire training, and AI coaching. Public release coming soon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-[#090b0f] text-slate-100 antialiased chess-grid-bg">
        <SiteNav />
        <main className="mx-auto max-w-6xl px-6 py-14">{children}</main>
        <footer className="border-t border-white/10 py-8 text-center text-sm text-slate-400">
          ChessLab Desktop — Public Release Coming Soon
        </footer>
      </body>
    </html>
  );
}
