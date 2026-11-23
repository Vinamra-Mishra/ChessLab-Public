import Link from "next/link";
import { Piece, PieceDefs } from "@/components/Pieces";

type Platform = {
  name: string;
  arch: string;
  notes: string;
  icon: "windows" | "mac" | "linux";
  size: string;
};

const PLATFORMS: Platform[] = [
  {
    name: "Windows",
    arch: "x64 · .msi / .exe",
    notes: "Windows 10 and 11 · bundled Stockfish 19",
    icon: "windows",
    size: "148 MB",
  },
  {
    name: "macOS",
    arch: "Universal · .dmg",
    notes: "Apple silicon and Intel · macOS 13+",
    icon: "mac",
    size: "156 MB",
  },
  {
    name: "Linux",
    arch: "x86_64 · AppImage / .deb",
    notes: "Wayland and X11",
    icon: "linux",
    size: "151 MB",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Signed installers",
    copy: "Platform builds packaged and code-signed for distribution.",
  },
  {
    number: "02",
    title: "Checksums included",
    copy: "SHA-256 checksums published beside every public binary.",
  },
  {
    number: "03",
    title: "Clear release notes",
    copy: "Version details, requirements, and known issues in one place.",
  },
];

function PlatformIcon({ icon }: { icon: Platform["icon"] }) {
  const shared = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  if (icon === "windows") {
    return (
      <svg {...shared}>
        <path d="M4 5.6 11 4.6v6.6H4zM13 4.3l7-1v7.9h-7zM4 12.6h7v6.7l-7-1zM13 12.6h7v8.1l-7-1z" />
      </svg>
    );
  }
  if (icon === "mac") {
    return (
      <svg {...shared}>
        <rect x="3.2" y="4" width="17.6" height="11.4" rx="1.6" />
        <path d="M1.8 19.4h20.4M9.4 15.4v4M14.6 15.4v4" />
        <path d="M12.6 7.3c.4-.5.7-1.2.6-1.9-.6.1-1.3.5-1.7 1-.4.4-.7 1.1-.6 1.8.6 0 1.3-.4 1.7-.9Z" />
      </svg>
    );
  }
  return (
    <svg {...shared}>
      <path d="m7 6-4 6 4 6M12 18l5-12M20 7h1M20 12h1M20 17h1M10 21h4" />
    </svg>
  );
}

export default function DownloadPage() {
  return (
    <div className="subpage">
      <PieceDefs />

      <section className="page-frame subpage__hero">
        <p className="eyebrow">
          <span className="eyebrow__dot" /> Public release · In development
        </p>
        <div className="subpage__hero-grid">
          <h1 className="subpage__title">
            A studio for your <em className="serif-em">desktop.</em>
          </h1>
          <div className="subpage__hero-aside">
            <p>
              ChessLab is being prepared for Windows, macOS, and Linux. Public installers are
              not available yet — this page will update the moment verified builds are ready.
            </p>
            <Link className="link-arrow" href="/roadmap">
              Track the release
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="page-frame subpage__body" aria-labelledby="platforms-title">
        <div className="notice" role="status">
          <span className="notice__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.4" />
              <path d="M12 8v5M12 16.2v.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <span className="notice__copy">
            <b>Downloads are coming soon</b>
            <small>The public beta is in development. No installer links are live yet.</small>
          </span>
          <span className="notice__tag">v0.1 · pre-release</span>
        </div>

        <h2 className="sr-only" id="platforms-title">
          Planned platforms
        </h2>

        <div className="platforms">
          {PLATFORMS.map((platform) => (
            <article className="platform" key={platform.name}>
              <div className="platform__top">
                <span className="platform__icon">
                  <PlatformIcon icon={platform.icon} />
                </span>
                <span className="platform__state">Coming soon</span>
              </div>
              <h3>{platform.name}</h3>
              <p className="platform__arch">{platform.arch}</p>
              <p className="platform__notes">{platform.notes}</p>
              <button className="platform__button" type="button" disabled>
                <span>Not available yet</span>
                <span className="platform__size">{platform.size}</span>
              </button>
            </article>
          ))}
        </div>

        <div className="local-first">
          <div className="local-first__copy">
            <p className="eyebrow">
              <span className="eyebrow__index">LOCAL-FIRST</span> What ships in the box
            </p>
            <h2>An app, an engine, and your games. That&apos;s it.</h2>
            <p>
              The installer bundles Stockfish 19 and the study database. No account, no server
              round trip, no telemetry — launch it, import a game, and start working.
            </p>
            <ul className="local-first__list">
              <li>Bundled Stockfish 19 build</li>
              <li>Local SQLite game database</li>
              <li>Works fully offline</li>
            </ul>
          </div>
          <div className="local-first__art" aria-hidden="true">
            <span className="local-first__ring" />
            <Piece kind="rook" tone="obsidian" className="piece" />
            <Piece kind="knight" tone="ivory" className="piece" />
            <Piece kind="bishop" tone="emerald" className="piece" />
          </div>
        </div>

        <section className="prep" aria-labelledby="prep-title">
          <div className="prep__head">
            <p className="eyebrow">
              <span className="eyebrow__index">NEXT</span> Before release
            </p>
            <h2 id="prep-title">Ready means more than downloadable.</h2>
            <p>We&apos;ll publish the details alongside the builds, not after them.</p>
          </div>
          <div className="prep__list">
            {STEPS.map((step) => (
              <article className="prep__step" key={step.number}>
                <span className="prep__number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="subpage__bottom">
          <p>Want to follow what&apos;s taking shape? The roadmap is the most up-to-date view of the work.</p>
          <Link className="btn btn--ghost" href="/roadmap">
            Open the release roadmap
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
