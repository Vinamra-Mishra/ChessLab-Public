import Link from "next/link";
import { HeroInteractive } from "@/components/HeroInteractive";
import { HeroScene3D } from "@/components/HeroScene3D";
import { PieceArt, PieceDefs } from "@/components/Pieces";

const MODES = [
  {
    num: "01",
    title: "Analyse & Review",
    copy: "Dockable Stockfish 19 board with MultiPV lines, 11-tier move badges, interactive eval graph, Highlights filter, and mistake retry.",
    href: "/analysis",
    piece: "knight" as const,
  },
  {
    num: "02",
    title: "ATHENA Coach",
    copy: "Human-like sparring with Maia-3 + ChessMimic, pause-on-blunder coaching, 16-concept verified explanations, and 4-tier mastery.",
    href: "/athena",
    piece: "pawn" as const,
  },
  {
    num: "03",
    title: "Studio & Repertoire",
    copy: "3,865 ECO opening lines, 23 structured blueprints, SM-2 spaced drills, local mistake puzzles, PGN import, and Chess.com sync.",
    href: "/studio",
    piece: "rook" as const,
  },
];

const STATS = [
  { value: "29ms", label: "ATHENA p95 local neural inference on CPU" },
  { value: "3,865", label: "CC0 ECO opening lines & 23 blueprints bundled" },
  { value: "0", label: "Cloud servers, LLM APIs, or accounts required" },
];

export default function Home() {
  return (
    <div className="page home">
      <PieceDefs />

      {/* ---------------------------------------------- cinematic hero */}
      <section className="hero hero--image-a">
        <HeroInteractive />
        <div className="hero__glows" aria-hidden="true">
          <span className="hero__glow hero__glow--left" />
          <span className="hero__glow hero__glow--right" />
          <span className="hero__grain" />
        </div>

        <HeroScene3D />

        <div className="hero__inner">
          <div className="hero__copy">
            <p className="eyebrow rise">
              <span className="eyebrow__num">(</span> Offline Chess Workstation · Powered by ATHENA{" "}
              <span className="eyebrow__num">)</span>
            </p>

            <h1 className="hero__title">
              <span className="hero__line rise">Master</span>
              <span className="hero__line hero__line--aside rise-2">
                <span className="hero__line-alt">The</span>
                <span className="hero__rule" aria-hidden="true" />
              </span>
              <span className="hero__line rise-3">
                <span className="stroke-type">Chess</span>
              </span>
            </h1>

            <p className="hero__lede rise-3">
              Local Stockfish 19 analysis, human-like neural sparring, and Stockfish-verified
              coaching — running 100% offline in pure Rust on your machine.
            </p>

            <div className="hero__actions rise-3">
              <Link className="btn-pill btn-pill--light" href="/download" data-magnetic data-spotlight>
                Download ChessLab
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M3.5 10h12M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link className="btn-pill btn-pill--outline" href="/athena" data-spotlight>
                Meet ATHENA
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M3.5 10h12M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>

          <span className="hero__spec hero__spec--left" aria-hidden="true">
            athena · 29ms cpu
          </span>
          <span className="hero__spec hero__spec--right" aria-hidden="true">
            stockfish 19 · 103mb ram
          </span>

          <aside className="hero__card" aria-label="Sample ATHENA review summary" data-spotlight>
            <div className="hero__card-top">
              <span className="hero__card-live">
                <i /> ATHENA · Guided Review
              </span>
              <span>B90 · Najdorf</span>
            </div>
            <div className="hero__card-body">
              <div>
                <span className="hero__card-k">Evaluation</span>
                <b>+0.42</b>
              </div>
              <div>
                <span className="hero__card-k">Accuracy</span>
                <b>92.4%</b>
              </div>
              <div>
                <span className="hero__card-k">Best Move</span>
                <b>Rxe7+</b>
              </div>
            </div>
            <div className="hero__card-bar" aria-hidden="true">
              <i style={{ width: "0%" }} />
            </div>
          </aside>
        </div>

        <div className="hero__foot">
          <span className="hero__scroll">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 3v13M5 11.5 10 16.5l5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Scroll to explore
          </span>
          <span className="hero__foot-meta">
            Tauri v2 · Rust · SQLite <i /> 100% Offline
          </span>
        </div>
      </section>

      {/* --------------------------------------------------- marquee */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {Array.from({ length: 2 }).map((_, group) => (
            <span className="marquee__group" key={group}>
              <span>ATHENA Coach</span>
              <i>✳</i>
              <span>Stockfish 19</span>
              <i>✳</i>
              <span>Guided Sparring</span>
              <i>✳</i>
              <span>Game Review</span>
              <i>✳</i>
              <span>Opening Studio</span>
              <i>✳</i>
              <span>Tactical Puzzles</span>
              <i>✳</i>
              <span>Local SQLite</span>
              <i>✳</i>
            </span>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------- modes */}
      <section className="section modes">
        <div className="wrap">
          <header className="section-head">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__num">02</span> Workstations
              </p>
              <h2 className="display-md">
                Three workstations,
                <br />
                <span className="serif">one mastery loop.</span>
              </h2>
            </div>
            <p className="section-head__lede">
              Play or import a game, uncover the verified concept behind critical mistakes with
              Stockfish 19 and ATHENA, and lock the pattern in through targeted sparring and
              spaced drills.
            </p>
          </header>

          <div className="modes__grid">
            {MODES.map((mode) => (
              <Link className="mode" href={mode.href} key={mode.num}>
                <div className="mode__head">
                  <span>{mode.num}</span>
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M4 16 16 4M6.5 4H16v9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="mode__art">
                  <PieceArt kind={mode.piece} material="water" glow />
                </div>
                <h3 className="display-sm">{mode.title}</h3>
                <p>{mode.copy}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- stats */}
      <section className="section section--tight stats">
        <div className="wrap">
          <div className="stats__grid">
            {STATS.map((stat) => (
              <div className="stat" key={stat.label}>
                <span className="display-lg stat__value">{stat.value}</span>
                <p>{stat.label}</p>
              </div>
            ))}
            <div className="stat stat--cta">
              <p>Ready to train offline with Stockfish 19 and ATHENA?</p>
              <Link className="btn-pill btn-pill--ember" href="/download">
                See release status
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M3.5 10h12M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
