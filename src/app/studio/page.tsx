import type { Metadata } from "next";
import Link from "next/link";
import { PieceArt, PieceDefs, type PieceKind } from "@/components/Pieces";

export const metadata: Metadata = {
  title: "The workstation",
  description:
    "Inside the ChessLab desktop shell: Tauri v2 + Rust + SQLite storage, Premiere-style docking, Stockfish 19, 3,865 ECO opening lines, SM-2 puzzles, and local Player Profiles.",
};

const PILLARS = [
  {
    num: "01",
    title: "Offline-first SQLite",
    copy: "Local database with automatic corruption quarantine, transactional coaching memory, and immutable local Player Profiles.",
    piece: "rook" as const,
    material: "obsidian" as const,
  },
  {
    num: "02",
    title: "Premiere-style docking",
    copy: "Resizable splitters, drag-and-drop panel swapping, and persistent layouts across Analysis and Game Review on an AMOLED Black shell.",
    piece: "bishop" as const,
    material: "ivory" as const,
  },
  {
    num: "03",
    title: "Openings & puzzles",
    copy: "3,865 CC0 ECO lines, transposition-aware repertoire training, Practice Line deviation flags, and SM-2 puzzles extracted from your mistakes.",
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
    title: "The dockable board",
    meta: "Anatomy 01",
    copy: "ResizeObserver-fitted chessground board with Red/Green/Blue/Yellow coaching arrows, inline Stockfish 19 configuration, and Auto: Play vs Stockfish.",
    piece: "knight",
    material: "obsidian",
  },
  {
    title: "Opening Studio & drills",
    meta: "Anatomy 02",
    copy: "23 structured opening blueprints, step-back guided theory, Spar From Position handoff into ATHENA, and forgetting-curve drill scheduling.",
    piece: "pawn",
    material: "ivory",
  },
  {
    title: "Local Game Database",
    meta: "Anatomy 03",
    copy: "High-speed PGN import, instant opening and player filters, plus optional quiet background sync of your recent Chess.com monthly archives.",
    piece: "bishop",
    material: "chrome",
  },
];

const FLOW = [
  { step: "01", label: "Import or Sync", copy: "Drop in PGNs or quietly sync your recent Chess.com archives into local SQLite." },
  { step: "02", label: "Review & Diagnose", copy: "Stockfish 19 and ATHENA score every phase, classify moves, and verify recurring concepts." },
  { step: "03", label: "Spar & Drill", copy: "Practise weak concepts in Guided Sparring with pause-on-blunder coaching and SM-2 drills." },
  { step: "04", label: "Retain in Games", copy: "Advance across 4-tier anti-gaming mastery until patterns hold in unseen real games." },
];

export default function StudioPage() {
  return (
    <div className="page studio-page">
      <PieceDefs />

      {/* split editorial hero: light column + dark stage */}
      <section className="studio-hero">
        <div className="studio-hero__copy">
          <p className="eyebrow eyebrow--ink">
            <span className="eyebrow__num">(</span> The workstation{" "}
            <span className="eyebrow__num">)</span>
          </p>
          <h1 className="display-lg">
            A desktop workstation
            <br />
            built in <span className="serif">Rust.</span>
          </h1>
          <p className="studio-hero__lede">
            An AMOLED Black full-bleed workspace combining a 4-panel tool launcher, dockable
            Stockfish 19 boards, Opening Studio, SM-2 mistake puzzles, and ATHENA — 100% local on
            your machine.
          </p>
          <div className="studio-hero__actions">
            <Link className="btn-pill btn-pill--ink" href="/download">
              Download status
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3.5 10h12M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link className="link-quiet" href="/analysis">
              Inspect Analysis & Review
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 16 16 4M6.5 4H16v9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <dl className="studio-hero__facts">
            <div>
              <dt>Runtime</dt>
              <dd>Tauri v2 · Rust</dd>
            </div>
            <div>
              <dt>Engine</dt>
              <dd>Stockfish 19 + Burn</dd>
            </div>
            <div>
              <dt>Footprint</dt>
              <dd>~103 MB Peak RAM</dd>
            </div>
          </dl>
        </div>

        <div className="studio-hero__stage">
          <span className="studio-hero__label" aria-hidden="true">
            desktop · tauri v2
          </span>
          <div className="studio-hero__piece studio-hero__piece--tall">
            <PieceArt kind="king" material="water" glow label="3D chess king" />
          </div>
          <div className="studio-hero__piece studio-hero__piece--small">
            <PieceArt kind="pawn" material="water" />
          </div>
          <span className="studio-hero__caption" aria-hidden="true">
            <b>ATHENA · Local SQLite</b>
            <small>0 cloud calls · offline</small>
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
                Local storage,
                <br />
                <span className="serif">zero compromise.</span>
              </h2>
            </div>
            <p className="section-head__lede">
              Every module in ChessLab runs inside the desktop shell without accounts, telemetry,
              or network round trips.
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
                From raw game
                <br />
                <span className="serif">to retained skill.</span>
              </h2>
            </div>
            <p className="section-head__lede">
              ChessLab connects game review, concept verification, sparring, and delayed real-game
              retention inside one continuous feedback loop.
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
              <h2 className="display-sm">Built for Windows, macOS, and Linux — zero telemetry.</h2>
              <p>Stockfish 19, SQLite, and ATHENA neural weights packaged in one desktop app.</p>
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
