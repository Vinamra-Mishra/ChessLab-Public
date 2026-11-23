const PLATFORMS = [
  {
    name: "Windows",
    arch: "x64 Installer (.msi / .exe)",
    notes: "Windows 10 / 11 • Bundled Stockfish 19 AVX2",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
      </svg>
    ),
  },
  {
    name: "macOS",
    arch: "Universal (.dmg)",
    notes: "Apple Silicon & Intel • macOS 13+",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="4" width="16" height="12" rx="2" />
        <path d="M2 20h20" />
      </svg>
    ),
  },
  {
    name: "Linux",
    arch: "AppImage / .deb",
    notes: "x86_64 • Wayland & X11",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
];

export default function DownloadPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-medium uppercase tracking-wider text-amber-300">
          Coming Soon
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Download ChessLab
        </h1>
        <p className="max-w-2xl text-slate-300">
          Public installers are currently in final packaging and calibration. Once released,
          verified binaries and SHA-256 checksums will be published here.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PLATFORMS.map((platform) => (
          <div key={platform.name} className="tactile-card flex flex-col justify-between rounded-2xl p-6 space-y-6">
            <div className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-emerald-400">
                {platform.icon}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{platform.name}</h2>
                <p className="text-sm font-mono text-emerald-300">{platform.arch}</p>
              </div>
              <p className="text-sm text-slate-400">{platform.notes}</p>
            </div>

            <button
              type="button"
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-400"
            >
              Coming Soon
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
