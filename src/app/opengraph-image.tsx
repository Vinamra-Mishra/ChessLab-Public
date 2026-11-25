import { ImageResponse } from "next/og";

export const alt = "ChessLab — Offline Chess Analysis & ATHENA AI Coach";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 64px",
          background:
            "radial-gradient(circle at 72% 22%, rgba(255,91,46,0.30), transparent 48%), radial-gradient(circle at 6% 96%, rgba(255,91,46,0.14), transparent 54%), #000000",
          color: "#f5f3ef",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,91,46,0.4)",
              borderRadius: 12,
              background: "rgba(255,91,46,0.12)",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
              <g fill="#ff5b2e">
                <path d="M24 11c-4.4 0-8 3.4-8 7.6 0 2.7 1.5 5.1 3.8 6.4l-1.7 3.2h11.8l-1.7-3.2c2.3-1.3 3.8-3.7 3.8-6.4C32 14.4 28.4 11 24 11Z" />
                <path d="M17.4 30.2h13.2l.9 2.6H16.5z" />
                <path d="M15.8 34.4h16.4c1.1 0 1.9.9 1.9 2v1.2c0 1.1-.8 2-1.9 2H15.8c-1.1 0-1.9-.9-1.9-2v-1.2c0-1.1.8-2 1.9-2Z" />
              </g>
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 25, fontWeight: 600, letterSpacing: -0.5 }}>
            ChessLab
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: 6,
              padding: "5px 11px",
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: 999,
              fontSize: 12,
              letterSpacing: 2,
              color: "#a7a29a",
            }}
          >
            OFFLINE DESKTOP · ATHENA
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div
            style={{
              display: "flex",
              fontSize: 132,
              fontWeight: 700,
              letterSpacing: -6,
              lineHeight: 0.86,
              textTransform: "uppercase",
            }}
          >
            Master
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 132,
              fontWeight: 400,
              letterSpacing: -5,
              lineHeight: 0.86,
              color: "#ff5b2e",
              textTransform: "uppercase",
            }}
          >
            Chess
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              maxWidth: 740,
              fontSize: 22,
              lineHeight: 1.45,
              color: "#a7a29a",
            }}
          >
            Stockfish 19 analysis, human-like neural sparring, and 4-tier mastery coaching — 100% local in Rust.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 20,
            fontSize: 13,
            letterSpacing: 2.6,
            color: "#6f6b64",
          }}
        >
          <span>TAURI V2 · RUST</span>
          <span>STOCKFISH 19</span>
          <span>ATHENA CPU</span>
          <span>NO ACCOUNT</span>
        </div>
      </div>
    ),
    size,
  );
}
