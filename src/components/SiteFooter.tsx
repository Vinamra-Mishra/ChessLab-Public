import Link from "next/link";

const COLS = [
  {
    title: "Workstations",
    links: [
      { href: "/studio", label: "The workstation" },
      { href: "/analysis", label: "Analysis & Review" },
      { href: "/athena", label: "ATHENA Coach" },
    ],
  },
  {
    title: "Product",
    links: [
      { href: "/download", label: "Downloads" },
      { href: "/roadmap", label: "Release roadmap" },
      { href: "/download", label: "System specs" },
    ],
  },
  {
    title: "Connect",
    links: [
      { href: "https://github.com/Vinamra-Mishra/ChessLab-Public", label: "GitHub ↗" },
      { href: "mailto:hello@chesslab.app", label: "Contact ↗" },
    ],
  },
];

function KnightGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.6 3.2 17 3l.4 2.3c1.5.9 2.4 2.4 2.4 4.2 0 .9-.2 1.6-.6 2.3l1.4.9-1.7 1.4c-.5.4-1.1.6-1.8.6H15l-.7 1.6 5.6 2.2c.5.2.8.7.8 1.2v1.1H3.3v-1.3c0-1.6.9-3 2.4-3.7l4.6-2.1c.6-.3 1.1-.8 1.3-1.4l.6-1.9-2.9.9.5-2.4c.2-1.1.9-2 1.9-2.5l2.4-1.2.2-2.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="site-foot__top">
          <div className="site-foot__brand">
            <Link href="/" className="site-foot__logo" aria-label="ChessLab home">
              <KnightGlyph />
              ChessLab
            </Link>
            <p>
              A 100% local desktop chess workstation. Bundled Stockfish 19, pure-Rust ATHENA
              coaching, and a SQLite library that stays on your machine.
            </p>
            <span className="chip chip--ink">
              <i /> Pre-release · Tauri v2
            </span>
          </div>

          <div className="site-foot__cols">
            {COLS.map((col) => (
              <div className="site-foot__col" key={col.title}>
                <h3>{col.title}</h3>
                {col.links.map((link) => (
                  <Link key={link.label} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="site-foot__word" aria-hidden="true">
          ChessLab<span>.</span>
        </div>

        <div className="site-foot__bottom">
          <span>© 2026 ChessLab — 100% local, zero cloud</span>
          <span className="site-foot__social">
            <span>Tauri v2 · Rust</span>
            <span>Stockfish 19</span>
            <span>ATHENA Offline</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
