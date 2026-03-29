import { defaultLocale, t } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function HomeNavbar({ locale = defaultLocale }: { locale?: string }) {
  const tr = t(locale);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-[#07070f]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
        >
          SCENA
        </Link>

        <div className="flex items-center gap-2">
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
      </div>
    </header>
  );
}
