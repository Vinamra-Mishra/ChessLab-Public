"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/studio", label: "Workstation" },
  { href: "/analysis", label: "Analysis" },
  { href: "/athena", label: "ATHENA" },
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
              <em>Desktop</em>
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
            <Link className="watch-link" href="/roadmap">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="10" cy="10" r="8.1" stroke="currentColor" strokeWidth="1.3" />
                <path d="m12.8 7.2-1.7 4.5-4.5 1.7 1.7-4.5 4.5-1.7Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
              </svg>
              <span>Roadmap</span>
            </Link>
            <Link className="btn-pill btn-pill--light btn-pill--sm" href="/download" data-magnetic data-spotlight>
              Download
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
            Download
          </Link>
        </div>
      ) : null}
    </header>
  );
}
