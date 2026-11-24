import type { Metadata } from "next";
import Link from "next/link";
import { PieceArt, PieceDefs, type PieceMaterial } from "@/components/Pieces";

export const metadata: Metadata = {
  title: "Tournaments",
  description:
    "Local and club tournament brackets with real pairings, results and standings — exportable, offline, and always yours.",
};

const FORMATS = [
  {
    num: "01",
    name: "Swiss",
    copy: "Pair by score, avoid rematches, and publish standings after every round. Handles seven to seventy players.",
    rounds: "5–9 rounds",
    tag: "Most used",
  },
  {
    num: "02",
    name: "Round robin",
    copy: "Every player meets every other. ChessLab builds the schedule and colour balance for you.",
    rounds: "Full cycle",
    tag: "Clubs",
  },
  {
    num: "03",
    name: "Knockout",
    copy: "Single or double elimination with byes, seeds, and a live bracket view for the room.",
    rounds: "Bracket",
    tag: "Blitz nights",
  },
  {
    num: "04",
    name: "Arena",
    copy: "Open-entry, join anytime. Pairings refresh as games finish, so nobody waits long.",
    rounds: "Continuous",
    tag: "Online-ready",
  },
];

const STANDINGS = [
  { rank: 1, name: "A. Moreau", club: "Paris", pts: "6.5", tb: "31.0", move: "+5", hot: true },
  { rank: 2, name: "V. Mishra", club: "Amaravati", pts: "6.0", tb: "29.5", move: "+3" },
  { rank: 3, name: "J. Okafor", club: "Lagos", pts: "5.5", tb: "28.0", move: "+2" },
  { rank: 4, name: "S. Tanaka", club: "Osaka", pts: "5.5", tb: "27.5", move: "0" },
  { rank: 5, name: "L. Novak", club: "Prague", pts: "5.0", tb: "26.0", move: "−1" },
  { rank: 6, name: "R. Haugen", club: "Bergen", pts: "4.5", tb: "25.5", move: "−2" },
];

const PAIRINGS = [
  { board: "1", white: "A. Moreau", black: "V. Mishra", result: "1–0", live: true },
  { board: "2", white: "J. Okafor", black: "S. Tanaka", result: "Draw" },
  { board: "3", white: "L. Novak", black: "R. Haugen", result: "1–0" },
  { board: "4", white: "M. Adeyemi", black: "K. Fischer", result: "In progress", live: true },
];

const ROLES: Array<{
  title: string;
  copy: string;
  piece: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
  material: PieceMaterial;
}> = [
  {
    title: "Organisers",
    copy: "Brackets, pairings and standings without a spreadsheet. Export the final table as PDF or CSV.",
    piece: "rook",
    material: "obsidian",
  },
  {
    title: "Arbiters",
    copy: "Colour balance, byes, and defaults are handled. Change any pairing and the rest revalidates.",
    piece: "bishop",
    material: "ivory",
  },
  {
    title: "Players",
    copy: "One screen for the round: your board, the clock, and the standings you actually care about.",
    piece: "knight",
    material: "chrome",
  },
];

export default function TournamentsPage() {
  return (
    <div className="page tournaments-page">
      <PieceDefs />

      <section className="tour-hero">
        <div className="wrap">
          <div className="tour-hero__top">
            <p className="eyebrow">
              <span className="eyebrow__num">(</span> Tournaments{" "}
              <span className="eyebrow__num">)</span>
            </p>
            <span className="chip">
              <i /> Season 01 · 12 events
            </span>
          </div>

          <h1 className="display-xl tour-hero__title">
            Competitive
            <br />
            <span className="tour-hero__row">
              <span className="stroke-type">rankings</span>
              <span className="tour-hero__art" aria-hidden="true">
                <PieceArt kind="rook" material="ivory" glow />
              </span>
            </span>
          </h1>

          <div className="tour-hero__foot">
            <p>
              Swiss, round robin, knockout and arena events — run from your laptop, with
              pairings and standings that never leave the room.
            </p>
            <div className="tour-hero__actions">
              <Link className="btn-pill btn-pill--light" href="/download">
                Host an event
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M3.5 10h12M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link className="btn-pill btn-pill--outline" href="/analysis">
                Review the games
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M4 16 16 4M6.5 4H16v9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* standings + pairings board */}
      <section className="section section--tight">
        <div className="wrap">
          <div className="boardset">
            <div className="standings">
              <div className="standings__head">
                <h2 className="display-sm">Standings</h2>
                <span className="mono-tag">Round 6 of 7</span>
              </div>
              <div className="standings__row standings__row--head">
                <span>#</span>
                <span>Player</span>
                <span>Pts</span>
                <span>TB</span>
              </div>
              {STANDINGS.map((row) => (
                <div className={`standings__row${row.hot ? " is-hot" : ""}`} key={row.rank}>
                  <span className="standings__rank">{String(row.rank).padStart(2, "0")}</span>
                  <span className="standings__player">
                    <b>{row.name}</b>
                    <small>{row.club}</small>
                  </span>
                  <span className="standings__pts">{row.pts}</span>
                  <span className="standings__tb">
                    {row.tb}
                    <em data-trend={row.move.startsWith("+") ? "up" : row.move === "0" ? "flat" : "down"}>
                      {row.move}
                    </em>
                  </span>
                </div>
              ))}
            </div>

            <div className="pairings">
              <div className="standings__head">
                <h2 className="display-sm">Pairings</h2>
                <span className="mono-tag">
                  <i className="live-dot" /> Live round
                </span>
              </div>
              {PAIRINGS.map((pairing) => (
                <div className="pairing" key={pairing.board}>
                  <span className="pairing__board">{pairing.board}</span>
                  <span className="pairing__side">
                    <i className="swatch swatch--light" /> {pairing.white}
                  </span>
                  <span className={`pairing__result${pairing.live ? " is-live" : ""}`}>
                    {pairing.result}
                  </span>
                  <span className="pairing__side pairing__side--black">
                    <i className="swatch swatch--dark" /> {pairing.black}
                  </span>
                </div>
              ))}
              <div className="pairings__rounds" aria-label="Round progress">
                {Array.from({ length: 7 }).map((_, index) => (
                  <span
                    className={`pairings__round${index === 5 ? " is-current" : ""}${index < 5 ? " is-done" : ""}`}
                    key={index}
                  >
                    {index + 1}
                  </span>
                ))}
              </div>

              <p className="pairings__note">
                Colour balance, byes and defaults are validated as you edit. Nothing is sent to
                a server.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* formats */}
      <section className="section">
        <div className="wrap">
          <header className="section-head">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__num">01</span> Formats
              </p>
              <h2 className="display-md">
                Four ways
                <br />
                <span className="serif">to run a room.</span>
              </h2>
            </div>
            <p className="section-head__lede">
              Pick a format, set the rounds, and ChessLab handles pairings, colours and
              tie-breaks while you watch the games.
            </p>
          </header>

          <div className="formats">
            {FORMATS.map((format) => (
              <article className="format" key={format.num}>
                <div className="format__top">
                  <span className="format__num">{format.num}</span>
                  <span className="format__tag">{format.tag}</span>
                </div>
                <h3 className="display-sm">{format.name}</h3>
                <p>{format.copy}</p>
                <span className="format__rounds">{format.rounds}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* roles with pieces */}
      <section className="section roles-band">
        <div className="wrap">
          <div className="roles">
            {ROLES.map((role) => (
              <article className="role" key={role.title}>
                <div className="role__art" aria-hidden="true">
                  <PieceArt kind={role.piece} material={role.material} />
                </div>
                <h3 className="display-sm">{role.title}</h3>
                <p>{role.copy}</p>
              </article>
            ))}
          </div>

          <div className="tour-cta">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__num">02</span> Next event
              </p>
              <h2 className="display-md">
                The next bracket
                <br />
                <span className="serif">starts on your desk.</span>
              </h2>
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
