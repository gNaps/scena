"use client";

import { defaultLocale, t } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function HomeNavbar({ locale = defaultLocale }: { locale?: string }) {
  const tr = t(locale);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-[#07070f]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
        >
          SCENA
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-2">
          <Button variant="ghost" asChild size="sm">
            <Link href={`/${locale}/games`}>{tr.nav.explore}</Link>
          </Button>
          <Button variant="outline" asChild size="sm">
            <Link href={`/${locale}/studios/new`}>{tr.nav.submitStudio}</Link>
          </Button>
          <Button variant="primary" asChild size="sm">
            <Link href={`/${locale}/games/new`}>{tr.nav.submitGame}</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-lg text-muted hover:text-foreground hover:bg-white/10 transition-colors"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-white/[0.06] bg-[#07070f]/95 px-6 py-4 flex flex-col gap-2">
          {[
            { href: `/${locale}/games`, label: tr.nav.explore },
            { href: `/${locale}/studios/new`, label: tr.nav.submitStudio },
            { href: `/${locale}/games/new`, label: tr.nav.submitGame },
          ].map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "text-primary font-medium bg-primary/10"
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
