import GamesList from "@/components/GamesList";
import HomeNavbar from "@/components/HomeNavbar";
import { t } from "@/lib/i18n";

export default async function GamesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tr = t(locale);

  return (
    <>
      <HomeNavbar locale={locale} />
      <main className="pt-16">
        <section className="px-6 py-12 max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {tr.games.title}
            </h1>
            <p className="text-muted">{tr.games.subtitle}</p>
          </div>
          <GamesList locale={locale} />
        </section>
      </main>
    </>
  );
}
