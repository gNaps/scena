import HomeNavbar from "@/components/HomeNavbar";
import StudioMapWrapper from "@/components/StudioMapWrapper";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/i18n";
import { Building2, Gamepad2, Rocket, Send } from "lucide-react";
import Link from "next/link";

const quickLinkIcons = [Gamepad2, Building2, Send, Rocket];
const quickLinkHrefs = ["games", "studios", "games/new", "studios/new"];
const statsValues = ["10+", "40+", "8"];

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tr = t(locale);

  return (
    <>
      <HomeNavbar locale={locale} />
      <main className="pt-16 overflow-hidden">
        {/* Hero */}
        <section className="relative flex flex-col items-center justify-center text-center px-6 py-36 md:py-48">
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="pointer-events-none absolute top-24 left-1/4 w-[300px] h-[300px] bg-secondary/8 rounded-full blur-[100px]" />

          <h1 className="relative text-7xl md:text-9xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            SCENA
          </h1>
          <p className="relative text-xl md:text-2xl text-muted mb-4 max-w-xl">
            {tr.hero.tagline}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-semibold">
              {tr.hero.highlight}
            </span>
            .
          </p>
          <p className="relative text-base md:text-lg text-muted/70 mb-12 max-w-lg">
            {tr.hero.sub}
          </p>
          <div className="relative flex flex-col sm:flex-row gap-3">
            <Button size="lg">
              <Link href={`/${locale}/games`} className="flex items-center gap-2">
                <Gamepad2 size={18} />
                {tr.hero.cta_games}
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              <Link href={`/${locale}/studios`} className="flex items-center gap-2">
                <Building2 size={18} />
                {tr.hero.cta_studios}
              </Link>
            </Button>
          </div>
        </section>

        {/* Quick links */}
        <section className="px-6 pb-28 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tr.quickLinks.map(({ title, description }, i) => {
              const Icon = quickLinkIcons[i];
              return (
                <Link
                  key={quickLinkHrefs[i]}
                  href={`/${locale}/${quickLinkHrefs[i]}`}
                  className="card-glow group relative flex flex-col gap-5 rounded-2xl border border-white/10 bg-surface p-6 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className="relative">
                    <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Map */}
        <section className="px-6 pb-24 max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {tr.map.title}
            </h2>
            <p className="text-muted">{tr.map.sub}</p>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-white/10 h-[400px] md:h-[500px]">
            <StudioMapWrapper locale={locale} />
          </div>
        </section>

        {/* Stats */}
        <section className="px-6 pb-32 max-w-6xl mx-auto">
          <div className="relative rounded-2xl border border-white/10 bg-surface overflow-hidden px-8 py-14 md:px-16 text-center">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5" />
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/10 rounded-full blur-[80px]" />
            <h2 className="relative text-2xl md:text-3xl font-bold text-foreground mb-3">
              {tr.stats.title}{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {tr.stats.highlight}
              </span>
            </h2>
            <p className="relative text-muted mb-12">{tr.stats.sub}</p>
            <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-10">
              {statsValues.map((value, i) => (
                <div key={i}>
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
                    {value}
                  </div>
                  <div className="text-sm text-muted uppercase tracking-widest">
                    {tr.stats.items[i]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
