import Link from "next/link";
import { HeroInteractive } from "@/components/HeroInteractive";
import { HeroScene3D } from "@/components/HeroScene3D";
import { PieceArt, PieceDefs } from "@/components/Pieces";

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
              <Link className="btn-pill btn-pill--light" href="/download" data-magnetic data-spotlight>
                Play now
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M3.5 10h12M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link className="btn-pill btn-pill--outline" href="/studio" data-spotlight>
                Watch the studio
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M3.5 10h12M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>

          <span className="hero__spec hero__spec--left" aria-hidden="true">
            sicilian · b90
          </span>
          <span className="hero__spec hero__spec--right" aria-hidden="true">
            eval +0.42 · depth 34
          </span>

          <aside className="hero__card" aria-label="Sample review summary" data-spotlight>
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
            Windows · macOS · Linux <i /> Private beta
          </span>
        </div>
      </section>

      {/* --------------------------------------------------- marquee */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {Array.from({ length: 2 }).map((_, group) => (
            <span className="marquee__group" key={group}>
              <span>Review</span>
              <i>✳</i>
              <span>Repertoire</span>
              <i>✳</i>
              <span>Tournaments</span>
              <i>✳</i>
              <span>Rankings</span>
              <i>✳</i>
              <span>Analysis</span>
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
    </div>
  );
}
