import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteNav } from "@/components/SiteNav";
import "./globals.css";

const geistSans = localFont({
  src: "../../public/fonts/geist-latin.woff2",
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "../../public/fonts/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
  display: "swap",
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
        <main className="animate-page-enter px-6 py-8 sm:px-8 sm:py-10">{children}</main>
      </body>
    </html>
  );
}
