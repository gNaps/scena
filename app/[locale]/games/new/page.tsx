import GameForm from "@/components/GameForm";
import HomeNavbar from "@/components/HomeNavbar";
import { t } from "@/lib/i18n";
import Script from "next/script";

export default async function NewGame({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tr = t(locale);

  return (
    <>
      <HomeNavbar locale={locale} />
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
      />
      <main className="pt-16 max-w-3xl mx-auto px-6 py-20">
        <div className="mb-10 mt-5">
          <h1 className="text-3xl font-bold text-foreground">
            {tr.gameForm.pageTitle}
          </h1>
          <p className="text-muted mt-2 text-sm">{tr.gameForm.pageSubtitle}</p>
        </div>
        <GameForm
          locale={locale}
          recaptchaSiteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ""}
        />
      </main>
    </>
  );
}
