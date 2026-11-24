"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/studio", label: "Studio" },
  { href: "/analysis", label: "Analysis" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/download", label: "Download" },
];

function Plus({ side }: { side?: "left" | "right" }) {
  return (
    <span
      aria-hidden="true"
      className={`site-head__plus${side ? ` site-head__plus--${side}` : ""}`}
    />
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-head">
      <div className="site-head__rail">
        <div className="site-head__inner">
          <Plus side="left" />
          <div className="brandcell">
            <Link href="/" className="brandline" aria-label="ChessLab home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/chesslab-logo.svg" alt="" width={22} height={22} aria-hidden="true" />
              ChessLab
              <em>Studio</em>
            </Link>
          </div>

          <nav className="site-nav" aria-label="Primary">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? "is-active" : undefined}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Plus side="right" />

          <div className="site-head__end">
            <Link className="watch-link" href="/studio">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="10" cy="10" r="8.1" stroke="currentColor" strokeWidth="1.3" />
                <path d="M8.4 6.9 13 10l-4.6 3.1V6.9Z" fill="currentColor" />
              </svg>
              <span>Watch video</span>
            </Link>
            <Link className="btn-pill btn-pill--light btn-pill--sm" href="/download">
              Get access
            </Link>
            <button
              type="button"
              className="menu-btn"
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div className="menu-sheet">
          <nav aria-label="Mobile">
            {NAV.map((item, index) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            className="btn-pill btn-pill--light"
            href="/download"
            onClick={() => setOpen(false)}
          >
            Get access
          </Link>
        </div>
      ) : null}
    </header>
  );
}
