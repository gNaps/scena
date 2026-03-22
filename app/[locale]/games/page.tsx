import GamesList from "@/components/GamesList";
import HomeNavbar from "@/components/HomeNavbar";

export default async function GamesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <HomeNavbar />
      <main className="pt-16">
        <section className="px-6 py-12 max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Giochi
            </h1>
            <p className="text-muted">Videogiochi italiani indipendenti.</p>
          </div>
          <GamesList locale={locale} />
        </section>
      </main>
    </>
  );
}
