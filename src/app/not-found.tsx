import Link from "next/link";
import { PieceArt, PieceDefs } from "@/components/Pieces";

export default function NotFound() {
  return (
    <div className="notfound">
      <PieceDefs />
      <p className="eyebrow">
        <span className="eyebrow__num">(</span> 404 · Off the board{" "}
        <span className="eyebrow__num">)</span>
      </p>

      <h1 className="display-xl notfound__title">
        That square is
        <br />
        <span className="stroke-type">empty</span>
      </h1>

      <p className="notfound__lede">
        The page you were looking for isn&apos;t here. No harm done — reset the position and
        try again.
      </p>

      <div className="notfound__actions">
        <Link className="btn-pill btn-pill--light" href="/">
          Back to the studio
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3.5 10h12M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <Link className="btn-pill btn-pill--outline" href="/roadmap">
          See the roadmap
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 16 16 4M6.5 4H16v9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <div className="notfound__art" aria-hidden="true">
        <div className="notfound__piece notfound__piece--a">
          <PieceArt kind="king" material="obsidian" glow />
        </div>
        <div className="notfound__piece notfound__piece--b">
          <PieceArt kind="queen" material="ivory" />
        </div>
        <div className="notfound__piece notfound__piece--c">
          <PieceArt kind="rook" material="ember" />
        </div>
      </div>
    </div>
  );
}
