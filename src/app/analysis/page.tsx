import type { Metadata } from "next";
import Link from "next/link";
import { PieceArt, PieceDefs, type PieceKind } from "@/components/Pieces";

export const metadata: Metadata = {
  title: "Analysis",
  description:
    "Engine lines, evaluation, and phase-by-phase review. See why a move matters, not just that it does — with Stockfish 19 running locally.",
};

const EVAL_LEGEND = [
  {
    tag: "?!",
    tone: "inaccuracy",
    title: "Inaccuracy",
    copy: "The position slips, but the thread is still there. Worth a note rather than a rewrite.",
    delta: "−0.4",
  },
  {
    tag: "?",
    tone: "mistake",
    title: "Mistake",
    copy: "A concrete opportunity changes hands — usually a tactic that was one move away.",
    delta: "−1.2",
  },
  {
    tag: "??",
    tone: "blunder",
    title: "Blunder",
    copy: "The game turns. ChessLab marks the exact move, the alternative, and the follow-up.",
    delta: "−3.1",
  },
];

const PANELS = [
  {
    num: "01",
    title: "Evaluation, honestly",
    copy: "A single bar, a numeric score, and the depth it was reached at — no invented accuracy percentages you cannot audit.",
    piece: "bishop" as const,
    material: "ivory" as const,
  },
  {
    num: "02",
    title: "Lines you can walk",
    copy: "Step through the engine's principal variation move by move, and branch off whenever your idea differs.",
    piece: "queen" as const,
    material: "chrome" as const,
  },
  {
    num: "03",
    title: "Phases, not walls of text",
    copy: "Opening, middlegame and endgame get separate notes, so the lesson arrives in the order a game does.",
    piece: "rook" as const,
    material: "obsidian" as const,
  },
];

const SAMPLE_MOVES: Array<{ ply: number; white: string; black: string; mark?: "in" | "mis" | "bl"; note: string }> = [
  { ply: 10, white: "Be2", black: "O-O", note: "Castled, and the kingside stays intact." },
  { ply: 12, white: "Qd2", black: "a6", mark: "in", note: "a6 is fine, but it concedes the centre for tempo." },
  { ply: 14, white: "Rad1", black: "b5", mark: "mis", note: "The pawn push leaves c6 undefended." },
  { ply: 16, white: "Ncxe4", black: "dxe4", mark: "bl", note: "Recapture drops the exchange — Bd3 first was needed." },
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
    <div className="aboard" aria-label="Analysis board mock-up">
      <div className="aboard__top">
        <span className="aboard__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>analysis — game 214</span>
        <span className="aboard__live">
          <i /> depth 34
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
          Best <b>Bd3</b>
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
            <span className="eyebrow__num">(</span> Analysis{" "}
            <span className="eyebrow__num">)</span>
          </p>
          <h1 className="display-xl">
            Read the
            <br />
            <span className="serif analysis-hero__accent">whole</span> position
          </h1>
          <p className="analysis-hero__lede">
            Stockfish tells you what it likes. ChessLab is built to show you why — move by
            move, phase by phase, on your own hardware.
          </p>
          <div className="analysis-hero__actions">
            <Link className="btn-pill btn-pill--light" href="/download">
              Try it on a game
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3.5 10h12M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link className="btn-pill btn-pill--outline" href="/studio">
              How the studio works
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
                <span className="eyebrow__num">01</span> Annotations
              </p>
              <h2 className="display-md">
                Three degrees
                <br />
                <span className="serif">of wrong.</span>
              </h2>
            </div>
            <p className="section-head__lede">
              ChessLab names the size of a mistake instead of flattening everything into one
              accuracy score.
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
                <span className="eyebrow__num">02</span> The move list
              </p>
              <h2 className="display-md">
                Every turn,
                <br />
                <span className="serif">accounted for.</span>
              </h2>
              <p>
                Click any move to restore the board. The engine note stays attached to the
                moment it belongs to, so a review reads like a game, not a spreadsheet.
              </p>
              <Link className="link-quiet" href="/tournaments">
                See how tournaments are scored
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
                <span className="eyebrow__num">03</span> Next
              </p>
              <h2 className="display-sm">Run it on one of your own games.</h2>
            </div>
            <Link className="btn-pill btn-pill--ember" href="/download">
              Download ChessLab
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
