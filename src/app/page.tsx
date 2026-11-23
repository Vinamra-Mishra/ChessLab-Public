import Link from "next/link";
import ChessStage from "@/components/ChessStage";

type FeatureName = "engine" | "review" | "openings" | "coach";

const FEATURES: Array<{
  number: string;
  title: string;
  description: string;
  name: FeatureName;
}> = [
  {
    number: "01",
    title: "See the whole position",
    description:
      "Explore variations with Stockfish 19, follow the evaluation, and understand why one move changes everything — all on your own machine.",
    name: "engine",
  },
  {
    number: "02",
    title: "Review with perspective",
    description:
      "A clear, phase-by-phase account of your game, with critical moments explained and mistakes ready to revisit.",
    name: "review",
  },
  {
    number: "03",
    title: "Build a repertoire that sticks",
    description:
      "Shape your opening lines around the positions you actually reach, then return to them with spaced-repetition practice.",
    name: "openings",
  },
  {
    number: "04",
    title: "Know what to work on next",
    description:
      "Turn reviewed games into a longer view of your habits, recurring errors, and the skills worth your attention.",
    name: "coach",
  },
];

function FeatureIcon({ name }: { name: FeatureName }) {
  const shared = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.55,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  if (name === "engine") {
    return <svg {...shared}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1" /><circle cx="12" cy="12" r="5.2" /><circle cx="12" cy="12" r="1.3" /></svg>;
  }
  if (name === "review") {
    return <svg {...shared}><path d="M4 18.5V5.8A2.8 2.8 0 0 1 6.8 3H20v17H6.8A2.8 2.8 0 0 1 4 17.2" /><path d="M8 15l3-3 2.3 1.8L17 9" /><path d="M14.8 9H17v2.2" /></svg>;
  }
  if (name === "openings") {
    return <svg {...shared}><path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v18H7.5A2.5 2.5 0 0 1 5 17.5z" /><path d="M5 17.5A2.5 2.5 0 0 1 7.5 15H20M9 6h7M9 9h5" /><path d="m9.5 12 .9.9 2-2" /></svg>;
  }
  return <svg {...shared}><circle cx="12" cy="12" r="8.7" /><path d="M12 7v5l3.3 2" /><path d="M18.4 5.6 20 4" /></svg>;
}

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero-section page-frame" aria-labelledby="hero-title">
        <div className="hero-layout">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow__dot" /> A private chess studio · In development</p>
            <h1 className="hero-title" id="hero-title">
              A deeper game.<br />
              <em>A clearer mind.</em>
            </h1>
            <p className="hero-description">
              Meet the offline-first chess studio built to help you understand every move —
              and make the next one your own.
            </p>
            <div className="hero-actions">
              <Link className="button button--dark" href="#studio">
                Explore the studio <span aria-hidden="true">↗</span>
              </Link>
              <Link className="text-link" href="/roadmap">
                See the release roadmap <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="hero-note">
              <span className="hero-note__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 19 6v5c0 4.7-3 8.1-7 10-4-1.9-7-5.3-7-10V6z" /><path d="m9 12 2 2 4-4" /></svg>
              </span>
              <span><strong>Your games stay yours.</strong><small>Local-first, with no cloud account to get in the way.</small></span>
            </div>
          </div>

          <div className="hero-art">
            <ChessStage />
          </div>
        </div>

        <div className="hero-meta" aria-label="ChessLab principles">
          <span><i>01</i> Runs on your device</span>
          <span><i>02</i> Powered by Stockfish 19</span>
          <span><i>03</i> Made for the long game</span>
        </div>
      </section>

      <section className="studio-section page-frame" id="studio" aria-labelledby="studio-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow__index">01</span> The ChessLab studio</p>
            <h2 className="section-title" id="studio-title">The details behind<br /><em>every decision.</em></h2>
          </div>
          <p className="section-intro">
            Serious tools, arranged around the way chess is actually learned: look closer,
            find the lesson, and come back stronger.
          </p>
        </div>

        <div className="feature-grid">
          {FEATURES.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <div className="feature-card__top">
                <span className="feature-card__icon"><FeatureIcon name={feature.name} /></span>
                <span className="feature-card__number">{feature.number}</span>
              </div>
              <div className="feature-card__copy">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
              <span className="feature-card__arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="privacy-section page-frame" aria-labelledby="privacy-title">
        <div className="privacy-panel">
          <div className="privacy-copy">
            <p className="eyebrow eyebrow--light"><span className="eyebrow__dot" /> Quietly powerful by design</p>
            <h2 id="privacy-title">Your games.<br /><em>Your space.</em></h2>
            <p>
              Analysis belongs close to the board. ChessLab is being built to run locally,
              so your games, study notes, and progress stay on your computer.
            </p>
            <div className="privacy-points">
              <span><b>—</b> No cloud account</span>
              <span><b>—</b> No subscription</span>
              <span><b>—</b> No games sent away</span>
            </div>
          </div>

          <div className="flow-diagram" aria-label="A local analysis flow: your device, Stockfish engine, and your insights">
            <div className="flow-diagram__topline"><span>LOCAL BY DESIGN</span><span className="flow-diagram__signal"><i /> ON DEVICE</span></div>
            <div className="flow-chain">
              <div className="flow-node">
                <span className="flow-node__icon flow-node__icon--device" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg></span>
                <span><small>01</small><strong>Your device</strong></span>
              </div>
              <span className="flow-connector" aria-hidden="true"><i /></span>
              <div className="flow-node">
                <span className="flow-node__icon flow-node__icon--engine" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg></span>
                <span><small>02</small><strong>Stockfish 19</strong></span>
              </div>
              <span className="flow-connector" aria-hidden="true"><i /></span>
              <div className="flow-node">
                <span className="flow-node__icon flow-node__icon--insight" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19V5M4 19h16" /><path d="m7 15 4-4 3 2 5-6" /></svg></span>
                <span><small>03</small><strong>Your insight</strong></span>
              </div>
            </div>
            <p className="flow-diagram__footnote">A thoughtful loop between play, analysis, and improvement.</p>
          </div>
        </div>
      </section>

      <section className="release-section page-frame" aria-labelledby="release-title">
        <div className="release-copy">
          <p className="eyebrow"><span className="eyebrow__index">02</span> The next move</p>
          <h2 className="section-title" id="release-title">In development.<br /><em>Made with intention.</em></h2>
          <p className="section-intro">
            The public desktop release is still being built. Follow the roadmap for progress,
            platform plans, and a clear note when downloads are ready.
          </p>
        </div>
        <div className="release-actions">
          <Link className="button button--dark" href="/roadmap">Follow the roadmap <span aria-hidden="true">↗</span></Link>
          <Link className="text-link" href="/download">View planned platforms <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </div>
  );
}
