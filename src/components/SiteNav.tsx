"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/#studio", label: "Studio" },
  { href: "/download", label: "Download" },
  { href: "/roadmap", label: "Roadmap" },
];

function BrandMark() {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect width="40" height="40" rx="13" fill="currentColor" />
      <path d="M23.9 9.2c-2.9 0-4.7 1.7-4.7 4.6 0 1.1.4 2.2 1.3 3.1l-2.2 3.7h9.4l-1.8-3.8c1.3-.9 2-2.3 2-3.8 0-2.2-1.6-3.8-4-3.8Z" fill="#F3F2EC" />
      <path d="M17.1 20.6h11.5l1.2 3.2H15.8l1.3-3.2ZM14.8 25.7h17.1l1.1 3.2H13.6l1.2-3.2Z" fill="#D8C69E" />
      <circle cx="23.3" cy="13.2" r=".8" fill="#213B2D" />
    </svg>
  );
}

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header__inner page-frame">
        <Link href="/" className="brand" aria-label="ChessLab home">
          <span className="brand__mark"><BrandMark /></span>
          <span className="brand__name">Chess<span>Lab</span></span>
        </Link>

        <nav className="site-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => {
            const basePath = item.href.split("#")[0];
            const active = item.href === "/#studio"
              ? false
              : pathname === basePath;
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

        <div className="site-header__status"><span /> Public beta in development</div>
      </div>
    </header>
  );
}
