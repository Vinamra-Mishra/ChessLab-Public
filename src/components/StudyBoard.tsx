import { Piece, type PieceKind, type PieceTone } from "./Pieces";

type Unit = { kind: PieceKind; tone: PieceTone };

/**
 * A composed study position: white has castled short, black's queen has
 * arrived on the queenside, and the center is locked. Coordinates read
 * from White's side (rank 8 at the top).
 */
const POSITION: Array<Array<Unit | null>> = [
  // rank 8
  [null, null, { kind: "rook", tone: "obsidian" }, null, null, { kind: "rook", tone: "obsidian" }, { kind: "king", tone: "obsidian" }, null],
  // rank 7
  [{ kind: "pawn", tone: "obsidian" }, { kind: "pawn", tone: "obsidian" }, null, { kind: "pawn", tone: "obsidian" }, null, { kind: "pawn", tone: "obsidian" }, { kind: "pawn", tone: "obsidian" }, { kind: "pawn", tone: "obsidian" }],
  // rank 6
  [null, null, { kind: "knight", tone: "obsidian" }, null, null, { kind: "knight", tone: "obsidian" }, null, null],
  // rank 5
  [null, null, null, { kind: "queen", tone: "obsidian" }, { kind: "pawn", tone: "obsidian" }, null, null, null],
  // rank 4
  [null, null, null, null, { kind: "pawn", tone: "ivory" }, null, { kind: "bishop", tone: "ivory" }, null],
  // rank 3
  [null, null, { kind: "bishop", tone: "ivory" }, { kind: "pawn", tone: "ivory" }, null, { kind: "pawn", tone: "ivory" }, null, null],
  // rank 2
  [{ kind: "pawn", tone: "ivory" }, { kind: "pawn", tone: "ivory" }, null, null, null, null, { kind: "pawn", tone: "ivory" }, { kind: "pawn", tone: "ivory" }],
  // rank 1
  [{ kind: "rook", tone: "ivory" }, null, null, { kind: "queen", tone: "ivory" }, { kind: "rook", tone: "ivory" }, { kind: "king", tone: "ivory" }, null, null],
];

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

/** Highlights expressed as [fileIndex, rankIndexFromTop]. */
const HIGHLIGHTS = new Set(["d5", "d4", "e4"]);
const LAST_MOVE = new Set(["d5", "d4"]);

/**
 * The interactive-looking study board at the top of the page. Pure SVG;
 * no canvas, no 3D runtime, no external images.
 */
export function StudyBoard({ className, overlay = false }: { className?: string; overlay?: boolean }) {
  const size = 720;
  const pad = 26;
  const board = size - pad * 2;
  const square = board / 8;

  return (
    <div className={`study-board${overlay ? " study-board--overlay" : ""}${className ? ` ${className}` : ""}`}>
      <div className="study-board__chrome">
        <span className="study-board__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="study-board__file">study — sicilian / accelerated dragon</span>
        <span className="study-board__badge">
          <i /> EVAL +0.42
        </span>
      </div>

      <div className="study-board__stage">
        <svg viewBox={`0 0 ${size} ${size}`} className="study-board__svg" role="img" aria-label="A study position on the analysis board: White has castled, Black has brought the queen to d5.">
          <defs>
            <linearGradient id="sb-board" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#0b1210" />
              <stop offset="1" stopColor="#050807" />
            </linearGradient>
            <linearGradient id="sb-light" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#0f241c" />
              <stop offset="1" stopColor="#0a1a15" />
            </linearGradient>
            <linearGradient id="sb-dark" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#07100d" />
              <stop offset="1" stopColor="#030706" />
            </linearGradient>
            <radialGradient id="sb-glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#2fe0a0" stopOpacity="0.5" />
              <stop offset="1" stopColor="#2fe0a0" stopOpacity="0" />
            </radialGradient>
            <filter id="sb-soft" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>

          {/* board frame */}
          <rect x={pad - 10} y={pad - 10} width={board + 20} height={board + 20} rx="18" fill="url(#sb-board)" stroke="rgba(255,255,255,0.08)" />
          <rect x={pad - 10} y={pad - 10} width={board + 20} height={board + 20} rx="18" fill="none" stroke="url(#sb-glow)" strokeOpacity="0.25" />

          {Array.from({ length: 64 }, (_, index) => {
            const file = index % 8;
            const rank = Math.floor(index / 8);
            const light = (file + rank) % 2 === 0;
            const key = `${FILES[file]}${8 - rank}`;
            const highlighted = HIGHLIGHTS.has(key);
            const last = LAST_MOVE.has(key);
            return (
              <g key={key}>
                <rect
                  x={pad + file * square}
                  y={pad + rank * square}
                  width={square}
                  height={square}
                  fill={light ? "url(#sb-light)" : "url(#sb-dark)"}
                />
                <rect
                  x={pad + file * square}
                  y={pad + rank * square}
                  width={square}
                  height={square}
                  fill="none"
                  stroke="rgba(255,255,255,0.035)"
                />
                {highlighted ? (
                  <rect
                    x={pad + file * square + 1}
                    y={pad + rank * square + 1}
                    width={square - 2}
                    height={square - 2}
                    fill="#2fe0a0"
                    fillOpacity={last ? 0.22 : 0.09}
                    stroke="#2fe0a0"
                    strokeOpacity={last ? 0.9 : 0.5}
                    strokeWidth="1.5"
                  />
                ) : null}
              </g>
            );
          })}

          {POSITION.map((row, rank) =>
            row.map((unit, file) => {
              if (!unit) return null;
              return (
                <g
                  key={`${file}-${rank}`}
                  transform={`translate(${pad + file * square + square * 0.02} ${pad + rank * square - square * 0.36})`}
                >
                  <Piece
                    kind={unit.kind}
                    tone={unit.tone}
                    mono
                    shadow={false}
                    width={square * 0.96}
                    height={square * 1.344}
                    className={`study-board__piece study-board__piece--${unit.tone === "ivory" ? "light" : "dark"}`}
                  />
                </g>
              );
            }),
          )}

          {/* evaluation handle + coordinate labels */}
          <g className="study-board__coords" fill="#54625c" fontSize="10" fontFamily="var(--font-mono)">
            {FILES.map((file, index) => (
              <text key={file} x={pad + index * square + square / 2} y={size - 8} textAnchor="middle">
                {file}
              </text>
            ))}
            {Array.from({ length: 8 }, (_, index) => (
              <text key={index} x={12} y={pad + index * square + square / 2 + 3.5} textAnchor="middle">
                {8 - index}
              </text>
            ))}
          </g>
        </svg>

        <div className="study-board__floating" aria-hidden="true">
          <span className="study-board__eval">
            <span>
              <b>+0.42</b>
              <small>STOCKFISH 19</small>
            </span>
            <i className="study-board__eval-bar">
              <i style={{ height: "54%" }} />
            </i>
          </span>
          <span className="study-board__flash">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M8 2 9.6 6.4 14 8l-4.4 1.6L8 14 6.4 9.6 2 8l4.4-1.6L8 2Z" fill="currentColor" />
            </svg>
            Best move <b>Bd2</b>
          </span>
        </div>
      </div>

      <div className="study-board__foot">
        <span>WHITE TO MOVE</span>
        <span className="study-board__pgn">1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6 5. Nc3 Bg7 6. Be3 Nf6</span>
        <span className="study-board__move">MOVE 12</span>
      </div>
    </div>
  );
}
