import HomeNavbar from "@/components/HomeNavbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Cookie Policy — Scena",
};

export default function CookiePage() {
  return (
    <>
      <HomeNavbar />
      <main className="pt-16 max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Cookie Policy</h1>
        <p className="text-muted text-sm mb-12">Ultimo aggiornamento: aprile 2025</p>

        <section className="flex flex-col gap-10 text-sm text-foreground/80 leading-relaxed">

          <div>
            <h2 className="text-base font-semibold text-foreground mb-3">Nessun cookie utilizzato</h2>
            <p>
              Questo sito <strong>non utilizza cookie</strong> di alcun tipo — né tecnici, né di
              profilazione, né di terze parti a scopo di tracciamento o analisi.
            </p>
            <p className="mt-3">
              Non è quindi richiesto alcun consenso per la navigazione su Scena.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-3">reCAPTCHA</h2>
            <p>
              I form di candidatura utilizzano <strong>Google reCAPTCHA v3</strong> per prevenire
              l&apos;invio automatico di spam. reCAPTCHA potrebbe impostare cookie tecnici propri
              nel tuo browser durante l&apos;utilizzo del form. Tali cookie sono gestiti da Google
              e soggetti alla loro{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-3">Contatti</h2>
            <p>
              Per qualsiasi domanda relativa alla gestione dei dati, consulta la nostra{" "}
              <a href="/privacy" className="text-primary underline underline-offset-2">
                Privacy Policy
              </a>
              .
            </p>
          </div>

        </section>
      </main>
      <Footer />
    </>
  );
}
