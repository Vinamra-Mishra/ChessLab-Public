/**
 * ChessLab piece art.
 *
 * The turned pieces are generated from a lathe profile — a list of
 * [y, radius] pairs smoothed with a Catmull-Rom spline and mirrored around
 * the central axis. That is literally how these objects are made on a lathe,
 * so the silhouette is right before a single light is added. Crowns, mitres
 * and collars are drawn on top as separate sub-forms.
 *
 * Lighting is then applied as three clipped passes:
 *   1. vertical body ramp
 *   2. horizontal cylinder ramp (dark flank → gloss → falloff → rim)
 *   3. ember floor bounce, plus turned grooves at each joint
 */

import { WaterPiece3D } from "./WaterPiece3D";

export type PieceKind = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
export type PieceMaterial = "obsidian" | "ivory" | "chrome" | "ember" | "water";

/* Silhouettes are pre-generated geometry: exact, and tiny to ship. */
type Form = { d: string; t?: string };

const FORMS: Record<PieceKind, Form[]> = {
  pawn: [
    { d: "M105 116C106.3 116.7 110 118.3 113 120C116 121.7 120.3 123.7 123 126C125.7 128.3 127.7 131 129 134C130.3 137 131.2 140.7 131 144C130.8 147.3 129.7 151.2 128 154C126.3 156.8 123.5 159 121 161C118.5 163 114 164.2 113 166C112 167.8 113.8 170 115 172C116.2 174 119.8 176.3 120 178C120.2 179.7 117.7 180.5 116 182C114.3 183.5 111.2 184.7 110 187C108.8 189.3 108.7 192.5 109 196C109.3 199.5 110.8 203.7 112 208C113.2 212.3 114.5 217.3 116 222C117.5 226.7 119.3 231.3 121 236C122.7 240.7 124.5 245.7 126 250C127.5 254.3 129.2 258.3 130 262C130.8 265.7 130.8 270.3 131 272L69 272C69.2 270.3 69.2 265.7 70 262C70.8 258.3 72.5 254.3 74 250C75.5 245.7 77.3 240.7 79 236C80.7 231.3 82.5 226.7 84 222C85.5 217.3 86.8 212.3 88 208C89.2 203.7 90.7 199.5 91 196C91.3 192.5 91.2 189.3 90 187C88.8 184.7 85.7 183.5 84 182C82.3 180.5 79.8 179.7 80 178C80.2 176.3 83.8 174 85 172C86.2 170 88 167.8 87 166C86 164.2 81.5 163 79 161C76.5 159 73.7 156.8 72 154C70.3 151.2 69.2 147.3 69 144C68.8 140.7 69.7 137 71 134C72.3 131 74.3 128.3 77 126C79.7 123.7 84 121.7 87 120C90 118.3 93.7 116.7 95 116Z" },
  ],
  rook: [
    { d: "M142 126C142.8 126.7 146.3 128.2 147 130C147.7 131.8 147.2 134.5 146 137C144.8 139.5 142.7 142.3 140 145C137.3 147.7 132.5 150 130 153C127.5 156 126.2 159.2 125 163C123.8 166.8 123.5 171.2 123 176C122.5 180.8 122 186.7 122 192C122 197.3 122.5 202.7 123 208C123.5 213.3 124.2 218.7 125 224C125.8 229.3 127 235.3 128 240C129 244.7 130.2 248.3 131 252C131.8 255.7 132.5 258.7 133 262C133.5 265.3 133.8 270.3 134 272L66 272C66.2 270.3 66.5 265.3 67 262C67.5 258.7 68.2 255.7 69 252C69.8 248.3 71 244.7 72 240C73 235.3 74.2 229.3 75 224C75.8 218.7 76.5 213.3 77 208C77.5 202.7 78 197.3 78 192C78 186.7 77.5 180.8 77 176C76.5 171.2 76.2 166.8 75 163C73.8 159.2 72.5 156 70 153C67.5 150 62.7 147.7 60 145C57.3 142.3 55.2 139.5 54 137C52.8 134.5 52.3 131.8 53 130C53.7 128.2 57.2 126.7 58 126Z" },
    { d: "M54 104h92v20H54z" },
    { d: "M55 86h20v21H55z" },
    { d: "M90 86h20v21H90z" },
    { d: "M125 86h20v21h-20z" },
  ],
  bishop: [
    { d: "M104 92C105 92.7 107.7 94 110 96C112.3 98 115.5 101 118 104C120.5 107 122.8 110.7 125 114C127.2 117.3 129.3 120.7 131 124C132.7 127.3 134.3 130.8 135 134C135.7 137.2 135.7 140 135 143C134.3 146 132.7 149.2 131 152C129.3 154.8 127.3 157.7 125 160C122.7 162.3 118.8 164.2 117 166C115.2 167.8 113.5 169.3 114 171C114.5 172.7 118.5 174.3 120 176C121.5 177.7 123.3 179.3 123 181C122.7 182.7 120 184.3 118 186C116 187.7 112.5 189.2 111 191C109.5 192.8 108.8 194.2 109 197C109.2 199.8 110.8 204.2 112 208C113.2 211.8 114.5 216 116 220C117.5 224 119.3 228 121 232C122.7 236 124.5 240.3 126 244C127.5 247.7 128.8 250.3 130 254C131.2 257.7 132.7 263 133 266C133.3 269 132.2 271 132 272L68 272C67.8 271 66.7 269 67 266C67.3 263 68.8 257.7 70 254C71.2 250.3 72.5 247.7 74 244C75.5 240.3 77.3 236 79 232C80.7 228 82.5 224 84 220C85.5 216 86.8 211.8 88 208C89.2 204.2 90.8 199.8 91 197C91.2 194.2 90.5 192.8 89 191C87.5 189.2 84 187.7 82 186C80 184.3 77.3 182.7 77 181C76.7 179.3 78.5 177.7 80 176C81.5 174.3 85.5 172.7 86 171C86.5 169.3 84.8 167.8 83 166C81.2 164.2 77.3 162.3 75 160C72.7 157.7 70.7 154.8 69 152C67.3 149.2 65.7 146 65 143C64.3 140 64.3 137.2 65 134C65.7 130.8 67.3 127.3 69 124C70.7 120.7 72.8 117.3 75 114C77.2 110.7 79.5 107 82 104C84.5 101 87.7 98 90 96C92.3 94 95 92.7 96 92Z" },
    { d: "M100 62c-5 0-8 4-8 8 0 4 3 7 8 7s8-3 8-7c0-4-3-8-8-8Z" },
    { d: "M95 77h10v17H95z" },
    { d: "M100 84 90 96h20z" },
  ],
  queen: [
    { d: "M146 106C146.3 106.7 148.2 108.2 148 110C147.8 111.8 146.8 114.5 145 117C143.2 119.5 139.7 122.3 137 125C134.3 127.7 130.8 130 129 133C127.2 136 126.7 139.3 126 143C125.3 146.7 125 151 125 155C125 159 125.5 162.7 126 167C126.5 171.3 127.3 175.7 128 181C128.7 186.3 129.3 193 130 199C130.7 205 131.3 211 132 217C132.7 223 133.2 229.7 134 235C134.8 240.3 136.2 245.3 137 249C137.8 252.7 138.3 254 139 257C139.7 260 141 264.5 141 267C141 269.5 139.3 271.2 139 272L61 272C60.7 271.2 59 269.5 59 267C59 264.5 60.3 260 61 257C61.7 254 62.2 252.7 63 249C63.8 245.3 65.2 240.3 66 235C66.8 229.7 67.3 223 68 217C68.7 211 69.3 205 70 199C70.7 193 71.3 186.3 72 181C72.7 175.7 73.5 171.3 74 167C74.5 162.7 75 159 75 155C75 151 74.7 146.7 74 143C73.3 139.3 72.8 136 71 133C69.2 130 65.7 127.7 63 125C60.3 122.3 56.8 119.5 55 117C53.2 114.5 52.2 111.8 52 110C51.8 108.2 53.7 106.7 54 106Z" },
    { d: "M100 58 52 110l10-52 4-1 15 26 19-40 19 40 15-26 4 1 10 52Z" },
    { d: "M52 50a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" },
    { d: "M148 50a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" },
    { d: "M66 74a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" },
    { d: "M134 74a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" },
    { d: "M100 46a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z" },
    { d: "M54 106h92v18H54z" },
  ],
  king: [
    { d: "M146 128C146.3 128.7 148.2 130.2 148 132C147.8 133.8 147 136.5 145 139C143 141.5 138.8 144.3 136 147C133.2 149.7 129.8 152 128 155C126.2 158 125.7 161.3 125 165C124.3 168.7 124.2 172.7 124 177C123.8 181.3 123.8 186.3 124 191C124.2 195.7 124.5 200.3 125 205C125.5 209.7 126.2 214.3 127 219C127.8 223.7 129 228.3 130 233C131 237.7 132.2 243 133 247C133.8 251 134.3 253.7 135 257C135.7 260.3 137 264.5 137 267C137 269.5 135.3 271.2 135 272L65 272C64.7 271.2 63 269.5 63 267C63 264.5 64.3 260.3 65 257C65.7 253.7 66.2 251 67 247C67.8 243 69 237.7 70 233C71 228.3 72.2 223.7 73 219C73.8 214.3 74.5 209.7 75 205C75.5 200.3 75.8 195.7 76 191C76.2 186.3 76.2 181.3 76 177C75.8 172.7 75.7 168.7 75 165C74.3 161.3 73.8 158 72 155C70.2 152 66.8 149.7 64 147C61.2 144.3 57 141.5 55 139C53 136.5 52.2 133.8 52 132C51.8 130.2 53.7 128.7 54 128Z" },
    { d: "M93 18h14v20h20v14h-20v20H93V52H73V38h20Z" },
    { d: "M56 128V94l18 14 13-28 13-9 13 9 13 28 18-14v34Z" },
    { d: "M56 120h88v16H56z" },
  ],
  knight: [
    { d: "M58 272V250c0-6 5-11 11-11h2c7 0 12-5 14-12 3-9 7-18 13-26 7-10 16-18 26-24 6-4 10-9 12-16l8 10 6-14 8 16c1 4 4 7 8 8l14 5c7 2 9 11 4 16l-10 10c-5 5-12 8-19 8h-8c-8 1-14 7-15 15-1 9-3 17-7 25-4 8-10 14-18 18l-10 5c-5 3-8 8-8 14v14Z", t: "translate(0 -152) scale(1 1.6)" },
    { d: "M56 214h88c4 0 7 3 7 7v12c0 4-3 7-7 7H56c-4 0-7-3-7-7v-12c0-4 3-7 7-7Z" },
    { d: "M46 244h108c5 0 9 4 9 9v10c0 5-4 9-9 9H46c-5 0-9-4-9-9v-10c0-5 4-9 9-9Z" },
  ]
};

/** Turned joints: [y, halfWidth] — soft lighting breaks at each collar. */
const JOINTS: Record<PieceKind, Array<[number, number]>> = {
  pawn: [[116, 6], [166, 14], [198, 26], [220, 34], [252, 40]],
  rook: [[126, 44], [140, 34], [176, 28], [252, 40]],
  knight: [[221, 46], [252, 54]],
  bishop: [[100, 12], [148, 34], [180, 26], [252, 40]],
  queen: [[110, 45], [150, 32], [252, 40]],
  king: [[130, 42], [150, 32], [252, 40]],
};

type Material = {
  body: string;
  cylinder: string;
  groove: string;
  grooveOpacity: number;
  lip: string;
  lipOpacity: number;
  bounce: string;
  bounceOpacity: number;
  specular: string;
  specularOpacity: number;
  glowId: string;
  floorId: string;
};

const MATERIALS: Record<PieceMaterial, Material> = {
  obsidian: {
    body: "url(#pa-body-obsidian)",
    cylinder: "url(#pa-cyl-obsidian)",
    groove: "#000000",
    grooveOpacity: 0.5,
    lip: "#d8f1ff",
    lipOpacity: 0.3,
    bounce: "#ff5b2e",
    bounceOpacity: 0.5,
    specular: "#ffffff",
    specularOpacity: 0.32,
    glowId: "pa-glow-obsidian",
    floorId: "pa-floor-obsidian",
  },
  ivory: {
    body: "url(#pa-body-ivory)",
    cylinder: "url(#pa-cyl-ivory)",
    groove: "#8a8172",
    grooveOpacity: 0.3,
    lip: "#ffffff",
    lipOpacity: 0.72,
    bounce: "#ffb27a",
    bounceOpacity: 0.42,
    specular: "#ffffff",
    specularOpacity: 0.78,
    glowId: "pa-glow-ivory",
    floorId: "pa-floor-ivory",
  },
  chrome: {
    body: "url(#pa-body-chrome)",
    cylinder: "url(#pa-cyl-chrome)",
    groove: "#0d1417",
    grooveOpacity: 0.46,
    lip: "#ffffff",
    lipOpacity: 0.85,
    bounce: "#7fe4ff",
    bounceOpacity: 0.4,
    specular: "#ffffff",
    specularOpacity: 0.9,
    glowId: "pa-glow-chrome",
    floorId: "pa-floor-chrome",
  },
  water: {
    body: "url(#pa-body-water)",
    cylinder: "url(#pa-cyl-water)",
    groove: "#0b3b52",
    grooveOpacity: 0.24,
    lip: "#e6fbff",
    lipOpacity: 0.65,
    bounce: "#5eead4",
    bounceOpacity: 0.38,
    specular: "#f0fdff",
    specularOpacity: 0.55,
    glowId: "pa-glow-water",
    floorId: "pa-floor-water",
  },
  ember: {
    body: "url(#pa-body-ember)",
    cylinder: "url(#pa-cyl-ember)",
    groove: "#4a0f00",
    grooveOpacity: 0.4,
    lip: "#ffe2c4",
    lipOpacity: 0.7,
    bounce: "#ff8a3d",
    bounceOpacity: 0.55,
    specular: "#fff3e2",
    specularOpacity: 0.72,
    glowId: "pa-glow-ember",
    floorId: "pa-floor-ember",
  },
};

export function PieceArt({
  kind,
  material = "ivory",
  glow = false,
  className,
  width,
  height,
  label,
}: {
  kind: PieceKind;
  material?: PieceMaterial;
  glow?: boolean;
  className?: string;
  width?: number;
  height?: number;
  label?: string;
}) {
  if (material === "water") {
    return <WaterPiece3D kind={kind} className={className} label={label} />;
  }

  const forms = FORMS[kind];
  const joints = JOINTS[kind] ?? [];
  const m = MATERIALS[material];

  return (
    <svg
      viewBox="0 0 200 300"
      className={className}
      width={width}
      height={height}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      data-material={material}
    >
      {glow ? <ellipse cx="100" cy="270" rx="108" ry="25" fill={`url(#${m.glowId})`} /> : null}
      <ellipse cx="100" cy="268" rx="60" ry="8" fill="#000" opacity="0.62" />

      <g clipPath={`url(#pa-clip-${kind})`}>
        {forms.map((f, i) => (
          <path key={`f-${i}`} d={f.d} transform={f.t} fill={m.body} />
        ))}

        <rect x="0" y="0" width="200" height="300" fill={m.cylinder} />

        {/* single narrow highlight, slightly off-centre */}
        <path
          d="M78 54c-5 44-6 120-2 200 3 2 6 1 7-3-4-76-2-152 2-197Z"
          fill={m.specular}
          opacity={m.specularOpacity}
        />

        <rect
          x="0"
          y="218"
          width="200"
          height="82"
          fill={`url(#${m.floorId})`}
          opacity={Math.min(1, m.bounceOpacity + 0.25)}
        />

        {joints.map(([y, rx], i) => (
          <g key={`j-${i}`}>
            <ellipse cx="100" cy={y} rx={rx} ry={3.2} fill={m.groove} opacity={m.grooveOpacity * 0.75} />
            <ellipse cx="100" cy={y + 5} rx={rx * 0.9} ry={2.6} fill={m.lip} opacity={m.lipOpacity * 0.32} />
          </g>
        ))}
      </g>

      <g fill="none" stroke={`url(#pa-edge-${material})`} strokeWidth="1" strokeLinejoin="round">
        {forms.map((f, i) => (
          <path key={`e-${i}`} d={f.d} transform={f.t} />
        ))}
      </g>
    </svg>
  );
}

/** Shared gradients, clip paths and glows. Render once per page. */
export function PieceDefs() {
  const kinds = Object.keys(FORMS) as PieceKind[];
  const materials = Object.keys(MATERIALS) as PieceMaterial[];

  return (
    <svg className="piece-defs" aria-hidden="true" focusable="false">
      <defs>
        {kinds.map((kind) => (
          <clipPath id={`pa-clip-${kind}`} key={kind}>
            {FORMS[kind].map((f, i) => (
              <path key={i} d={f.d} transform={f.t} />
            ))}
          </clipPath>
        ))}

        <linearGradient id="pa-body-obsidian" x1="0" y1="10" x2="0" y2="278" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#55656d" />
          <stop offset="0.2" stopColor="#26333a" />
          <stop offset="0.54" stopColor="#0b1216" />
          <stop offset="0.85" stopColor="#020506" />
          <stop offset="1" stopColor="#000000" />
        </linearGradient>
        <linearGradient id="pa-body-ivory" x1="0" y1="10" x2="0" y2="278" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.26" stopColor="#f6f0e6" />
          <stop offset="0.6" stopColor="#ddd3c1" />
          <stop offset="0.85" stopColor="#b3a897" />
          <stop offset="1" stopColor="#847b6d" />
        </linearGradient>
        <linearGradient id="pa-body-chrome" x1="0" y1="10" x2="0" y2="278" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.24" stopColor="#e6f0f6" />
          <stop offset="0.5" stopColor="#b7c9d3" />
          <stop offset="0.76" stopColor="#7e919c" />
          <stop offset="1" stopColor="#3c4a52" />
        </linearGradient>
        <linearGradient id="pa-body-ember" x1="0" y1="10" x2="0" y2="278" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffe6cc" />
          <stop offset="0.26" stopColor="#ffb67f" />
          <stop offset="0.56" stopColor="#ff7132" />
          <stop offset="0.83" stopColor="#bc3b0b" />
          <stop offset="1" stopColor="#5d1500" />
        </linearGradient>
        <linearGradient id="pa-body-water" x1="0" y1="10" x2="0" y2="278" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#e0f9ff" stopOpacity="0.9" />
          <stop offset="0.28" stopColor="#7dd3fc" stopOpacity="0.82" />
          <stop offset="0.58" stopColor="#38bdf8" stopOpacity="0.78" />
          <stop offset="0.84" stopColor="#0284c7" stopOpacity="0.85" />
          <stop offset="1" stopColor="#0c4a6e" stopOpacity="0.92" />
        </linearGradient>

        {materials.map((material) => {
          const rim =
            material === "ivory"
              ? "#ffe9cc"
              : material === "chrome"
                ? "#d6f6ff"
                : material === "ember"
                  ? "#ffd0a0"
                  : material === "water"
                    ? "#bae6fd"
                    : "#ff8a55";
          const dark = material === "ivory" || material === "chrome" || material === "water" ? "#0e4f6e" : "#000000";
          return (
            <linearGradient id={`pa-cyl-${material}`} key={material} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={dark} stopOpacity={material === "chrome" ? 0.5 : 0.68} />
              <stop offset="0.1" stopColor={dark} stopOpacity="0.16" />
              <stop offset="0.26" stopColor="#ffffff" stopOpacity={material === "chrome" ? 0.44 : 0.24} />
              <stop offset="0.38" stopColor="#ffffff" stopOpacity="0.04" />
              <stop offset="0.62" stopColor={dark} stopOpacity="0.1" />
              <stop offset="0.82" stopColor={dark} stopOpacity="0.44" />
              <stop offset="0.93" stopColor={rim} stopOpacity="0.48" />
              <stop offset="1" stopColor={rim} stopOpacity="0.16" />
            </linearGradient>
          );
        })}

        {materials.map((material) => {
          const c =
            material === "ivory"
              ? "#fff6e6"
              : material === "chrome"
                ? "#e8fbff"
                : material === "ember"
                  ? "#ffd9b0"
                  : "#ff9a68";
          return (
            <linearGradient id={`pa-edge-${material}`} key={material} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={c} stopOpacity="0.1" />
              <stop offset="0.55" stopColor={c} stopOpacity="0.26" />
              <stop offset="0.9" stopColor={c} stopOpacity="0.68" />
              <stop offset="1" stopColor={c} stopOpacity="0.28" />
            </linearGradient>
          );
        })}

        <linearGradient id="pa-floor-obsidian" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff5b2e" stopOpacity="0" />
          <stop offset="1" stopColor="#ff5b2e" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="pa-floor-ivory" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb27a" stopOpacity="0" />
          <stop offset="1" stopColor="#ffb27a" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="pa-floor-chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fe4ff" stopOpacity="0" />
          <stop offset="1" stopColor="#7fe4ff" stopOpacity="0.34" />
        </linearGradient>
        <linearGradient id="pa-floor-ember" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff8a3d" stopOpacity="0" />
          <stop offset="1" stopColor="#ff8a3d" stopOpacity="0.42" />
        </linearGradient>
        <linearGradient id="pa-floor-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#38bdf8" stopOpacity="0" />
          <stop offset="1" stopColor="#38bdf8" stopOpacity="0.42" />
        </linearGradient>

        <radialGradient id="pa-glow-obsidian">
          <stop offset="0" stopColor="#ff5b2e" stopOpacity="0.5" />
          <stop offset="0.42" stopColor="#ff5b2e" stopOpacity="0.16" />
          <stop offset="1" stopColor="#ff5b2e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pa-glow-ivory">
          <stop offset="0" stopColor="#ffb27a" stopOpacity="0.4" />
          <stop offset="0.46" stopColor="#ffb27a" stopOpacity="0.12" />
          <stop offset="1" stopColor="#ffb27a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pa-glow-chrome">
          <stop offset="0" stopColor="#7fe4ff" stopOpacity="0.38" />
          <stop offset="0.46" stopColor="#7fe4ff" stopOpacity="0.1" />
          <stop offset="1" stopColor="#7fe4ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pa-glow-ember">
          <stop offset="0" stopColor="#ff8a3d" stopOpacity="0.5" />
          <stop offset="0.46" stopColor="#ff8a3d" stopOpacity="0.14" />
          <stop offset="1" stopColor="#ff8a3d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pa-glow-water">
          <stop offset="0" stopColor="#38bdf8" stopOpacity="0.44" />
          <stop offset="0.46" stopColor="#5eead4" stopOpacity="0.16" />
          <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
