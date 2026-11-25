import type { Metadata } from "next";
import Link from "next/link";
import { PieceArt, PieceDefs, type PieceKind } from "@/components/Pieces";

export const metadata: Metadata = {
  title: "Analysis & Game Review",
  description:
    "MultiPV Stockfish 19 analysis board and Win-Probability game review with 11-tier move classification, interactive EvalGraph, Highlights filter, Retry Mistake, and Premiere-style dockable panes.",
};

const EVAL_LEGEND = [
  {
    tag: "?!",
    tone: "inaccuracy",
    title: "Inaccuracy",
    copy: "A slight Win-Probability and Expected-Points slip across ChessLab's 11-tier classifier — worth noting without breaking momentum.",
    delta: "−0.4",
  },
  {
    tag: "?",
    tone: "mistake",
    title: "Mistake",
    copy: "A tactical or positional swing verified against Stockfish 19 principal variations, ready to practise with one-click Retry Mistake.",
    delta: "−1.2",
  },
  {
    tag: "??",
    tone: "blunder",
    title: "Blunder",
    copy: "The game-deciding turning point. ATHENA renders Red/Green coaching arrows, explains the verified concept, and shows the winning line.",
    delta: "−3.1",
  },
];

const PANELS = [
  {
    num: "01",
    title: "Inline Stockfish 19 tuning",
    copy: "Configure Search Depth, MultiPV lines, CPU threads, and Hash memory inline — or toggle Auto: Play vs Stockfish directly from the dock.",
    piece: "bishop" as const,
    material: "ivory" as const,
  },
  {
    num: "02",
    title: "Stockfish-verified diagnosis",
    copy: "A 4-stage 16-concept classifier validates every tactical motif against Stockfish principal variations — 100% pass rate on anti-false-positive traps.",
    piece: "queen" as const,
    material: "chrome" as const,
  },
  {
    num: "03",
    title: "Premiere-style 3-pane dock",
    copy: "Drag resizable splitters, swap board and evaluation columns, double-click to reset, and persist custom dock layouts locally across sessions.",
    piece: "rook" as const,
    material: "obsidian" as const,
  },
];

const SAMPLE_MOVES: Array<{ ply: number; white: string; black: string; mark?: "in" | "mis" | "bl"; note: string }> = [
  { ply: 10, white: "Be2", black: "O-O", note: "Book move — king tucked safely before central breaks." },
  { ply: 12, white: "Qd2", black: "a6", mark: "in", note: "Wait-and-see wing move eases central tension slightly." },
  { ply: 14, white: "Rad1", black: "b5", mark: "mis", note: "Loose c6 knight target — PV shows tactical pressure." },
  { ply: 16, white: "Rxe7+", black: "dxe4", mark: "bl", note: "Decisive turning point. Show Best plays Rxe7+ with tempo." },
];

const MARK_LABEL: Record<NonNullable<(typeof SAMPLE_MOVES)[number]["mark"]>, string> = {
  in: "?!",
  mis: "?",
  bl: "??",
};

function AnalysisBoard() {
  // a real-looking middlegame position, drawn with the vector set
  const board: Array<Array<{ kind: PieceKind; light: boolean } | null>> = [
    [null, null, { kind: "rook", light: false }, null, { kind: "king", light: false }, null, { kind: "rook", light: false }, null],
    [{ kind: "pawn", light: false }, { kind: "pawn", light: false }, null, { kind: "pawn", light: false }, null, { kind: "pawn", light: false }, { kind: "pawn", light: false }, { kind: "pawn", light: false }],
    [null, null, { kind: "knight", light: false }, null, { kind: "bishop", light: false }, null, null, null],
    [{ kind: "pawn", light: false }, null, { kind: "pawn", light: false }, null, null, { kind: "pawn", light: false }, null, { kind: "pawn", light: false }],
    [null, null, null, { kind: "pawn", light: true }, null, null, { kind: "bishop", light: true }, null],
    [null, null, { kind: "bishop", light: true }, null, { kind: "pawn", light: true }, null, { kind: "pawn", light: true }, null],
    [{ kind: "pawn", light: true }, { kind: "pawn", light: true }, null, { kind: "queen", light: true }, null, { kind: "pawn", light: true }, null, { kind: "pawn", light: true }],
    [null, null, { kind: "rook", light: true }, { kind: "pawn", light: true }, { kind: "king", light: true }, { kind: "knight", light: true }, { kind: "rook", light: true }, null],
  ];

  return (
    <div className="aboard" aria-label="Analysis and review board mock-up">
      <div className="aboard__top">
        <span className="aboard__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>review — sicilian najdorf</span>
        <span className="aboard__live">
          <i /> MultiPV 2 · SF19
        </span>
      </div>

      <div className="aboard__grid">
        {board.map((rank, rankIndex) =>
          rank.map((square, fileIndex) => {
            const dark = (rankIndex + fileIndex) % 2 === 1;
            const file = "abcdefgh"[fileIndex];
            const rankLabel = 8 - rankIndex;
            const lastMove = (file === "e" && rankLabel === 4) || (file === "d" && rankLabel === 5);
            const bestMove = file === "g" && rankLabel === 5;
            return (
              <div
                className={`aboard__sq${dark ? " is-dark" : ""}${lastMove ? " is-last" : ""}${bestMove ? " is-best" : ""}`}
                key={`${file}${rankLabel}`}
              >
                {fileIndex === 0 ? <span className="aboard__rank">{rankLabel}</span> : null}
                {rankIndex === 7 ? <span className="aboard__file">{file}</span> : null}
                {square ? (
                  <span className={`aboard__piece aboard__piece--${square.light ? "light" : "dark"}`}>
                    <PieceArt kind={square.kind} material={square.light ? "ivory" : "obsidian"} />
                  </span>
                ) : null}
              </div>
            );
          }),
        )}
      </div>

      <div className="aboard__bottom">
        <span className="aboard__eval">
          <b>+0.42</b> Stockfish 19
        </span>
        <span className="aboard__bar" aria-hidden="true">
          <i style={{ width: "56%" }} />
        </span>
        <span className="aboard__best">
          Best <b>Rxe7+</b>
        </span>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <div className="page analysis-page">
      <PieceDefs />

      <section className="analysis-hero">
        <div className="analysis-hero__copy">
          <p className="eyebrow">
            <span className="eyebrow__num">(</span> Analysis & Game Review{" "}
            <span className="eyebrow__num">)</span>
          </p>
          <h1 className="display-xl">
            Stockfish 19
            <br />
            <span className="serif analysis-hero__accent">precision</span>
          </h1>
          <p className="analysis-hero__lede">
            MultiPV Stockfish 19 search, Win-Probability accuracy, and PV-verified concept
            diagnoses — including How to Improve debriefs even in games you won.
          </p>
          <div className="analysis-hero__actions">
            <Link className="btn-pill btn-pill--light" href="/download">
              See release status
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3.5 10h12M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link className="btn-pill btn-pill--outline" href="/athena">
              Meet ATHENA
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 16 16 4M6.5 4H16v9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="analysis-hero__board">
          <AnalysisBoard />
        </div>
      </section>

      {/* legend of annotations */}
      <section className="section section--tight">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__num">01</span> Review tiers
              </p>
              <h2 className="display-md">
                Eleven tiers,
                <br />
                <span className="serif">honest accuracy.</span>
              </h2>
            </div>
            <p className="section-head__lede">
              Evaluated with ChessLab&apos;s Win-Probability and Expected-Points engine pass across
              every phase — alongside Brilliant, Great, Best, Good, and Book moves.
            </p>
          </div>

          <div className="legend">
            {EVAL_LEGEND.map((item) => (
              <article className={`legend__card legend__card--${item.tone}`} key={item.tag}>
                <span className="legend__tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <span className="legend__delta">{item.delta} eval swing</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* move list */}
      <section className="section moves-band">
        <div className="wrap">
          <div className="moves">
            <div className="moves__copy">
              <p className="eyebrow">
                <span className="eyebrow__num">02</span> Interactive move list
              </p>
              <h2 className="display-md">
                Filter moments,
                <br />
                <span className="serif">retry mistakes.</span>
              </h2>
              <p>
                Scrub the interactive EvalGraph, toggle Highlights to step strictly through
                critical turning points, or hit Retry Mistake and Show Best with ATHENA coaching
                bubbles attached to every key ply.
              </p>
              <Link className="link-quiet" href="/athena">
                Explore ATHENA Coach
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M4 16 16 4M6.5 4H16v9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <div className="moves__table" role="table" aria-label="Sample move list with engine notes">
              <div className="moves__row moves__row--head" role="row">
                <span role="columnheader">Ply</span>
                <span role="columnheader">White</span>
                <span role="columnheader">Black</span>
                <span role="columnheader">Engine note</span>
              </div>
              {SAMPLE_MOVES.map((row) => (
                <div className="moves__row" role="row" key={row.ply}>
                  <span role="cell" className="moves__ply">
                    {row.ply}
                  </span>
                  <span role="cell" className="moves__san">
                    {row.white}
                  </span>
                  <span role="cell" className="moves__san">
                    {row.black}
                    {row.mark ? (
                      <em className={`moves__mark moves__mark--${row.mark}`}>
                        {MARK_LABEL[row.mark]}
                      </em>
                    ) : null}
                  </span>
                  <span role="cell" className="moves__note">
                    {row.note}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* panels */}
      <section className="section">
        <div className="wrap">
          <div className="panels">
            {PANELS.map((panel) => (
              <article className="panel" key={panel.num}>
                <span className="panel__num">{panel.num}</span>
                <div className="panel__art" aria-hidden="true">
                  <PieceArt kind={panel.piece} material="water" />
                </div>
                <h3>{panel.title}</h3>
                <p>{panel.copy}</p>
              </article>
            ))}
          </div>

          <div className="analysis-cta">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__num">03</span> Offline review
              </p>
              <h2 className="display-sm">Import a PGN or sync recent Chess.com games — 100% locally.</h2>
            </div>
            <Link className="btn-pill btn-pill--ember" href="/download">
              Check download status
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3.5 10h12M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
