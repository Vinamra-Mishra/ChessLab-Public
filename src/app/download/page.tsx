import Link from "next/link";

type Platform = {
  name: string;
  architecture: string;
  notes: string;
  icon: "windows" | "mac" | "linux";
};

const PLATFORMS: Platform[] = [
  {
    name: "Windows",
    architecture: "x64 installer · .msi / .exe",
    notes: "Windows 10 and 11 · Stockfish 19 engine",
    icon: "windows",
  },
  {
    name: "macOS",
    architecture: "Universal app · .dmg",
    notes: "Apple silicon and Intel · macOS 13 or later",
    icon: "mac",
  },
  {
    name: "Linux",
    architecture: "AppImage / .deb",
    notes: "x86_64 · Wayland and X11",
    icon: "linux",
  },
];

function PlatformIcon({ icon }: { icon: Platform["icon"] }) {
  const shared = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.55,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  if (icon === "windows") {
    return <svg {...shared}><path d="m3 5 8-1.2v7H3zM13 3.5 21 2v8.8h-8zM3 13h8v7.2L3 19zM13 13h8v9l-8-1.2z" /></svg>;
  }
  if (icon === "mac") {
    return <svg {...shared}><rect x="4" y="3" width="16" height="13" rx="2" /><path d="M2.5 20h19M9 16v4m6-4v4" /><path d="M13.4 7.2c-.7 0-1 .4-1.5.4s-.9-.4-1.6-.4a2.2 2.2 0 0 0-2 2.3c0 1.4 1.2 3.1 2 3.1.5 0 .8-.3 1.5-.3s1 .3 1.5.3c.4 0 .9-.5 1.2-1.1-.8-.4-1.1-1-1.1-1.8 0-.7.4-1.4 1.1-1.7-.3-.5-.7-.8-1.1-.8Z" /></svg>;
  }
  return <svg {...shared}><path d="m7 6-4 6 4 6M12 18l5-12M20 7h1M20 12h1M20 17h1" /><path d="M10 21h4" /></svg>;
}

export default function DownloadPage() {
  return (
    <div className="subpage page-frame">
      <div className="subpage-heading">
        <p className="eyebrow"><span className="eyebrow__dot" /> Public release · In development</p>
        <h1 className="subpage-title">A studio for your<br /><em>desktop.</em></h1>
        <p className="subpage-lede">
          ChessLab is being prepared for Windows, macOS, and Linux. Public installers are not
          available yet; this page will be updated when verified builds are ready.
        </p>
      </div>

      <div className="release-banner" role="status">
        <span className="release-banner__icon" aria-hidden="true">↗</span>
        <span><strong>Downloads are coming soon</strong>The public beta is currently in development. No installer links are live yet.</span>
      </div>

      <div className="download-grid">
        {PLATFORMS.map((platform) => (
          <article className="platform-card" key={platform.name}>
            <div>
              <div className="platform-card__top">
                <span className="platform-card__icon"><PlatformIcon icon={platform.icon} /></span>
                <span className="platform-card__availability">Coming soon</span>
              </div>
              <h2>{platform.name}</h2>
              <p className="platform-card__architecture">{platform.architecture}</p>
              <p className="platform-card__notes">{platform.notes}</p>
            </div>
            <button className="platform-card__button" type="button" disabled aria-disabled="true">
              <span>Not available yet</span><span aria-hidden="true">⌁</span>
            </button>
          </article>
        ))}
      </div>

      <section className="release-steps" aria-labelledby="release-steps-title">
        <div className="release-steps__heading">
          <p className="eyebrow"><span className="eyebrow__index">NEXT</span> Before release</p>
          <h2 id="release-steps-title">Ready means more than downloadable.</h2>
          <p>We’ll publish the details alongside the builds, not after them.</p>
        </div>
        <div className="release-steps__list">
          <article className="release-step">
            <span className="release-step__number">01</span>
            <h3>Signed installers</h3>
            <p>Platform-specific builds packaged and signed for distribution.</p>
          </article>
          <article className="release-step">
            <span className="release-step__number">02</span>
            <h3>Checksums included</h3>
            <p>SHA-256 checksums published beside every public binary.</p>
          </article>
          <article className="release-step">
            <span className="release-step__number">03</span>
            <h3>Clear release notes</h3>
            <p>Version details, requirements, and known issues in one place.</p>
          </article>
        </div>
      </section>

      <div className="roadmap-bottom">
        <p>Want to follow what’s taking shape? The roadmap is the most up-to-date view of the work.</p>
        <Link href="/roadmap" className="text-link">Open the release roadmap <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  );
}
