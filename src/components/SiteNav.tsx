"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandMark } from "./BrandMark";

const NAV_ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/#studio", label: "Studio" },
  { href: "/download", label: "Download" },
  { href: "/roadmap", label: "Roadmap" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    window.addEventListener("pageshow", close);
    document.body.dataset.menuOpen = "true";

    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("pageshow", close);
      delete document.body.dataset.menuOpen;
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="site-header__grid">
        <div className="site-header__inner page-frame">
          <Link href="/" className="brand" aria-label="ChessLab home">
            <span className="brand__mark">
              <BrandMark />
            </span>
            <span className="brand__name">
              Chess<span>Lab</span>
            </span>
            <span className="brand__tag">STUDIO</span>
          </Link>

          <nav className="site-nav" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => {
              const basePath = item.href.split("#")[0];
              const active = item.href === "/#studio" ? false : pathname === basePath;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`site-nav__link${active ? " is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="site-header__actions">
            <span className="status-pill">
              <span className="status-pill__dot" />
              Private beta
            </span>
            <Link className="btn btn--solid btn--sm site-header__cta" href="/download">
              Get the beta
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <button
              type="button"
              className={`menu-toggle${open ? " is-open" : ""}`}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>

      <div className={`mobile-nav${open ? " is-open" : ""}`} id="mobile-nav" hidden={!open}>
        <div className="mobile-nav__inner page-frame">
          <nav aria-label="Mobile navigation">
            {NAV_ITEMS.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="mobile-nav__link"
                onClick={() => setOpen(false)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.label}
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 12 12 4M6 4h6v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ))}
          </nav>
          <div className="mobile-nav__foot">
            <span className="status-pill">
              <span className="status-pill__dot" />
              In development
            </span>
            <Link className="btn btn--solid" href="/download" onClick={() => setOpen(false)}>
              Get the beta
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
