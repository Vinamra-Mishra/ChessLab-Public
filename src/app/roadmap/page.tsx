import Link from "next/link";
import { Piece, PieceDefs } from "@/components/Pieces";

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

export default function RoadmapPage() {
  return (
    <div className="subpage">
      <PieceDefs />

      <section className="page-frame subpage__hero">
        <p className="eyebrow">
          <span className="eyebrow__dot" /> ChessLab · Release roadmap
        </p>
        <div className="subpage__hero-grid">
          <h1 className="subpage__title">
            Thoughtful work. <em className="serif-em">Real progress.</em>
          </h1>
          <div className="subpage__hero-aside">
            <p>
              ChessLab is currently in development. Here is the shape of the work — from the
              private, local-first foundation to a public beta you can install with confidence.
            </p>
            <Link className="link-arrow" href="/download">
              See planned platforms
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="page-frame subpage__body" aria-label="Release milestones">
        <div className="milestones">
          {MILESTONES.map((milestone) => (
            <article className={`milestone milestone--${milestone.state}`} key={milestone.phase}>
              <div className="milestone__rail">
                <span className="milestone__node">
                  {milestone.state === "active" ? <i /> : null}
                </span>
                <span className="milestone__phase">{milestone.phase}</span>
                <span className="milestone__line" aria-hidden="true" />
              </div>

              <div className="milestone__body">
                <div className="milestone__top">
                  <span className="milestone__kicker">{milestone.kicker}</span>
                  <span className={`milestone__status milestone__status--${milestone.state}`}>
                    <i />
                    {milestone.status}
                  </span>
                </div>
                <h2 className="milestone__title">{milestone.title}</h2>
                <ul className="milestone__items">
                  {milestone.items.map((item) => (
                    <li key={item}>
                      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="m3.6 8.4 3 3 5.8-6.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="milestone__progress" aria-hidden="true">
                  <span className="milestone__progress-label">
                    {milestone.progress > 0 ? `~${milestone.progress}% complete` : "Queued"}
                  </span>
                  <span className="milestone__progress-track">
                    <i style={{ width: `${milestone.progress}%` }} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="principles">
          <div className="principles__copy">
            <p className="eyebrow">
              <span className="eyebrow__index">HOW</span> How the work is done
            </p>
            <h2>The long game, played properly.</h2>
            <p>
              No growth loops, no engagement tricks. ChessLab is built the way you study:
              methodically, privately, and with the engine close at hand.
            </p>
          </div>
          <ul className="principles__list">
            <li>
              <span>01</span>
              <b>Local before cloud</b>
              <p>Every feature is designed to work with the network off.</p>
            </li>
            <li>
              <span>02</span>
              <b>Engine, not oracle</b>
              <p>Stockfish line detail is there to explain, not to dictate.</p>
            </li>
            <li>
              <span>03</span>
              <b>Small and considered</b>
              <p>Fewer features, finished well, and no telemetry in the bundle.</p>
            </li>
          </ul>
        </div>

        <div className="subpage__bottom subpage__bottom--split">
          <div>
            <p>There&apos;s no public installer yet. We update the download page the moment the beta is ready.</p>
            <Link className="btn btn--solid" href="/download">
              Check the download page
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <div className="subpage__bottom-art" aria-hidden="true">
            <Piece kind="pawn" tone="emerald" className="piece" />
            <Piece kind="king" tone="ivory" className="piece" />
          </div>
        </div>
      </section>
    </div>
  );
}
