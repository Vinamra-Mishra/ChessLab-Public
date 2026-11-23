import Link from "next/link";

const MILESTONES = [
  {
    phase: "01 · The foundation",
    title: "A thoughtful desktop home",
    status: "In development",
    current: true,
    items: [
      "Tauri v2 desktop app with local SQLite storage",
      "Offline-first foundations and a private-by-default approach",
      "Engine integration and position exploration",
    ],
  },
  {
    phase: "02 · The study loop",
    title: "Turn games into progress",
    status: "In development",
    current: false,
    items: [
      "Game review with phase-by-phase feedback",
      "Opening repertoire and spaced-repetition practice",
      "Longitudinal insights into recurring patterns",
    ],
  },
  {
    phase: "03 · Public beta",
    title: "From the lab to your desktop",
    status: "Coming soon",
    current: false,
    items: [
      "Verified Windows, macOS, and Linux installers",
      "Signed builds and published checksums",
      "Release notes and an open feedback loop",
    ],
  },
];

export default function RoadmapPage() {
  return (
    <div className="subpage page-frame">
      <div className="subpage-heading">
        <p className="eyebrow"><span className="eyebrow__dot" /> ChessLab · Release roadmap</p>
        <h1 className="subpage-title">Thoughtful work.<br /><em>Real progress.</em></h1>
        <p className="subpage-lede">
          ChessLab is currently in development. Here’s the shape of the work — from the private,
          local-first foundation to a public beta you can install with confidence.
        </p>
      </div>

      <div className="roadmap-list">
        {MILESTONES.map((milestone) => (
          <article className={`roadmap-card${milestone.current ? " roadmap-card--current" : ""}`} key={milestone.phase}>
            <div className="roadmap-card__top">
              <span className="roadmap-card__phase">{milestone.phase}</span>
              <span className="roadmap-card__status">{milestone.status}</span>
            </div>
            <h2 className="roadmap-card__title">{milestone.title}</h2>
            <ul className="roadmap-card__items">
              {milestone.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        ))}
      </div>

      <div className="roadmap-bottom">
        <p>There’s no public installer yet. We’ll update the download page as soon as the beta is ready.</p>
        <Link href="/download" className="text-link">See planned platforms <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  );
}
