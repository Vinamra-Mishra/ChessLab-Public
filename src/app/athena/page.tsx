import type { Metadata } from "next";
import Link from "next/link";
import { PieceArt, PieceDefs, type PieceMaterial } from "@/components/Pieces";

export const metadata: Metadata = {
  title: "ATHENA AI Coach",
  description:
    "ATHENA — Adaptive Tactical & Human-Emulating Neural Advisor. Maia-3 + ChessMimic human sparring, XGBoost v2 move risk, 16-concept Stockfish-verified diagnosis, and 4-tier anti-gaming mastery running 100% locally in Rust.",
};

const MODELS = [
  {
    num: "01",
    name: "Human Policy Fusion",
    copy: "Combines Maia-3 5M and 7 ChessMimic rating bands via Log-Linear Fusion to mirror human thinking across 1000 to 3500 Elo.",
    metric: "1000–3500 Elo",
    tag: "Burn Flex CPU",
  },
  {
    num: "02",
    name: "Personal Move Risk",
    copy: "A 40-feature XGBoost v2 classifier trained to anticipate your personal blunder risk before a costly tactical oversight lands.",
    metric: "< 0.01ms CPU",
    tag: "40 features",
  },
  {
    num: "03",
    name: "Concept Diagnosis",
    copy: "4-stage 16-concept classification validated directly against Stockfish 19 principal variations with 100% trap pass rate.",
    metric: "PV-Verified",
    tag: "Tax-v1 · 16 motifs",
  },
  {
    num: "04",
    name: "Adaptive Curriculum",
    copy: "Additive Factors and BKT-AFM decay schedules rank weak patterns into spaced drills gated by 24h+ real-game retention.",
    metric: "24h+ Retained",
    tag: "Anti-gaming",
  },
];

const COMPETENCIES = [
  { rank: 1, name: "Tactical Vision", stage: "Retained in Games", score: "86%", tier: "Tier 4", move: "+6", hot: true },
  { rank: 2, name: "King Safety", stage: "Applied Unseen", score: "81%", tier: "Tier 3", move: "+4" },
  { rank: 3, name: "Piece Activity", stage: "Applied Unseen", score: "77%", tier: "Tier 3", move: "+3" },
  { rank: 4, name: "Pawn Structure", stage: "Solved in Drill", score: "69%", tier: "Tier 2", move: "+1" },
  { rank: 5, name: "Endgame Craft", stage: "Pattern Seen", score: "62%", tier: "Tier 1", move: "0" },
  { rank: 6, name: "Calculation Depth", stage: "Due for Review", score: "58%", tier: "Tier 1", move: "−2" },
];

const WORKFLOWS = [
  { num: "01", tab: "Insights", detail: "Focus Areas & Risk", badge: "PV-Verified", live: true },
  { num: "02", tab: "Guided Spar", detail: "2-Stage Hint & Debrief", badge: "Pause Mode", live: true },
  { num: "03", tab: "Openings", detail: "3,865 ECO & Blueprints", badge: "Practice Line" },
  { num: "04", tab: "Drills & Memory", detail: "Committed SQLite Ledger", badge: "SM-2 Schedule" },
];

const ROLES: Array<{
  title: string;
  copy: string;
  piece: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
  material: PieceMaterial;
}> = [
  {
    title: "Guided Sparring",
    copy: "Pauses before replying on blunders, draws Red/Green coaching arrows, surfaces book theory, and generates post-game debriefs even when you win.",
    piece: "rook",
    material: "obsidian",
  },
  {
    title: "Structured Diagnostics",
    copy: "One-click Check Threat, Position Plan, Why Last Move?, and Pattern History buttons deliver deterministic answers with zero chatbot clutter.",
    piece: "bishop",
    material: "ivory",
  },
  {
    title: "Anti-Gaming Mastery",
    copy: "Grinding one solved puzzle never fakes skill. Competencies only reach Tier 4 once applied in unseen positions and retained in real games.",
    piece: "knight",
    material: "chrome",
  },
];

export default function AthenaPage() {
  return (
    <div className="page tournaments-page">
      <PieceDefs />

      <section className="tour-hero">
        <div className="wrap">
          <div className="tour-hero__top">
            <p className="eyebrow">
              <span className="eyebrow__num">(</span> ATHENA · Local Neural Coach{" "}
              <span className="eyebrow__num">)</span>
            </p>
            <span className="chip">
              <i /> Pure Rust · 29ms p95 CPU
            </span>
          </div>

          <h1 className="display-xl tour-hero__title">
            Human-like
            <br />
            <span className="tour-hero__row">
              <span className="stroke-type">coaching</span>
              <span className="tour-hero__art" aria-hidden="true">
                <PieceArt kind="rook" material="water" glow />
              </span>
            </span>
          </h1>

          <div className="tour-hero__foot">
            <p>
              Adaptive Tactical &amp; Human-Emulating Neural Advisor. Maia-3 + ChessMimic sparring,
              personal blunder-risk prediction, and 4-tier mastery — 100% offline with zero LLMs.
            </p>
            <div className="tour-hero__actions">
              <Link className="btn-pill btn-pill--light" href="/download">
                Download ChessLab
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M3.5 10h12M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link className="btn-pill btn-pill--outline" href="/analysis">
                See Analysis &amp; Review
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M4 16 16 4M6.5 4H16v9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* competency profile + ATHENA workstation modules */}
      <section className="section section--tight">
        <div className="wrap">
          <div className="boardset">
            <div className="standings">
              <div className="standings__head">
                <h2 className="display-sm">Skill &amp; Mastery</h2>
                <span className="mono-tag">8-competency ladder</span>
              </div>
              <div className="standings__row standings__row--head">
                <span>#</span>
                <span>Competency</span>
                <span>Skill</span>
                <span>Stage</span>
              </div>
              {COMPETENCIES.map((row) => (
                <div className={`standings__row${row.hot ? " is-hot" : ""}`} key={row.rank}>
                  <span className="standings__rank">{String(row.rank).padStart(2, "0")}</span>
                  <span className="standings__player">
                    <b>{row.name}</b>
                    <small>{row.stage}</small>
                  </span>
                  <span className="standings__pts">{row.score}</span>
                  <span className="standings__tb">
                    {row.tier}
                    <em data-trend={row.move.startsWith("+") ? "up" : row.move === "0" ? "flat" : "down"}>
                      {row.move}
                    </em>
                  </span>
                </div>
              ))}
            </div>

            <div className="pairings">
              <div className="standings__head">
                <h2 className="display-sm">ATHENA Workstation</h2>
                <span className="mono-tag">
                  <i className="live-dot" /> 100% Offline
                </span>
              </div>
              {WORKFLOWS.map((wf) => (
                <div className="pairing" key={wf.num}>
                  <span className="pairing__board">{wf.num}</span>
                  <span className="pairing__side">{wf.tab}</span>
                  <span className={`pairing__result${wf.live ? " is-live" : ""}`}>
                    {wf.badge}
                  </span>
                  <span className="pairing__side pairing__side--black">{wf.detail}</span>
                </div>
              ))}
              <div className="pairings__rounds" aria-label="Six ATHENA workstation tabs">
                {Array.from({ length: 6 }).map((_, index) => (
                  <span
                    className={`pairings__round${index === 1 ? " is-current" : ""}${index < 1 ? " is-done" : ""}`}
                    key={index}
                  >
                    {index + 1}
                  </span>
                ))}
              </div>

              <p className="pairings__note">
                Six focused tabs — Insights, Spar, Openings, Drills, Progress, and Memory — backed by
                transactional SQLite isolation and zero chatbot drawers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* architecture */}
      <section className="section">
        <div className="wrap">
          <header className="section-head">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__num">01</span> Architecture
              </p>
              <h2 className="display-md">
                Four models,
                <br />
                <span className="serif">one CPU runtime.</span>
              </h2>
            </div>
            <p className="section-head__lede">
              Built on pure-Rust Burn Flex 0.22.1 with zero cloud calls, strict Stockfish 19 parity
              gates, and ~103 MB peak resident memory.
            </p>
          </header>

          <div className="formats">
            {MODELS.map((model) => (
              <article className="format" key={model.num}>
                <div className="format__top">
                  <span className="format__num">{model.num}</span>
                  <span className="format__tag">{model.tag}</span>
                </div>
                <h3 className="display-sm">{model.name}</h3>
                <p>{model.copy}</p>
                <span className="format__rounds">{model.metric}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* workflows with pieces */}
      <section className="section roles-band">
        <div className="wrap">
          <div className="roles">
            {ROLES.map((role) => (
              <article className="role" key={role.title}>
                <div className="role__art" aria-hidden="true">
                  <PieceArt kind={role.piece} material="water" />
                </div>
                <h3 className="display-sm">{role.title}</h3>
                <p>{role.copy}</p>
              </article>
            ))}
          </div>

          <div className="tour-cta">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__num">02</span> Local intelligence
              </p>
              <h2 className="display-md">
                A neural chess coach
                <br />
                <span className="serif">that runs on your CPU.</span>
              </h2>
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
