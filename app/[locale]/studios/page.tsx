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
      <HomeNavbar locale={locale} />
      <main>
        <section className="max-w-[1280px] mx-auto px-6 sm:px-12 pt-16 pb-8">
          <div className="font-mono font-medium text-[12px] tracking-[0.18em] uppercase text-primary mb-4">
            {`// ${tr.studios.eyebrow}`}
          </div>
          <h1 className="font-sans font-extrabold text-[44px] sm:text-[64px] leading-[0.96] tracking-[-0.03em] text-text-strong">
            {tr.studios.title}
          </h1>
        </section>
        <section className="max-w-[1280px] mx-auto px-6 sm:px-12 pb-24">
          <StudiosList locale={locale} />
        </section>
      </main>
    </>
  );
}
