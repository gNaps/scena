import FeaturedGames from "@/components/FeaturedGames";
import HomeNavbar from "@/components/HomeNavbar";
import HomeStats from "@/components/HomeStats";
import StudioMapWrapper from "@/components/StudioMapWrapper";
import { t } from "@/lib/i18n";
import Link from "next/link";

const quickLinkHrefs = ["games", "studios", "games/new", "studios/new"];
const quickLinkNums = ["01", "02", "03", "04"];

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
      <main className="overflow-x-hidden">
        {/* Hero */}
        <section className="max-w-[1100px] mx-auto px-6 sm:px-12 pt-24 pb-16 text-center">
          <div className="font-mono font-medium text-[12px] tracking-[0.24em] uppercase text-primary mb-7">
            {tr.home.eyebrow}
          </div>
          <h1 className="font-sans font-extrabold text-[88px] sm:text-[120px] lg:text-[168px] leading-[0.84] tracking-[-0.04em] text-text-strong">
            SCENA<span className="text-primary">.</span>
          </h1>
          <p className="font-mono text-[16px] sm:text-[18px] leading-[1.6] text-text-2 max-w-[560px] mx-auto mt-8 mb-10">
            {tr.home.heroSub}
          </p>
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
            <Link
              href={`/${locale}/games`}
              className="inline-flex items-center justify-center px-7 py-[15px] rounded-[2px] bg-primary text-[#0B0B0F] font-mono font-bold text-[13px] tracking-[0.06em] uppercase transition-colors hover:bg-accent-hover"
            >
              {tr.hero.cta_games} →
            </Link>
            <Link
              href={`/${locale}/studios/new`}
              className="inline-flex items-center justify-center px-7 py-[15px] rounded-[2px] border border-border-strong text-foreground font-mono font-bold text-[13px] tracking-[0.06em] uppercase transition-colors hover:border-primary"
            >
              {tr.hero.cta_studios}
            </Link>
          </div>
        </section>

        {/* Map — protagonist */}
        <section
          id="mappa"
          className="max-w-[1280px] mx-auto px-6 sm:px-12 pt-8 pb-24 scroll-mt-20"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
            <div>
              <div className="font-mono font-medium text-[12px] tracking-[0.18em] uppercase text-primary mb-3">
                {`// ${tr.home.mapEyebrow}`}
              </div>
              <h2 className="font-sans font-extrabold text-[34px] sm:text-[46px] leading-none tracking-[-0.02em] text-text-strong">
                {tr.home.mapTitle}
              </h2>
            </div>
            <p className="font-mono text-[13px] leading-[1.5] text-muted max-w-[280px] sm:text-right">
              {tr.home.mapHint}
            </p>
          </div>
          <div className="relative rounded-[3px] overflow-hidden border border-border-soft h-[460px] md:h-[600px] bg-surface-elevated">
            <StudioMapWrapper locale={locale} />
          </div>
        </section>

        {/* Action cards */}
        <section className="max-w-[1280px] mx-auto px-6 sm:px-12 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tr.quickLinks.map(({ title, description }, i) => (
              <Link
                key={quickLinkHrefs[i]}
                href={`/${locale}/${quickLinkHrefs[i]}`}
                className="card-glow block bg-surface border border-border rounded-[3px] p-[26px] min-h-[170px]"
              >
                <div className="font-sans font-extrabold text-[28px] leading-none text-primary">
                  {quickLinkNums[i]}
                </div>
                <div className="font-sans font-bold text-[18px] leading-tight text-text-strong mt-[18px] mb-2">
                  {title}
                </div>
                <p className="font-mono text-[12px] leading-[1.55] text-muted">
                  {description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured games */}
        <section className="max-w-[1280px] mx-auto px-6 sm:px-12 pb-24">
          <div className="flex items-baseline justify-between border-t border-border-soft pt-8 mb-7">
            <h2 className="font-sans font-extrabold text-[30px] sm:text-[38px] leading-none tracking-[-0.02em] text-text-strong">
              {tr.home.featuredTitle}
            </h2>
            <Link
              href={`/${locale}/games`}
              className="font-mono font-medium text-[12px] tracking-[0.08em] uppercase text-primary hover:text-accent-hover transition-colors shrink-0"
            >
              {tr.home.featuredAll} →
            </Link>
          </div>
          <FeaturedGames locale={locale} />
        </section>

        {/* CTA band */}
        <section className="max-w-[1280px] mx-auto px-6 sm:px-12 pb-24">
          <div className="rounded-[3px] bg-primary text-[#0B0B0F] px-8 sm:px-12 py-12 sm:py-[54px] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">
            <div>
              <h2 className="font-sans font-extrabold text-[34px] sm:text-[44px] leading-[0.98] tracking-[-0.02em] mb-3">
                {tr.home.ctaTitle}
              </h2>
              <p className="font-mono font-medium text-[15px] leading-[1.5] opacity-80 max-w-[460px]">
                {tr.home.ctaText}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href={`/${locale}/games/new`}
                className="inline-flex items-center justify-center px-6 py-[15px] rounded-[2px] bg-[#0B0B0F] text-primary font-mono font-bold text-[13px] tracking-[0.06em] uppercase transition-opacity hover:opacity-90"
              >
                {tr.home.ctaGame}
              </Link>
              <Link
                href={`/${locale}/studios/new`}
                className="inline-flex items-center justify-center px-6 py-[15px] rounded-[2px] border-[1.5px] border-[#0B0B0F] text-[#0B0B0F] font-mono font-bold text-[13px] tracking-[0.06em] uppercase transition-colors hover:bg-[#0B0B0F]/5"
              >
                {tr.home.ctaStudio}
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-t border-border-soft">
          <div className="max-w-[1280px] mx-auto">
            <HomeStats items={tr.stats.items} />
          </div>
        </section>
      </main>
    </>
  );
}
