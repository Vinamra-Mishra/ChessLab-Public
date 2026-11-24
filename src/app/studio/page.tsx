import type { Metadata } from "next";
import Link from "next/link";
import { PieceArt, PieceDefs, type PieceKind } from "@/components/Pieces";

export const metadata: Metadata = {
  title: "The studio",
  description:
    "ChessLab is a desktop chess studio: local games, an offline Stockfish engine, and study tools arranged around how chess is actually learned.",
};

const PILLARS = [
  {
    num: "01",
    title: "Local by default",
    copy: "The app ships with its own database. Import a PGN and it stays in a file you can back up, copy, or delete.",
    piece: "rook" as const,
    material: "obsidian" as const,
  },
  {
    num: "02",
    title: "Engine on tap",
    copy: "Stockfish 19 is bundled and runs on your CPU, so depth never depends on a connection.",
    piece: "bishop" as const,
    material: "ivory" as const,
  },
  {
    num: "03",
    title: "A calm interface",
    copy: "No dashboards begging for attention. One board, one panel, and the tools you actually use.",
    piece: "queen" as const,
    material: "chrome" as const,
  },
];

const SURFACES: Array<{
  title: string;
  meta: string;
  copy: string;
  piece: PieceKind;
  material: "obsidian" | "ivory" | "chrome" | "ember";
}> = [
  {
    title: "The board",
    meta: "Anatomy 01",
    copy: "A draggable board that keeps coordinate labels honest, highlights the last move, and never hides the piece you are moving behind an overlay.",
    piece: "knight",
    material: "obsidian",
  },
  {
    title: "The panel",
    meta: "Anatomy 02",
    copy: "Evaluation, move list, and notes share a single column. Jump to any move to see the position exactly as it was played.",
    piece: "pawn",
    material: "ivory",
  },
  {
    title: "The library",
    meta: "Anatomy 03",
    copy: "Games grouped by opening, result, and accuracy. Filter without waiting for a network round trip.",
    piece: "bishop",
    material: "chrome",
  },
];

const FLOW = [
  { step: "01", label: "Import", copy: "Drop in a PGN or play directly in the studio." },
  { step: "02", label: "Review", copy: "The engine walks each phase and marks turning points." },
  { step: "03", label: "Practise", copy: "Turn the lesson into repertoire lines and drills." },
  { step: "04", label: "Return", copy: "Come back with the pattern recognised, not memorised." },
];

export default function StudioPage() {
  return (
    <div className="page studio-page">
      <PieceDefs />

      {/* split editorial hero: light column + dark stage */}
      <section className="studio-hero">
        <div className="studio-hero__copy">
          <p className="eyebrow eyebrow--ink">
            <span className="eyebrow__num">(</span> The studio{" "}
            <span className="eyebrow__num">)</span>
          </p>
          <h1 className="display-lg">
            A desk, an engine
            <br />
            and <span className="serif">your games.</span>
          </h1>
          <p className="studio-hero__lede">
            ChessLab is not a club, a stream, or a ladder. It is a quiet piece of software for
            the hours you spend actually getting better.
          </p>
          <div className="studio-hero__actions">
            <Link className="btn-pill btn-pill--ink" href="/download">
              Get the beta
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3.5 10h12M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link className="link-quiet" href="/analysis">
              See the analysis view
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 16 16 4M6.5 4H16v9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <dl className="studio-hero__facts">
            <div>
              <dt>Storage</dt>
              <dd>Local SQLite</dd>
            </div>
            <div>
              <dt>Engine</dt>
              <dd>Stockfish 19</dd>
            </div>
            <div>
              <dt>Platforms</dt>
              <dd>Win · macOS · Linux</dd>
            </div>
          </dl>
        </div>

        <div className="studio-hero__stage">
          <span className="studio-hero__label" aria-hidden="true">
            studio · workspace
          </span>
          <div className="studio-hero__piece studio-hero__piece--tall">
            <PieceArt kind="king" material="water" glow label="3D chess king" />
          </div>
          <div className="studio-hero__piece studio-hero__piece--small">
            <PieceArt kind="pawn" material="water" />
          </div>
          <span className="studio-hero__caption" aria-hidden="true">
            <b>Untitled session</b>
            <small>12 moves · local</small>
          </span>
        </div>
      </section>

      {/* pillars: three-column hairline grid */}
      <section className="section">
        <div className="wrap">
          <header className="section-head">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__num">01</span> What it is
              </p>
              <h2 className="display-md">
                Three principles,
                <br />
                <span className="serif">no compromises.</span>
              </h2>
            </div>
            <p className="section-head__lede">
              Every part of the studio answers to the same constraint: it has to work with the
              network cable unplugged.
            </p>
          </header>

          <div className="pillars">
            {PILLARS.map((pillar) => (
              <article className="pillar" key={pillar.num}>
                <span className="pillar__num">{pillar.num}</span>
                <div className="pillar__art">
                  <PieceArt kind={pillar.piece} material="water" />
                </div>
                <h3 className="display-sm">{pillar.title}</h3>
                <p>{pillar.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* anatomy list: alternating rows */}
      <section className="section section--tight anatomy">
        <div className="wrap">
          <p className="eyebrow">
            <span className="eyebrow__num">02</span> Anatomy
          </p>
          <div className="anatomy__list">
            {SURFACES.map((surface, index) => (
              <article
                className="anatomy__row"
                data-flip={index % 2 === 1}
                key={surface.title}
              >
                <div className="anatomy__art">
                  <span className="anatomy__index" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <PieceArt kind={surface.piece} material="water" />
                </div>
                <div className="anatomy__body">
                  <span className="anatomy__meta">{surface.meta}</span>
                  <h3 className="display-md">{surface.title}</h3>
                  <p>{surface.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* flow: four steps on a hairline rail */}
      <section className="section flow-band">
        <div className="wrap">
          <header className="section-head">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__num">03</span> How it works
              </p>
              <h2 className="display-md">
                A loop, not
                <br />
                <span className="serif">a ladder.</span>
              </h2>
            </div>
            <p className="section-head__lede">
              The studio is organised around one repeated cycle. Nothing to maintain, nothing
              to keep up with.
            </p>
          </header>

          <ol className="flow">
            {FLOW.map((item) => (
              <li className="flow__step" key={item.step}>
                <span className="flow__dot" aria-hidden="true" />
                <span className="flow__num">{item.step}</span>
                <h3>{item.label}</h3>
                <p>{item.copy}</p>
              </li>
            ))}
          </ol>

          <div className="studio-cta">
            <div>
              <h2 className="display-sm">Bring your last ten losses.</h2>
              <p>That is usually enough to find the pattern.</p>
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
