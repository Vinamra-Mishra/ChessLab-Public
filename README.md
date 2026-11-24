# ChessLab — Public Website

Official public website and upcoming download portal for **ChessLab**, an offline-first desktop chess analysis, game review, repertoire training, and AI coaching studio built with **Tauri v2**, **Rust**, **SQLite**, **Stockfish 19**, and **Next.js App Router**.

> **Status:** Public Beta — **Coming Soon**

## Core Modules

- **Live Engine Analysis (`/analysis`)** — MultiPV UCI evaluation bar, interactive board arrows, variation lines, and ECO classification.
- **Full Game Review (`/review`)** — MultiPV=2 win-probability & Expected Points analysis, 11-tier move classification badges, and mistake retry mode.
- **Opening Explorer & Repertoire (`/openings`)** — Transposition-aware explorer, repertoire tree builder, and SM-2 spaced-repetition drill mode.
- **Game Database (`/database`)** — High-speed PGN import, position/player search filters, and public archive sync.
- **Tactical Puzzles (`/puzzles`)** — Local puzzle bank and mistake-extracted puzzles with SM-2 scheduling.
- **AI Coach (`/coach`)** — Longitudinal weakness detection, error-risk modeling, and personalized study insights.
- **Local Profiles (`/settings`)** — Immutable local player profiles and desktop preferences.

## Local Development

```bash
npm install
npm run dev
```

Build and lint:

```bash
npm run lint
npm run build
```
