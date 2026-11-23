import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChessLab — A private chess studio",
  description:
    "An offline-first desktop chess studio for game analysis, opening practice, and thoughtful improvement. ChessLab is currently in development.",
  applicationName: "ChessLab",
};

export const viewport: Viewport = {
  themeColor: "#090b0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="app-body">
        <SiteNav />
        <main>{children}</main>
        <footer className="site-footer">
          <div className="site-footer__inner page-frame">
            <span className="site-footer__brand">ChessLab<span>®</span></span>
            <p>Your game, your space. <span>Made for the long game.</span></p>
            <div className="site-footer__links">
              <Link href="/#studio">The studio</Link>
              <Link href="/download">Downloads</Link>
              <Link href="/roadmap">Roadmap</Link>
            </div>
            <span className="site-footer__copyright">© 2026 ChessLab</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
