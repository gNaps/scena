import HomeNavbar from "@/components/HomeNavbar";
import StudiosList from "@/components/StudiosList";
import { t } from "@/lib/i18n";

export default async function StudiosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tr = t(locale);

  return (
    <>
      <HomeNavbar />
      <main className="pt-16">
        <section className="px-6 py-12 max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {tr.studios.title}
            </h1>
            <p className="text-muted">{tr.studios.subtitle}</p>
          </div>
          <StudiosList locale={locale} />
        </section>
      </main>
    </>
  );
}
