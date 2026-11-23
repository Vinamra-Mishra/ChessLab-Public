import Link from "next/link";
import { Piece, PieceDefs } from "@/components/Pieces";
import { StudyBoard } from "@/components/StudyBoard";

const PRINCIPLES = [
  { index: "01", label: "Runs on your device", value: "Offline-first" },
  { index: "02", label: "Powered by Stockfish 19", value: "On-device engine" },
  { index: "03", label: "No account required", value: "Private by default" },
];

export default function Home() {
  return (
    <div className="home-page">
      <PieceDefs />

      {/* ---------------------------------------------------------- hero */}
      <section className="hero page-frame" aria-labelledby="hero-title">
        <div className="hero__topline">
          <p className="eyebrow">
            <span className="eyebrow__dot" /> A private chess studio
          </p>
          <p className="hero__topline-note">
            Desktop app <span>/</span> In development
          </p>
        </div>

        <div className="hero__layout">
          <div className="hero__copy">
            <h1 className="hero__title" id="hero-title">
              <span className="hero__title-line">Think one</span>
              <span className="hero__title-line hero__title-line--indent">
                move <span className="hero__title-rule" aria-hidden="true" />
              </span>
              <span className="hero__title-line">
                <em className="serif-em">ahead.</em>
              </span>
            </h1>

            <p className="hero__lede">
              ChessLab is an offline-first studio for people who want to understand their
              chess — not just play more of it. Analysis, review, and repertoire, all on your
              own machine.
            </p>

            <div className="hero__actions">
              <Link className="btn btn--solid" href="/download">
                Get the beta
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link className="btn btn--ghost" href="/#studio">
                See the studio
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 3v10M4.5 9.5 8 13l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <div className="hero__meta">
              <span className="hero__meta-pill">
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 2.2 13 4.4v4.1c0 3.2-2.1 5.5-5 6.7-2.9-1.2-5-3.5-5-6.7V4.4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  <path d="m5.9 8.2 1.5 1.5 2.8-2.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Your games stay yours
              </span>
              <span className="hero__meta-pill">
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="5.6" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M8 4.8V8l2.2 1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                45-second review
              </span>
            </div>
          </div>

          <div className="hero__stage">
            <span className="hero__annotation" aria-hidden="true">
              <i /> Sicilian · Accelerated Dragon
            </span>
            <StudyBoard overlay />
            <div className="hero__figure" aria-hidden="true">
              <Piece kind="king" tone="emerald" className="piece" />
              <span className="hero__figure-label">
                <span>Stockfish 19</span>
                <b>Bd2 · best move</b>
                <small>+0.42 · depth 34</small>
              </span>
            </div>
          </div>
        </div>

        <ul className="hero__principles" aria-label="ChessLab principles">
          {PRINCIPLES.map((principle) => (
            <li key={principle.index}>
              <span className="hero__principle-index">{principle.index}</span>
              <span className="hero__principle-copy">
                <b>{principle.label}</b>
                <small>{principle.value}</small>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------- marquee */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {Array.from({ length: 2 }).map((_, group) => (
            <span className="ticker__group" key={group}>
              <span>SEE THE WHOLE POSITION</span>
              <i>◆</i>
              <span>REVIEW WITH PERSPECTIVE</span>
              <i>◆</i>
              <span>BUILD A REPERTOIRE</span>
              <i>◆</i>
              <span>KNOW WHAT TO WORK ON</span>
              <i>◆</i>
            </span>
          ))}
        </div>
      </div>

      {/* -------------------------------------------------------- studio */}
      <section className="studio page-frame" id="studio" aria-labelledby="studio-title">
        <header className="section-head">
          <p className="eyebrow">
            <span className="eyebrow__index">01</span> The studio
          </p>
          <h2 className="section-head__title" id="studio-title">
            The details behind <em className="serif-em">every</em> decision.
          </h2>
          <p className="section-head__lede">
            Serious tools arranged the way chess is actually learned: look closer, find the
            lesson, then come back stronger.
          </p>
        </header>

        <div className="bento">
          <article className="bento__card bento__card--wide" id="analysis">
            <div className="bento__card-head">
              <span className="bento__index">01 — Engine</span>
              <span className="bento__tag">Stockfish 19</span>
            </div>
            <div className="bento__copy">
              <h3>See the whole position</h3>
              <p>
                Explore variations with a local Stockfish build, follow the evaluation, and
                understand why one move changes everything.
              </p>
            </div>
            <div className="eval-panel" aria-hidden="true">
              <div className="eval-panel__bar">
                <i style={{ width: "58%" }} />
                <span className="eval-panel__midpoint" />
              </div>
              <div className="eval-panel__row">
                <span className="eval-panel__score">+0.42</span>
                <span className="eval-panel__moves">
                  <span><b>12.</b> Bd2 <em>+0.42</em></span>
                  <span><b>12.</b> Nxd5 <em>+1.10</em></span>
                  <span><b>12.</b> a4 <em>+0.18</em></span>
                </span>
              </div>
            </div>
          </article>

          <article className="bento__card">
            <div className="bento__card-head">
              <span className="bento__index">02 — Review</span>
            </div>
            <div className="bento__copy">
              <h3>Review with perspective</h3>
              <p>A phase-by-phase account of your game, with critical moments ready to revisit.</p>
            </div>
            <div className="review-strip" aria-hidden="true">
              <span className="review-strip__label">ACCURACY</span>
              <div className="review-strip__track">
                <i style={{ width: "82%" }} className="is-accent" />
                <i style={{ width: "68%" }} className="is-dim" />
              </div>
              <div className="review-strip__legend">
                <span>You 82%</span>
                <span>Ratio 68%</span>
              </div>
            </div>
          </article>

          <article className="bento__card">
            <div className="bento__card-head">
              <span className="bento__index">03 — Repertoire</span>
            </div>
            <div className="bento__copy">
              <h3>Build a repertoire that sticks</h3>
              <p>Shape opening lines around the positions you actually reach, then practice them.</p>
            </div>
            <ul className="repertoire" aria-hidden="true">
              <li>
                <span className="repertoire__line">1. e4 c5</span>
                <span className="repertoire__state">12 positions</span>
              </li>
              <li>
                <span className="repertoire__line">2. Nf3 d6</span>
                <span className="repertoire__state is-learned">learned</span>
              </li>
              <li>
                <span className="repertoire__line">3. d4 cxd4</span>
                <span className="repertoire__state">review</span>
              </li>
            </ul>
          </article>

          <article className="bento__card bento__card--piece">
            <div className="bento__card-head">
              <span className="bento__index">04 — Coach</span>
              <span className="bento__tag">On device</span>
            </div>
            <div className="bento__copy">
              <h3>Know what to work on next</h3>
              <p>Turn reviewed games into a longer view of your habits and recurring errors.</p>
            </div>
            <div className="bento__art" aria-hidden="true">
              <Piece kind="pawn" tone="emerald" className="piece" />
              <Piece kind="bishop" tone="obsidian" className="piece" />
              <Piece kind="rook" tone="ivory" className="piece" />
            </div>
          </article>
        </div>
      </section>

      {/* ------------------------------------------------------- privacy */}
      <section className="privacy page-frame" id="privacy" aria-labelledby="privacy-title">
        <div className="privacy__panel">
          <div className="privacy__copy">
            <p className="eyebrow">
              <span className="eyebrow__dot" /> Quietly powerful by design
            </p>
            <h2 id="privacy-title">
              Your games.
              <br />
              <em className="serif-em">Your space.</em>
            </h2>
            <p className="privacy__lede">
              Analysis belongs close to the board. ChessLab is built to run locally, so your
              games, study notes, and progress stay on your computer.
            </p>
            <div className="privacy__points">
              <span>No cloud account</span>
              <span>No subscription</span>
              <span>No games sent away</span>
            </div>
          </div>

          <div className="flow" aria-label="A local analysis flow: your device, the Stockfish engine, and your insight">
            <div className="flow__top">
              <span>LOCAL BY DESIGN</span>
              <span className="flow__signal">
                <i /> ON DEVICE
              </span>
            </div>
            <div className="flow__chain">
              <div className="flow__node">
                <span className="flow__icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="3" width="16" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M8 21h8M12 16v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </span>
                <small>01</small>
                <strong>Your device</strong>
              </div>
              <span className="flow__link" aria-hidden="true">
                <i />
              </span>
              <div className="flow__node">
                <span className="flow__icon flow__icon--accent">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="4.6" stroke="currentColor" strokeWidth="1.4" />
                    <circle cx="12" cy="12" r="1.1" fill="currentColor" />
                  </svg>
                </span>
                <small>02</small>
                <strong>Stockfish 19</strong>
              </div>
              <span className="flow__link" aria-hidden="true">
                <i />
              </span>
              <div className="flow__node">
                <span className="flow__icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M4 19V5M4 19h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="m7 15 4-4 3 2 5-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <small>03</small>
                <strong>Your insight</strong>
              </div>
            </div>
            <p className="flow__foot">A thoughtful loop between play, analysis, and improvement.</p>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- pieces */}
      <section className="showcase" aria-label="The ChessLab piece set">
        <div className="showcase__inner page-frame">
          <div className="showcase__head">
            <p className="eyebrow">
              <span className="eyebrow__index">02</span> The set
            </p>
            <h2>
              Six pieces,
              <br />
              drawn by hand.
            </h2>
          </div>
          <div className="showcase__pieces" aria-hidden="true">
            {(["pawn", "rook", "knight", "bishop", "queen", "king"] as const).map((kind, index) => (
              <div className={`showcase__piece showcase__piece--${kind}`} key={kind} style={{ ["--i" as string]: index }}>
                <Piece kind={kind} tone={index === 4 ? "emerald" : index % 2 === 0 ? "ivory" : "obsidian"} className="piece" />
                <span>{kind}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- release */}
      <section className="release page-frame" aria-labelledby="release-title">
        <div className="release__copy">
          <p className="eyebrow">
            <span className="eyebrow__index">03</span> The next move
          </p>
          <h2 className="section-head__title" id="release-title">
            In development. <em className="serif-em">Made with intention.</em>
          </h2>
          <p className="section-head__lede">
            The public desktop release is still being built. Follow the roadmap for progress,
            platform plans, and a clear note when downloads are ready.
          </p>
        </div>
        <div className="release__actions">
          <Link className="btn btn--solid" href="/roadmap">
            Follow the roadmap
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link className="link-arrow" href="/download">
            View planned platforms
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
