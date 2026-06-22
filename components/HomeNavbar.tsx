"use client";

import { defaultLocale, t } from "@/lib/i18n";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function HomeNavbar({ locale = defaultLocale }: { locale?: string }) {
  const tr = t(locale);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== `/${locale}` && pathname.startsWith(href));

  const links = [
    { href: `/${locale}/games`, label: tr.nav.games },
    { href: `/${locale}/studios`, label: tr.nav.studios },
    { href: `/${locale}#mappa`, label: tr.nav.map },
  ];

  return (
    <header className="sticky top-0 inset-x-0 z-50 border-b border-border-soft bg-background/80 backdrop-blur-xl">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-12 h-[60px] flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="font-sans font-extrabold text-[21px] tracking-[0.03em] text-foreground"
        >
          SCENA<span className="text-primary">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-7 font-mono text-[12px] uppercase tracking-[0.08em]">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors hover:text-foreground ${
                isActive(href) ? "text-foreground" : "text-muted"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href={`/${locale}/studios/new`}
            className="px-4 py-[9px] rounded-[2px] border border-border-strong text-foreground transition-colors hover:border-primary"
          >
            {tr.nav.submitStudio}
          </Link>
          <Link
            href={`/${locale}/games/new`}
            className="px-4 py-[9px] rounded-[2px] bg-primary text-[#0B0B0F] font-bold transition-colors hover:bg-accent-hover"
          >
            {tr.nav.submitGame}
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-[2px] text-muted hover:text-foreground hover:bg-white/10 transition-colors"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-border-soft bg-background/95 px-6 py-4 flex flex-col gap-1 font-mono text-[13px] uppercase tracking-[0.06em]">
          {[
            ...links,
            { href: `/${locale}/studios/new`, label: tr.nav.submitStudio },
            { href: `/${locale}/games/new`, label: tr.nav.submitGame },
          ].map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`px-3 py-2.5 rounded-[2px] transition-colors ${
                  active
                    ? "text-primary bg-primary/10"
                    : "text-foreground hover:bg-white/10"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
