const MILESTONES = [
  {
    phase: "Phase 1",
    title: "Core Desktop Engine & Review",
    status: "Completed in Dev",
    items: [
      "Tauri v2 + Rust SQLite persistence",
      "MultiPV=2 Stockfish 19 game review",
      "11-tier move classification & Expected Points",
    ],
  },
  {
    phase: "Phase 2",
    title: "Openings, Puzzles & AI Coach",
    status: "Completed in Dev",
    items: [
      "SM-2 spaced-repetition repertoire trainer",
      "Mistake-extracted tactical puzzle bank",
      "Longitudinal weakness & error-risk modeling",
    ],
  },
  {
    phase: "Phase 3",
    title: "Public Release & Installers",
    status: "Coming Soon",
    items: [
      "Signed Windows, macOS, and Linux builds",
      "Automated GitHub Releases & checksums",
      "Public beta feedback & telemetry-free updates",
    ],
  },
];

export default function RoadmapPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Release Roadmap
        </h1>
        <p className="max-w-2xl text-slate-300">
          Tracking the path from local development to the first public ChessLab desktop release.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {MILESTONES.map((milestone) => (
          <div key={milestone.phase} className="tactile-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                {milestone.phase}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-slate-300">
                {milestone.status}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-white">{milestone.title}</h2>
            <ul className="space-y-2 text-sm text-slate-300">
              {milestone.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
