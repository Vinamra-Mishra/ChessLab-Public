import { ImageResponse } from "next/og";

export const alt = "ChessLab — the offline chess studio";
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
          padding: "64px",
          background:
            "radial-gradient(circle at 78% 18%, rgba(47,224,160,0.24), transparent 46%), radial-gradient(circle at 12% 92%, rgba(13,157,110,0.18), transparent 52%), #000000",
          color: "#f4f7f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(47,224,160,0.45)",
              borderRadius: 14,
              background: "rgba(47,224,160,0.12)",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
              <path d="M13.5 34.5V22.5H31V13" stroke="#2fe0a0" strokeWidth="4" strokeLinecap="square" />
              <circle cx="13.5" cy="34.5" r="3.4" fill="#2fe0a0" />
              <path d="M25.4 11.6 34.4 13.2 31 21.6Z" fill="#d6fff0" />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 600, letterSpacing: -0.6 }}>
            ChessLab
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: 8,
              padding: "6px 12px",
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: 999,
              fontSize: 13,
              letterSpacing: 2,
              color: "#9aa5a0",
            }}
          >
            OFFLINE STUDIO
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 700, letterSpacing: -4, lineHeight: 0.96 }}>
            Think one move
          </div>
          <div style={{ display: "flex", fontSize: 96, letterSpacing: -3, lineHeight: 0.96, color: "#2fe0a0", fontStyle: "italic" }}>
            ahead.
          </div>
          <div style={{ display: "flex", marginTop: 8, maxWidth: 720, fontSize: 24, lineHeight: 1.45, color: "#9aa5a0" }}>
            Analysis, review, and repertoire — on your own machine. Powered by Stockfish 19.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 22,
            fontSize: 15,
            letterSpacing: 2.6,
            color: "#6c756f",
          }}
        >
          <span>LOCAL-FIRST</span>
          <span>STOCKFISH 19</span>
          <span>NO ACCOUNT</span>
          <span>WINDOWS · MACOS · LINUX</span>
        </div>
      </div>
    ),
    size,
  );
}
