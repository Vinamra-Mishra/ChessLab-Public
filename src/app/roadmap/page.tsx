import type { Metadata } from "next";
import Link from "next/link";
import { PieceArt, PieceDefs } from "@/components/Pieces";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "ChessLab development progress across the Tauri v2 desktop workstations, ATHENA pure-Rust neural coach (95 Rust tests passing), and public beta installer packaging.",
};

const MILESTONES = [
  {
    phase: "01",
    kicker: "Phase 01–06 & Workstation Shell",
    title: "Desktop Foundation & Workstations",
    status: "Completed",
    state: "active",
    progress: 100,
    items: [
      "Tauri v2 + Rust + SQLite shell with automatic corruption recovery",
      "AMOLED Black full-bleed workspace, Premiere-style dockable Analysis & Game Review",
      "Opening Studio (3,865 ECO lines), SM-2 Puzzles, Chess.com background sync & locked Player Profiles",
    ],
  },
  {
    phase: "02",
    kicker: "ATHENA Neural Advisor",
    title: "Pure-Rust Local Coaching Engine",
    status: "Completed",
    state: "active",
    progress: 100,
    items: [
      "Burn Flex CPU runtime (29ms p95, ~103 MB peak RSS) for Maia-3 + ChessMimic sparring",
      "XGBoost v2 move-risk, 16-concept Stockfish-verified diagnosis & 4-tier anti-gaming mastery",
      "Guided Sparring pause-on-blunder coaching, victory debriefs & 95/95 Rust backend tests passing",
    ],
  },
  {
    phase: "03",
    kicker: "Public Beta",
    title: "Cross-Platform Packaging & Installers",
    status: "In progress",
    state: "active",
    progress: 35,
    items: [
      "Code-signed Windows (.msi/.exe), macOS (.dmg), and Linux (AppImage/.deb) installers",
      "Published SHA-256 checksums and hardware qualification notes",
      "Public release notes and open community issue tracker",
    ],
  },
];

const PRINCIPLES = [
  { title: "100% Local", copy: "Engine, neural models, and database run on your CPU with the network unplugged." },
  { title: "Evidence-Gated", copy: "Every coaching model is qualified on held-out games and verified against Stockfish 19." },
  { title: "Zero Fluff", copy: "No chatbot bloat, no streak pressure, no cloud subscriptions." },
];

export default function RoadmapPage() {
  return (
    <div className="page roadmap-page">
      <PieceDefs />

      <section className="rm-hero">
        <div className="wrap">
          <p className="eyebrow">
            <span className="eyebrow__num">(</span> ChessLab · Release roadmap{" "}
            <span className="eyebrow__num">)</span>
          </p>

          <div className="rm-hero__grid">
            <h1 className="display-xl">
              Built locally.
              <br />
              <span className="serif">Verified end to end.</span>
            </h1>

            <div className="rm-hero__aside">
              <p>
                Core workstations and ATHENA&apos;s pure-Rust neural advisor are implemented and
                verified locally. Packaging signed Windows, macOS, and Linux installers is the
                final gate before public beta.
              </p>
              <Link className="btn-pill btn-pill--outline" href="/download">
                See planned platforms
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M3.5 10h12M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="rm-hero__art" aria-hidden="true">
            <div className="rm-hero__piece rm-hero__piece--a">
              <PieceArt kind="king" material="water" glow />
            </div>
            <div className="rm-hero__piece rm-hero__piece--b">
              <PieceArt kind="bishop" material="water" />
            </div>
            <div className="rm-hero__piece rm-hero__piece--c">
              <PieceArt kind="rook" material="water" />
            </div>
          </div>

          <div className="rm-hero__meta">
            <span>95/95 Rust backend tests passing</span>
            <span>ATHENA ~103 MB peak RAM · 29ms CPU</span>
            <span>Installers in final packaging</span>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <div className="milestones">
            {MILESTONES.map((milestone) => (
              <article className={`milestone milestone--${milestone.state}`} key={milestone.phase}>
                <div className="milestone__rail">
                  <span className="milestone__node">
                    {milestone.state === "active" ? <i /> : null}
                  </span>
                  <span className="milestone__phase">{milestone.phase}</span>
                </div>

                <div className="milestone__body">
                  <div className="milestone__top">
                    <span className="milestone__kicker">{milestone.kicker}</span>
                    <span className={`milestone__status milestone__status--${milestone.state}`}>
                      <i />
                      {milestone.status}
                    </span>
                  </div>

                  <h2 className="display-md">{milestone.title}</h2>

                  <ul className="milestone__items">
                    {milestone.items.map((item) => (
                      <li key={item}>
                        <span aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="milestone__progress">
                    <span className="milestone__bar" aria-hidden="true">
                      <i style={{ width: `${milestone.progress}%` }} />
                    </span>
                    <span className="milestone__pct">
                      {milestone.progress > 0 ? `${milestone.progress}% complete` : "Not started"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section rm-band">
        <div className="wrap">
          <div className="rm-principles">
            {PRINCIPLES.map((principle) => (
              <div className="rm-principle" key={principle.title}>
                <h3>{principle.title}</h3>
                <p>{principle.copy}</p>
              </div>
            ))}
          </div>

          <div className="rm-cta">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__num">03</span> Release status
              </p>
              <h2 className="display-md">
                Nothing is downloadable
                <br />
                <span className="serif">until it is ready.</span>
              </h2>
              <p>
                When the beta ships, this becomes a download page with signed builds and
                checksums — not before.
              </p>
            </div>
            <Link className="btn-pill btn-pill--ember" href="/download">
              Read the download status
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3.5 10h12M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
