import Link from "next/link";

const FEATURES = [
  {
    title: "Local Stockfish 19 Engine",
    description:
      "MultiPV UCI analysis bar, variation lines, and instant evaluation right on your machine with zero cloud latency.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
      </svg>
    ),
  },
  {
    title: "Expected Points Game Review",
    description:
      "11-tier move classification, phase-by-phase accuracy breakdown, critical-moment explanations, and mistake retry mode.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 3v18h18" />
        <path d="M7 14l4-4 4 3 5-6" />
      </svg>
    ),
  },
  {
    title: "Spaced-Repetition Openings",
    description:
      "Transposition-aware repertoire builder paired with SM-2 spaced-repetition drills to lock in your lines.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    title: "AI Coach & Weakness Lab",
    description:
      "Longitudinal error-risk modeling and personalized study insights trained on your own reviewed games.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#11161f]/90 p-8 sm:p-14">
        <div
          className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl animate-float-slow"
          aria-hidden="true"
        />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-emerald-300">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            Coming Soon — Public Beta
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            100% Local Chess Analysis &amp; Coaching.
          </h1>

          <p className="text-lg leading-relaxed text-slate-300">
            ChessLab is an offline-first desktop studio built with Tauri v2, Rust, SQLite, and
            Stockfish 19. Analyze games, drill openings, and track your weaknesses without
            subscriptions or cloud lock-in.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/download"
              className="tactile-btn inline-flex items-center gap-2.5 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-slate-950"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              View Upcoming Downloads
            </Link>

            <Link
              href="/roadmap"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Release Roadmap
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Built for Serious Improvement
          </h2>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            v0.1.0-alpha
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="tactile-card rounded-2xl p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-400">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
