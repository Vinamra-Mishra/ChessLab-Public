import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteNav } from "@/components/SiteNav";
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
    default: "ChessLab — The offline chess studio",
    template: "%s · ChessLab",
  },
  description:
    "An offline-first chess studio for analysis, game review, opening repertoire, and long-term improvement. Powered by Stockfish 19. Your games stay on your machine.",
  applicationName: "ChessLab",
  keywords: ["chess", "chess analysis", "Stockfish", "offline chess", "game review", "opening repertoire"],
  openGraph: {
    title: "ChessLab — The offline chess studio",
    description:
      "Master every move. Offline-first analysis, phase-by-phase review, and a repertoire that sticks.",
    type: "website",
    siteName: "ChessLab",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChessLab — The offline chess studio",
    description: "Master every move. Offline-first chess analysis, on your machine.",
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
      <body className="app-body">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteNav />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
