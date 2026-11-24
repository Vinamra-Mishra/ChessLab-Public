import type { Metadata } from "next";
import Link from "next/link";
import { PieceArt, PieceDefs } from "@/components/Pieces";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "What ChessLab is building, in what order, and what has to be true before a public beta is released.",
};

const MILESTONES = [
  {
    phase: "01",
    kicker: "The foundation",
    title: "A thoughtful desktop home",
    status: "In development",
    state: "active",
    progress: 68,
    items: [
      "Tauri v2 desktop app with local SQLite storage",
      "Offline-first foundations and a private-by-default approach",
      "Engine integration and position exploration",
    ],
  },
  {
    phase: "02",
    kicker: "The study loop",
    title: "Turn games into progress",
    status: "In development",
    state: "active",
    progress: 41,
    items: [
      "Game review with phase-by-phase feedback",
      "Opening repertoire and spaced-repetition practice",
      "Longitudinal insight into recurring patterns",
    ],
  },
  {
    phase: "03",
    kicker: "Public beta",
    title: "From the lab to your desktop",
    status: "Coming soon",
    state: "queued",
    progress: 0,
    items: [
      "Verified Windows, macOS, and Linux installers",
      "Signed builds and published checksums",
      "Release notes and an open feedback loop",
    ],
  },
];

const PRINCIPLES = [
  { title: "Local first", copy: "If a feature needs a server, it is not finished." },
  { title: "Auditable", copy: "Every published build ships with a checksum." },
  { title: "Quiet", copy: "No gamified streaks, no notification pressure." },
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
              Thoughtful work.
              <br />
              <span className="serif">Real progress.</span>
            </h1>

            <div className="rm-hero__aside">
              <p>
                ChessLab is currently in development. Here is the shape of the work — from the
                private, local-first foundation to a public beta you can install with
                confidence.
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
            <span>Updated for the current development cycle</span>
            <span>No public installer yet</span>
            <span>Beta status is tracked on this page</span>
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
