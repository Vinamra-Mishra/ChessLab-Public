/**
 * ChessLab mark — the knight's move drawn as a single geometric L that
 * jumps from the bottom-left dot to the top-right dot. Tuned to stay
 * legible at 28px and hold up at 64px.
 */
export function BrandMark({ title }: { title?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden={title ? undefined : true} role={title ? "img" : undefined}>
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id="bm-tile" x1="6" y1="2" x2="42" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#152a22" />
          <stop offset="0.55" stopColor="#0b1713" />
          <stop offset="1" stopColor="#050b09" />
        </linearGradient>
        <linearGradient id="bm-line" x1="13" y1="36" x2="35" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#14a273" />
          <stop offset="0.5" stopColor="#2fe0a0" />
          <stop offset="1" stopColor="#d6fff0" />
        </linearGradient>
      </defs>

      <rect x="0.75" y="0.75" width="46.5" height="46.5" rx="13" fill="url(#bm-tile)" />
      <rect x="0.75" y="0.75" width="46.5" height="46.5" rx="13" stroke="#ffffff" strokeOpacity="0.14" />
      <rect x="0.75" y="0.75" width="46.5" height="46.5" rx="13" stroke="url(#bm-line)" strokeOpacity="0.28" />

      {/* the knight's path: start dot → across → up → arrow */}
      <path
        d="M13.5 34.5V22.5H31V13"
        stroke="url(#bm-line)"
        strokeWidth="4"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <circle cx="13.5" cy="34.5" r="3.4" fill="#2fe0a0" />
      <circle cx="13.5" cy="34.5" r="1.2" fill="#031711" />
      <path d="M25.4 11.6 34.4 13.2 31 21.6Z" fill="#d6fff0" />
    </svg>
  );
}
