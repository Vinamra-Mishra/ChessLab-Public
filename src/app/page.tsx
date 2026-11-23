import Link from "next/link";
import ChessScene from "@/components/ChessScene";

const PILLARS = [
  { number: "01", label: "ANALYZE", title: "See the game clearly.", body: "Stockfish 19 works right on your computer. Explore variations and evaluations without cloud latency or sending your games anywhere.", detail: "LOCAL ENGINE · MULTI-PV" },
  { number: "02", label: "UNDERSTAND", title: "Learn from the moments that matter.", body: "Move-by-move reviews put critical decisions in context, so the lesson is more useful than a number on a screen.", detail: "GAME REVIEW · KEY MOMENTS" },
  { number: "03", label: "REMEMBER", title: "Make your openings second nature.", body: "Shape a repertoire around the lines you play, then revisit each variation with smart spaced-repetition practice.", detail: "REPERTOIRE · SPACED REPETITION" },
  { number: "04", label: "IMPROVE", title: "Find your own patterns.", body: "A private picture of your games helps reveal where you thrive—and the habits that could be holding you back.", detail: "PERSONAL INSIGHTS · PRIVATE BY DESIGN" },
];

const PREVIEW_MOVES = [
  ["01", "e4", "e5", "0.24"], ["02", "Nf3", "Nc6", "0.31"], ["03", "Bb5", "a6", "0.28"], ["04", "Ba4", "Nf6", "0.42"], ["05", "O-O", "Be7", "0.38"],
];

export default function Home() {
  return <div className="studio-page">
    <section className="studio-hero">
      <div className="hero-copy">
        <div className="launch-status"><span className="status-pulse"/> <span>IN DEVELOPMENT</span><i/> <span>PUBLIC BETA COMING SOON</span></div>
        <p className="hero-overline">A NEW KIND OF CHESS STUDIO</p>
        <h1>Play the position.<br/><span>Understand the game.</span></h1>
        <p className="hero-description">A beautifully considered desktop space to analyze your games, build your repertoire, and become a more thoughtful player.</p>
        <div className="hero-cta"><Link href="/roadmap" className="studio-button">Explore the roadmap <span>↗</span></Link><Link href="/download" className="text-link">Get release updates <span>→</span></Link></div>
        <div className="trust-notes"><span><b>◎</b> 100% on-device</span><span><b>◌</b> Works offline</span><span><b>⌁</b> No subscription</span></div>
      </div>
      <div className="hero-art-wrap">
        <div className="hero-art"><ChessScene/><div className="art-shade"/><div className="art-label"><span>THE QUIET ADVANTAGE</span><span>01 / 04</span></div></div>
        <div className="analysis-card"><div className="analysis-card-top"><span className="live-dot"/> POSITION STUDY <span className="analysis-score">+1.8</span></div><div className="analysis-line"><span className="move-highlight">Nf3</span><span>Develop with tempo</span><span className="move-arrow">↗</span></div><div className="analysis-meter"><i/></div><div className="analysis-foot"><span>DEPTH 24</span><span>ENGINE READY</span></div></div>
        <span className="art-coordinate">A STUDY IN EVERY MOVE</span>
      </div>
    </section>

    <section className="manifesto"><div className="manifesto-index">CHESSLAB / 001</div><div><p className="eyebrow">BUILT AROUND THE WAY YOU LEARN</p><h2>Less noise.<br/><span>More understanding.</span></h2><p className="manifesto-copy">Chess improvement should feel curious, not overwhelming. ChessLab brings powerful analysis and purposeful practice together in one calm, private workspace.</p></div><div className="manifesto-aside"><span className="aside-mark">♞</span><p>YOUR GAMES.<br/>YOUR DEVICE.<br/>YOUR NEXT MOVE.</p></div></section>

    <section className="feature-section"><div className="section-heading"><div><p className="eyebrow">THE STUDY ROOM</p><h2>Every detail has a purpose.</h2></div><p>Tools for the whole journey—from your first post-game question to the lines you know by heart.</p></div><div className="feature-list">{PILLARS.map((item) => <article className="pillar" key={item.number}><span className="pillar-number">{item.number}</span><div className="pillar-copy"><span className="pillar-label">{item.label}</span><h3>{item.title}</h3><p>{item.body}</p><span className="pillar-detail">{item.detail}</span></div><div className="pillar-art" aria-hidden="true"><span className="pillar-glyph">{item.number === "01" ? "♞" : item.number === "02" ? "⌁" : item.number === "03" ? "♙" : "◉"}</span><span className="pillar-orbit orbit-one"/><span className="pillar-orbit orbit-two"/></div></article>)}</div></section>

    <section className="product-preview"><div className="preview-copy"><p className="eyebrow">A FIRST LOOK</p><h2>Your study space,<br/><span>thoughtfully composed.</span></h2><p>A quiet interface that keeps the board, the moves, and the ideas in focus. This is a glimpse of the ChessLab experience in development.</p><Link href="/roadmap" className="text-link">See what we’re building <span>→</span></Link></div><div className="app-window"><div className="window-bar"><span className="window-lights"><i/><i/><i/></span><span>CHESSLAB · GAME REVIEW</span><span className="window-tag">PREVIEW</span></div><div className="window-content"><div className="window-sidebar"><span className="mini-brand">♞</span><span>▦</span><span>⌕</span><span>▤</span><span>◷</span></div><div className="window-board"><div className="mock-board">{Array.from({length:64},(_,i)=><span key={i} className={(Math.floor(i/8)+i%8)%2 ? "mock-dark":"mock-light"}>{[0,1,2,3,4,5,6,7,8,9,10,11,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63].includes(i) ? (i<16?"♟":i>47?"♙":"") : ""}</span>)}</div></div><div className="window-analysis"><span className="window-label">MOVE REVIEW</span><strong>Ruy Lopez</strong><small>Opening · 12 moves</small><div className="eval-strip"><i/><b>+0.42</b><small>White advantage</small></div><span className="window-label moves-label">NOTATION</span>{PREVIEW_MOVES.map(([n,w,b,v])=><div className="notation" key={n}><span>{n}.</span><b>{w}</b><span>{b}</span><small>{v}</small></div>)}</div></div></div></section>

    <section className="coming-soon"><div className="coming-orb"/><div className="coming-copy"><p className="eyebrow">MADE WITH CARE, NOW IN DEVELOPMENT</p><h2>Good things take<br/><em>thoughtful moves.</em></h2><p>ChessLab is being shaped for players who want to keep learning. Public beta details and desktop releases are coming soon.</p><div className="release-tags"><span>WINDOWS</span><i/><span>macOS</span><i/><span>LINUX</span></div></div><Link href="/roadmap" className="studio-button">Follow the journey <span>↗</span></Link></section>
    <footer className="studio-footer"><span>CHESSLAB <b>♞</b></span><span>ANALYZE LOCALLY. LEARN FOR A LIFETIME.</span><Link href="/download">Release information ↗</Link></footer>
  </div>;
}
