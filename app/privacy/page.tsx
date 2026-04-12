import HomeNavbar from "@/components/HomeNavbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy — Scena",
};

export default function PrivacyPage() {
  return (
    <>
      <HomeNavbar />
      <main className="pt-16 max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted text-sm mb-12">Ultimo aggiornamento: aprile 2025</p>

        <section className="flex flex-col gap-10 text-sm text-foreground/80 leading-relaxed">

          <div>
            <h2 className="text-base font-semibold text-foreground mb-3">1. Titolare del trattamento</h2>
            <p>
              Il titolare del trattamento dei dati personali è la piattaforma <strong>Scena</strong>,
              raggiungibile all&apos;indirizzo email indicato nei form di contatto presenti sul sito.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-3">2. Dati raccolti</h2>
            <p>
              Scena non raccoglie né conserva dati personali degli utenti che visitano il sito.
              Non sono presenti sistemi di registrazione, account utente o profilazione.
            </p>
            <p className="mt-3">
              I soli dati trattati sono quelli <strong>volontariamente inseriti</strong> nei form
              di candidatura — per l&apos;aggiunta di un gioco o di uno studio — e comprendono:
            </p>
            <ul className="list-disc list-inside mt-3 flex flex-col gap-1.5 pl-2">
              <li>Nome del gioco o dello studio</li>
              <li>Descrizione e informazioni editoriali</li>
              <li>Indirizzo email di contatto fornito nel form</li>
              <li>Immagini caricate (cover, screenshot, logo)</li>
              <li>URL di store, siti web e profili social</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-3">3. Modalità e finalità del trattamento</h2>
            <p>
              I dati inseriti nei form vengono inviati via email al team di Scena al solo scopo
              di valutare la candidatura e, se approvata, inserire il contenuto nella piattaforma.
            </p>
            <p className="mt-3">
              I dati <strong>non vengono salvati in alcun database</strong> automaticamente e non
              sono condivisi con terze parti, né utilizzati per finalità di marketing o profilazione.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-3">4. Cookie</h2>
            <p>
              Questo sito <strong>non utilizza cookie</strong> di profilazione, di tracciamento
              o di terze parti. Non è pertanto necessario il consenso ai cookie.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-3">5. Servizi di terze parti</h2>
            <p>
              Il sito utilizza <strong>Google reCAPTCHA</strong> per la protezione anti-spam dei
              form. L&apos;utilizzo di reCAPTCHA è soggetto alla{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                Privacy Policy di Google
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-3">6. Diritti dell&apos;utente</h2>
            <p>
              Ai sensi del Regolamento UE 2016/679 (GDPR), hai il diritto di richiedere l&apos;accesso,
              la rettifica o la cancellazione dei dati che ci hai inviato tramite i form.
              Puoi esercitare tali diritti contattandoci all&apos;indirizzo email indicato nel form
              di candidatura.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-3">7. Modifiche a questa policy</h2>
            <p>
              Questa pagina potrà essere aggiornata in caso di variazioni delle modalità di
              trattamento dei dati. La data di ultimo aggiornamento è indicata in cima alla pagina.
            </p>
          </div>

        </section>
      </main>
      <Footer />
    </>
  );
}
