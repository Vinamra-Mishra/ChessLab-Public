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
    default: "ChessLab — Master the game before you play it",
    template: "%s · ChessLab",
  },
  description:
    "An offline-first chess studio for analysis, review, repertoire, and tournaments. Stockfish 19 on your own machine, with no account and no games sent away.",
  applicationName: "ChessLab",
  keywords: ["chess", "chess analysis", "Stockfish", "offline chess", "game review", "repertoire", "tournaments"],
  openGraph: {
    title: "ChessLab — Master the game before you play it",
    description:
      "Offline-first analysis, phase-by-phase review, and a repertoire that sticks. Powered by Stockfish 19.",
    type: "website",
    siteName: "ChessLab",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChessLab — Master the game before you play it",
    description: "Offline-first chess analysis, on your machine.",
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
