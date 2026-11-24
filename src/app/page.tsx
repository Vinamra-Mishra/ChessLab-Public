import Link from "next/link";
import { HeroScene3D } from "@/components/HeroScene3D";
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

      {/* ---------------------------------------------- cinematic hero */}
      <section className="hero hero--cinematic">
        <HeroScene3D />

        <div className="hero-cine__wrap">
          <div className="hero-cine__top">
            <h1 className="hero-cine__title">
              <span className="hero-cine__left rise">MASTER AI</span>
              <span className="hero-cine__right rise-2">CHESS</span>
            </h1>
          </div>

          <div className="hero-cine__mid">
            <div className="hero-cine__leftcol">
              <p className="hero__lede rise-3">
                Turn your chess vision into true mastery with intelligent, results-focused
                analysis — all on your own machine.
              </p>

              <ul className="hero__stack rise-3" aria-label="Highlights">
                {HERO_BULLETS.map((item) => (
                  <li key={item.num}>
                    <span>{item.num}/</span>
                    <b>{item.label}</b>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hero-cine__rightcol rise-3">
              <Link className="btn-pill btn-pill--light" href="/download">
                Play now
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M3.5 10h12M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
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
                <PieceArt kind="queen" material="water" glow />
              </div>
              <div className="thesis__piece thesis__piece--b">
                <PieceArt kind="knight" material="water" />
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
