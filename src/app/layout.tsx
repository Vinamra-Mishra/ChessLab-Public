import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const display = localFont({
  src: "./fonts/bricolage-wght.woff2",
  weight: "200 800",
  display: "swap",
  variable: "--font-display",
  fallback: ["Inter Tight", "Arial", "sans-serif"],
});

const body = localFont({
  src: "./fonts/inter-tight-wght.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-body",
  fallback: ["Arial", "sans-serif"],
});

const mono = localFont({
  src: "./fonts/jetbrains-mono-wght.woff2",
  weight: "100 800",
  display: "swap",
  variable: "--font-mono",
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});

const serif = localFont({
  src: [
    { path: "./fonts/instrument-serif.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-italic.woff2", weight: "400", style: "italic" },
  ],
  display: "swap",
  variable: "--font-serif",
  fallback: ["Times New Roman", "Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chesslab.app"),
  title: {
    default: "ChessLab — Offline Chess Analysis & ATHENA AI Coach",
    template: "%s · ChessLab",
  },
  description:
    "A 100% local desktop chess workstation built with Tauri v2, Rust, Stockfish 19, and ATHENA — human-like neural sparring, verified game review, opening studio, and 4-tier mastery tracking with zero cloud.",
  applicationName: "ChessLab",
  keywords: [
    "chess",
    "chess analysis",
    "Stockfish 19",
    "ATHENA AI coach",
    "Maia-3",
    "offline chess",
    "game review",
    "opening repertoire",
    "Tauri",
  ],
  openGraph: {
    title: "ChessLab — Offline Chess Analysis & ATHENA AI Coach",
    description:
      "Stockfish 19 analysis, Maia-3 + ChessMimic human sparring, and Stockfish-verified coaching — 100% local in pure Rust.",
    type: "website",
    siteName: "ChessLab",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChessLab — Offline Chess Analysis & ATHENA AI Coach",
    description:
      "100% local Stockfish 19 analysis, human-like ATHENA sparring, and verified game review on your own CPU.",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} ${serif.variable}`}
    >
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
