import Link from "next/link";
import { Piece, PieceDefs } from "@/components/Pieces";

export default function NotFound() {
  return (
    <div className="notfound page-frame">
      <PieceDefs />
      <p className="eyebrow">
        <span className="eyebrow__dot" /> 404 · Off the board
      </p>
      <h1>
        That square is <em className="serif-em">empty.</em>
      </h1>
      <p className="notfound__lede">
        The page you were looking for isn&apos;t here. No harm done — reset the position and
        try again.
      </p>
      <div className="notfound__actions">
        <Link className="btn btn--solid" href="/">
          Back to the studio
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <Link className="link-arrow" href="/roadmap">
          See the roadmap
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
      <div className="notfound__art" aria-hidden="true">
        <Piece kind="queen" tone="emerald" className="piece" />
        <Piece kind="king" tone="ivory" className="piece" />
        <Piece kind="rook" tone="obsidian" className="piece" />
      </div>
    </div>
  );
}
