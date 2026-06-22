import HomeNavbar from "@/components/HomeNavbar";
import StudioForm from "@/components/StudioForm";
import { t } from "@/lib/i18n";
import Script from "next/script";

export default async function NewStudio({
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
      <main className="max-w-3xl mx-auto px-6 sm:px-12 pt-16 pb-24">
        <div className="mb-10">
          <h1 className="font-sans font-extrabold text-[40px] sm:text-[52px] leading-[0.96] tracking-[-0.03em] text-text-strong">
            {tr.studioForm.pageTitle}
          </h1>
          <p className="font-mono text-[14px] text-muted mt-3 max-w-xl">
            {tr.studioForm.pageSubtitle}
          </p>
        </div>
        <StudioForm
          locale={locale}
          recaptchaSiteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ""}
        />
      </main>
    </>
  );
}
