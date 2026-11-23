# ChessLab — public site

The public marketing site for **ChessLab**, an offline-first desktop chess studio.
Built with Next.js 16 (App Router) and a hand-authored AMOLED design system.

## what's here

| Route | Purpose |
| --- | --- |
| `/` | Overview: hero with the study board, studio features, privacy, piece set, release CTA |
| `/download` | Planned platforms, what ships in the box, pre-release checklist |
| `/roadmap` | Release milestones with progress, plus the principles behind the build |
| `not-found` | Off-the-board 404 |
| `opengraph-image` | Generated social card |
| `icon.svg` | App icon / favicon |

## design notes

- **AMOLED black canvas.** `#000` everywhere; depth comes from 1px seams
  (`rgba(255,255,255,.09)`), soft vignettes, and a single emerald signal colour.
- **No raster imagery.** Every visual is vector:
  - `src/components/Pieces.tsx` — the chess set. Each piece is a small set of filled
    primitives that share one gradient; a clipped light stack (key light, form shadow,
    board bounce) plus a single-plate extruded base gives it depth. The same geometry
    renders as flat `mono` glyphs on the analysis board.
  - `src/components/StudyBoard.tsx` — a full analysis-board mock-up in SVG, including
    coordinates, highlighted moves, and evaluation chrome.
  - `src/components/BrandMark.tsx` — the knight's-move monogram.
- **Typography.** Self-hosted variable fonts via `next/font/local`
  (Bricolage Grotesque for display, Inter Tight for body, JetBrains Mono for meta,
  Instrument Serif italic for accents). No external font requests at runtime.
- **Motion.** CSS only: page enter, ticker, floating labels, pulse dots, and the flow
  animation. Everything collapses under `prefers-reduced-motion`.

## development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

Static output: every route prerenders — no client-side data fetching, no runtime fonts.

## fonts

The `.woff2` files live in `src/app/fonts/` and are licensed under the SIL Open Font
License (Bricolage Grotesque, Inter Tight, JetBrains Mono, Instrument Serif).
