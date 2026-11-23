/**
 * ChessLab's hand-drawn vector chess set.
 *
 * Each piece is a small set of filled primitives that share one fill, so they
 * merge into a single silhouette. Depth comes from an offset "side" layer, and
 * light comes from a clipped gradient stack (key light upper-left, form shadow
 * lower-right, a faint bounce from the board). The same geometry powers the
 * flat `mono` glyphs used on the analysis board, so mock-ups stay consistent.
 */

export type PieceKind = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
export type PieceTone = "ivory" | "obsidian" | "emerald";

const PLINTH = [
  "M24 240h152c5.5 0 10 4.5 10 10v4c0 6.6-5.4 12-12 12H26c-6.6 0-12-5.4-12-12v-4c0-5.5 4.5-10 10-10Z",
  "M38 221h124c4.4 0 8 3.6 8 8v2c0 4.4-3.6 8-8 8H38c-4.4 0-8-3.6-8-8v-2c0-4.4 3.6-8 8-8Z",
];

const SHAPES: Record<PieceKind, string[]> = {
  pawn: [
    "M100 68a28 28 0 1 1 0 56 28 28 0 0 1 0-56Z",
    "M82 118c12 6 24 6 36 0l4 18H78l4-18Z",
    "M74 130h52c4.4 0 8 3.6 8 8v6c0 4.4-3.6 8-8 8H74c-4.4 0-8-3.6-8-8v-6c0-4.4 3.6-8 8-8Z",
    "M80 152h40c16 12 26 38 30 69H50c4-31 14-57 30-69Z",
    ...PLINTH,
  ],
  rook: [
    "M56 74h22v24H56zM89 74h22v24H89zM122 74h22v24h-22z",
    "M54 94h92c4.4 0 8 3.6 8 8v8c0 4.4-3.6 8-8 8H54c-4.4 0-8-3.6-8-8v-8c0-4.4 3.6-8 8-8Z",
    "M64 118h72c-1 30-4 62-6 78-1 8-2 15-2 25H72c0-10-1-17-2-25-2-16-5-48-6-78Z",
    ...PLINTH,
  ],
  knight: [
    "M64 220c-4-34 0-62 16-84 10-14 22-22 22-34l-6-30 26 22 4-14 10 16c12 2 22 10 28 20l18-2c8 0 10 10 2 14l-12 6c-6 10-16 16-28 16-10 0-16 6-16 16 0 10 6 20 10 28 8 14 12 30 12 46Z",
    ...PLINTH,
  ],
  bishop: [
    "M100 60a10 10 0 1 1 0 20 10 10 0 0 1 0-20Z",
    "M94 78h12v12H94z",
    "M100 86c25 4 43 24 43 47 0 9-3 18-8 25H65c-5-7-8-16-8-25 0-23 18-43 43-47Z",
    "M63 152h74c4.4 0 8 3.6 8 8v4c0 4.4-3.6 8-8 8H63c-4.4 0-8-3.6-8-8v-4c0-4.4 3.6-8 8-8Z",
    "M70 172h60c-2 18-4 32-6 42l-1 7H77l-1-7c-2-10-4-24-6-42Z",
    ...PLINTH,
  ],
  queen: [
    "M100 42a11 11 0 1 1 0 22 11 11 0 0 1 0-22Z",
    "M56 60a8 8 0 1 1 0 16 8 8 0 0 1 0-16ZM144 60a8 8 0 1 1 0 16 8 8 0 0 1 0-16Z",
    "M100 62 58 102l14-42 13 26 15-32 15 32 13-26 14 42Z",
    "M56 98h88c4.4 0 8 3.6 8 8v6c0 4.4-3.6 8-8 8H56c-4.4 0-8-3.6-8-8v-6c0-4.4 3.6-8 8-8Z",
    "M64 122h72c-2 26-6 56-8 82l-1 17H73l-1-17c-2-26-6-56-8-82Z",
    ...PLINTH,
  ],
  king: [
    "M92 22h16v20h20v15h-20v20H92V57H72V42h20Z",
    "M58 94 70 66l18 14 12-22 12 22 18-14 12 28Z",
    "M56 92h88c4.4 0 8 3.6 8 8v6c0 4.4-3.6 8-8 8H56c-4.4 0-8-3.6-8-8v-6c0-4.4 3.6-8 8-8Z",
    "M62 116h76c-2 30-6 66-8 92l-1 13H71l-1-13c-2-26-6-62-8-92Z",
    ...PLINTH,
  ],
};

/** Fine interior lines: mouth, mane, mitre cleft, crown seams. */
const DETAIL_LINES: Partial<Record<PieceKind, string[]>> = {
  knight: [
    "M124 108c10 5 22 4 30-2",
    "M104 74c-4 12-8 22-16 32",
    "M86 132c-4 16-6 34-6 52",
    "M112 92c6 5 10 12 12 20",
  ],
  bishop: ["M100 92c6 26 10 52 10 78"],
  queen: ["M83 102v22M100 102v22M117 102v22"],
  rook: ["M84 120h32"],
  king: ["M74 72v18M100 62v30M126 72v18"],
};

type ToneStyle = {
  body: string;
  side: string;
  sideOpacity: number;
  highlight: number;
  bounce: string;
  bounceOpacity: number;
};

const TONES: Record<PieceTone, ToneStyle> = {
  ivory: {
    body: "url(#pc-ivory)",
    side: "#6f7d77",
    sideOpacity: 0.85,
    highlight: 0.85,
    bounce: "#8ff2cd",
    bounceOpacity: 0.1,
  },
  obsidian: {
    body: "url(#pc-obsidian)",
    side: "#020504",
    sideOpacity: 1,
    highlight: 0.42,
    bounce: "#2fe0a0",
    bounceOpacity: 0.2,
  },
  emerald: {
    body: "url(#pc-emerald)",
    side: "#04472f",
    sideOpacity: 1,
    highlight: 0.6,
    bounce: "#eafff7",
    bounceOpacity: 0.14,
  },
};

export function Piece({
  kind,
  tone = "ivory",
  mono = false,
  className,
  shadow = true,
  width,
  height,
}: {
  kind: PieceKind;
  tone?: PieceTone;
  mono?: boolean;
  className?: string;
  shadow?: boolean;
  width?: number;
  height?: number;
}) {
  const shapes = SHAPES[kind];
  const details = DETAIL_LINES[kind] ?? [];

  if (mono) {
    return (
      <svg viewBox="0 0 200 280" className={className} width={width} height={height} aria-hidden="true" focusable="false">
        {shapes.map((d, index) => (
          <path key={index} d={d} fill="currentColor" />
        ))}
      </svg>
    );
  }

  const style = TONES[tone];

  return (
    <svg viewBox="0 0 200 280" className={className} width={width} height={height} aria-hidden="true" focusable="false" style={{ overflow: "hidden" }}>
      {shadow ? (
        <ellipse cx="104" cy="266" rx="70" ry="10" fill={style.bounce} opacity={style.bounceOpacity * 1.4} />
      ) : null}

      {/* extruded base: only the plinth is offset so no interior seams appear */}
      <g fill={style.side} opacity={style.sideOpacity} transform="translate(0 9)">
        {PLINTH.map((d, index) => (
          <path key={`side-${index}`} d={d} />
        ))}
      </g>

      {/* face */}
      <g fill={style.body}>
        {shapes.map((d, index) => (
          <path key={`face-${index}`} d={d} />
        ))}
      </g>

      {/* clipped light and shadow */}
      <g clipPath={`url(#pc-clip-${kind})`}>
        <rect x="0" y="0" width="200" height="280" fill={style.body} />
        <ellipse cx="62" cy="90" rx="78" ry="92" fill="url(#pc-key)" opacity={style.highlight} />
        <path d="M132 20h120v270H58c40-46 60-116 46-170Z" fill="url(#pc-shade)" opacity={tone === "ivory" ? 0.34 : 0.46} />
        <ellipse cx="104" cy="248" rx="84" ry="42" fill={style.bounce} opacity={style.bounceOpacity} />
        <path d="M60 120c-6 28-5 58 0 84 3 1.5 5.5.5 6.5-1.5-6-26-7-56-1.5-81Z" fill="#ffffff" opacity={tone === "ivory" ? 0.55 : 0.22} />
      </g>

      {/* interior lines */}
      <g fill="none" stroke={tone === "ivory" ? "#5c6a64" : "#d8fff0"} strokeOpacity="0.45" strokeWidth="1.4" strokeLinecap="round">
        {details.map((d, index) => (
          <path key={`detail-${index}`} d={d} fill="none" />
        ))}
      </g>
    </svg>
  );
}

/**
 * Shared gradients and clip paths. Render exactly once per page.
 */
export function PieceDefs() {
  const kinds = Object.keys(SHAPES) as PieceKind[];

  return (
    <svg className="piece-defs" aria-hidden="true" focusable="false">
      <defs>
        {kinds.map((kind) => (
          <clipPath id={`pc-clip-${kind}`} key={kind}>
            {SHAPES[kind].map((d, index) => (
              <path key={index} d={d} />
            ))}
          </clipPath>
        ))}

        <linearGradient id="pc-ivory" x1="40" y1="30" x2="164" y2="252" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.28" stopColor="#e9eeeb" />
          <stop offset="0.58" stopColor="#c8d2cd" />
          <stop offset="0.82" stopColor="#a3b0aa" />
          <stop offset="1" stopColor="#7f8c86" />
        </linearGradient>

        <linearGradient id="pc-obsidian" x1="34" y1="26" x2="170" y2="256" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5d7a6e" />
          <stop offset="0.3" stopColor="#334741" />
          <stop offset="0.62" stopColor="#1a2723" />
          <stop offset="1" stopColor="#050a08" />
        </linearGradient>

        <linearGradient id="pc-emerald" x1="34" y1="24" x2="170" y2="258" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#eafff6" />
          <stop offset="0.24" stopColor="#9dffd8" />
          <stop offset="0.52" stopColor="#3fe4a8" />
          <stop offset="0.8" stopColor="#0c9c6b" />
          <stop offset="1" stopColor="#033a27" />
        </linearGradient>

        <radialGradient id="pc-key" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="pc-shade" x1="0" y1="0" x2="0.45" y2="1">
          <stop offset="0" stopColor="#000000" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
