import Link from "next/link";
import { PieceArt, PieceDefs } from "@/components/Pieces";

const HERO_BULLETS = [
  { num: "01", label: "AI-powered training" },
  { num: "02", label: "Competitive rankings" },
];

const MODES = [
  {
    num: "01",
    title: "Play",
    copy: "A quiet board that gets out of the way — local games, saved on your machine.",
    href: "/studio",
    piece: "pawn" as const,
  },
  {
    num: "02",
    title: "Analyse",
    copy: "Stockfish 19 in the loop: variations, evaluations, and the reason behind every move.",
    href: "/analysis",
    piece: "knight" as const,
  },
  {
    num: "03",
    title: "Compete",
    copy: "Tournament brackets with real pairings, results and standings — no cloud required.",
    href: "/tournaments",
    piece: "rook" as const,
  },
];

const STATS = [
  { value: "19", label: "Stockfish build, bundled locally" },
  { value: "0", label: "Accounts, subscriptions or sign-ins" },
  { value: "45s", label: "Average full-game review pass" },
];

export default function Home() {
  return (
    <div className="page home">
      <PieceDefs />

      {/* -------------------------------------- water-style gallery hero */}
      <section className="water-gallery" aria-label="ChessLab Water Gallery Hero">
        <div className="water-gallery__frame">
          <div className="water-gallery__stage" aria-hidden="true">
            <div className="water-gallery__grid" />
            <div className="water-gallery__piece">
              <PieceArt kind="knight" material="water" glow />
            </div>
            <div className="water-gallery__piece">
              <PieceArt kind="bishop" material="water" glow />
            </div>
            <div className="water-gallery__piece">
              <PieceArt kind="queen" material="water" glow />
            </div>
            <div className="water-gallery__piece">
              <PieceArt kind="king" material="water" glow />
            </div>
          </div>

          <div className="water-gallery__content">
            <div>
              <div className="water-gallery__badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
                Offline-first Chess Intelligence · Coming Soon
              </div>
              <h1 className="water-gallery__title">
                Discover chess that makes a move — before you play it.
              </h1>
            </div>

            <div>
              <div className="water-gallery__meta">
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <rect x="9" y="9" width="6" height="6" />
                  </svg>
                  Stockfish 19 Local Engine
                </span>
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 3v18h18" />
                    <path d="M7 14l4-4 4 3 5-6" />
                  </svg>
                  Expected Points &amp; AI Coach
                </span>
              </div>
              <p className="water-gallery__desc">
                ChessLab combines local Stockfish 19 analysis, 11-tier Expected Points game review,
                spaced-repetition openings, and personal coaching in one offline desktop studio.
              </p>
              <Link className="water-gallery__cta" href="/download">
                Explore Upcoming Release
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M3.5 10h12M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------- cinematic hero */}
      <section className="hero">
        <div className="hero__beams" aria-hidden="true">
          <span className="hero__beam hero__beam--ember" />
          <span className="hero__beam hero__beam--white" />
        </div>

        <div className="hero__inner">
          <div className="hero__copy">
            <p className="eyebrow rise">
              <span className="eyebrow__num">(</span> Offline-first chess studio{" "}
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
              Turn your chess vision into true mastery with intelligent, results-focused
              analysis — all on your own machine.
            </p>

            <div className="hero__actions rise-3">
              <Link className="btn-pill btn-pill--light" href="/download">
                Play now
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M3.5 10h12M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link className="btn-pill btn-pill--outline" href="/studio">
                Watch the studio
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M3.5 10h12M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>

          <ul className="hero__stack" aria-label="Highlights">
            {HERO_BULLETS.map((item) => (
              <li key={item.num}>
                <span>{item.num}</span>
                <b>{item.label}</b>
              </li>
            ))}
          </ul>

          <div className="hero__stage" aria-hidden="true">
            <div className="hero__figure hero__figure--king">
              <PieceArt kind="king" material="water" glow />
            </div>
            <div className="hero__figure hero__figure--bishop">
              <PieceArt kind="bishop" material="water" glow />
            </div>
            <div className="hero__figure hero__figure--knight">
              <PieceArt kind="knight" material="water" glow />
            </div>
            <div className="hero__figure hero__figure--pawn">
              <PieceArt kind="pawn" material="water" glow />
            </div>
          </div>

          <span className="hero__spec hero__spec--left" aria-hidden="true">
            sicilian · b90
          </span>
          <span className="hero__spec hero__spec--right" aria-hidden="true">
            eval +0.42 · depth 34
          </span>

          <aside className="hero__card" aria-label="Sample review summary">
            <div className="hero__card-top">
              <span className="hero__card-live">
                <i /> Now analysing
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
                <span className="hero__card-k">Turning point</span>
                <b>16…d×e4</b>
              </div>
            </div>
            <div className="hero__card-bar" aria-hidden="true">
              <i style={{ width: "58%" }} />
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
            Windows · macOS · Linux <i /> Coming Soon
          </span>
        </div>
      </section>

      {/* --------------------------------------------------- marquee */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {Array.from({ length: 2 }).map((_, group) => (
            <span className="marquee__group" key={group}>
              <span>Analysis</span>
              <i>✳</i>
              <span>Review</span>
              <i>✳</i>
              <span>Repertoire</span>
              <i>✳</i>
              <span>Tournaments</span>
              <i>✳</i>
              <span>Rankings</span>
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
                <span className="eyebrow__num">02</span> What you get
              </p>
              <h2 className="display-md">
                Three ways to
                <br />
                <span className="serif">play the long game.</span>
              </h2>
            </div>
            <p className="section-head__lede">
              Everything in ChessLab is arranged around a single loop: play a game, understand
              it, then come back stronger. No feeds, no streaks, no noise.
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
              <p>Ready to see your own games differently?</p>
              <Link className="btn-pill btn-pill--ember" href="/download">
                Get the beta
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M3.5 10h12M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- thesis */}
      <section className="section thesis">
        <div className="wrap">
          <div className="thesis__grid">
            <div className="thesis__art" aria-hidden="true">
              <span className="thesis__halo" />
              <div className="thesis__piece thesis__piece--a">
                <PieceArt kind="queen" material="ivory" glow />
              </div>
              <div className="thesis__piece thesis__piece--b">
                <PieceArt kind="knight" material="obsidian" />
              </div>
            </div>

            <div className="thesis__copy">
              <span className="chip">
                <i /> Quietly powerful by design
              </span>
              <h2 className="display-md">
                Chess that respects
                <br />
                <span className="serif">your attention.</span>
              </h2>
              <p>
                Analysis belongs close to the board. ChessLab runs on your desktop, keeps your
                games in a local database, and never asks you to sign in to understand your own
                chess.
              </p>
              <ul className="thesis__points">
                <li>
                  <b>No cloud account</b>
                  <span>Your library lives in a local SQLite file you own.</span>
                </li>
                <li>
                  <b>No telemetry</b>
                  <span>Nothing leaves the machine unless you export it.</span>
                </li>
                <li>
                  <b>No subscription</b>
                  <span>One app, one engine, no recurring plans.</span>
                </li>
              </ul>
              <Link className="btn-pill btn-pill--outline" href="/studio">
                Explore the studio
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
