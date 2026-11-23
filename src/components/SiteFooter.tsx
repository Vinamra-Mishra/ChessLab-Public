import Link from "next/link";
import { BrandMark } from "./BrandMark";

const COLUMNS = [
  {
    title: "Studio",
    links: [
      { href: "/#studio", label: "The studio" },
      { href: "/#analysis", label: "Analysis" },
      { href: "/#privacy", label: "Privacy" },
    ],
  },
  {
    title: "Product",
    links: [
      { href: "/download", label: "Downloads" },
      { href: "/roadmap", label: "Roadmap" },
      { href: "/roadmap", label: "Release notes" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-frame">
        <div className="site-footer__top">
          <div className="site-footer__brand-col">
            <Link href="/" className="brand brand--footer" aria-label="ChessLab home">
              <span className="brand__mark">
                <BrandMark />
              </span>
              <span className="brand__name">
                Chess<span>Lab</span>
              </span>
            </Link>
            <p>
              An offline-first chess studio.
              <br />
              Built for the long game.
            </p>
            <span className="status-pill">
              <span className="status-pill__dot" />
              In development
            </span>
          </div>

          <div className="site-footer__links">
            {COLUMNS.map((column) => (
              <div className="site-footer__col" key={column.title}>
                <span className="site-footer__col-title">{column.title}</span>
                {column.links.map((link) => (
                  <Link href={link.href} key={link.label}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
            <div className="site-footer__col">
              <span className="site-footer__col-title">Connect</span>
              <a href="https://github.com/Vinamra-Mishra" target="_blank" rel="noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
              <a href="mailto:hello@chesslab.app">
                Contact <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>

        <div className="site-footer__wordmark" aria-hidden="true">
          ChessLab<span>®</span>
        </div>

        <div className="site-footer__bottom">
          <span>© 2026 ChessLab — A private chess studio.</span>
          <span className="site-footer__meta">
            <span>LOCAL-FIRST</span>
            <span>STOCKFISH 19</span>
            <span>NO ACCOUNT</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
