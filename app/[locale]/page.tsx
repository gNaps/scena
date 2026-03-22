import HomeNavbar from "@/components/HomeNavbar";
import StudioMapWrapper from "@/components/StudioMapWrapper";
import { Button } from "@/components/ui/Button";
import { Building2, Gamepad2, Rocket, Send } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Studi registrati", value: "10+" },
  { label: "Giochi pubblicati", value: "40+" },
  { label: "Regioni coperte", value: "8" },
];

const quickLinks = [
  {
    icon: Gamepad2,
    title: "Esplora i giochi",
    description:
      "Scopri titoli indipendenti made in Italy, dal puzzle game all'action RPG.",
    href: "games",
  },
  {
    icon: Building2,
    title: "Esplora gli studi",
    description:
      "Conosci i team dietro i giochi: storie, visioni e progetti in corso.",
    href: "studios",
  },
  {
    icon: Send,
    title: "Candida il tuo gioco",
    description:
      "Hai un gioco italiano? Portalo sulla piattaforma e fatti trovare.",
    href: "games/new",
  },
  {
    icon: Rocket,
    title: "Candida il tuo studio",
    description:
      "Crea il profilo del tuo studio e connettiti con la community italiana.",
    href: "studios/new",
  },
];

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <HomeNavbar />
      <main className="pt-16 overflow-hidden">
        {/* Hero */}
        <section className="relative flex flex-col items-center justify-center text-center px-6 py-36 md:py-48">
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="pointer-events-none absolute top-24 left-1/4 w-[300px] h-[300px] bg-secondary/8 rounded-full blur-[100px]" />

          <h1 className="relative text-7xl md:text-9xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            SCENA
          </h1>
          <p className="relative text-xl md:text-2xl text-muted mb-4 max-w-xl">
            La piattaforma per i{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-semibold">
              videogiochi italiani
            </span>
            .
          </p>
          <p className="relative text-base md:text-lg text-muted/70 mb-12 max-w-lg">
            Scopri i videogiochi italiani che ancora non conosci. Una community
            per sviluppatori, appassionati e curiosi.
          </p>
          <div className="relative flex flex-col sm:flex-row gap-3">
            <Button size="lg">
              <Link href={`/${locale}/games`}>Esplora giochi</Link>
            </Button>
            <Button size="lg" variant="outline">
              <Link href={`/${locale}/studios`}>Unisciti come studio</Link>
            </Button>
          </div>
        </section>

        {/* Quick links */}
        <section className="px-6 pb-28 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map(({ icon: Icon, title, description, href }) => (
              <Link
                key={href}
                href={`/${locale}/${href}`}
                className="card-glow group relative flex flex-col gap-5 rounded-2xl border border-white/10 bg-surface p-6 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-white" />
                </div>
                <div className="relative">
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Map */}
        <section className="px-6 pb-24 max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Dove siamo
            </h2>
            <p className="text-muted">Gli studi italiani sulla mappa.</p>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-white/10 h-[400px] md:h-[500px]">
            <StudioMapWrapper />
          </div>
        </section>

        {/* Stats */}
        <section className="px-6 pb-32 max-w-6xl mx-auto">
          <div className="relative rounded-2xl border border-white/10 bg-surface overflow-hidden px-8 py-14 md:px-16 text-center">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5" />
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/10 rounded-full blur-[80px]" />
            <h2 className="relative text-2xl md:text-3xl font-bold text-foreground mb-3">
              Il mercato italiano{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                cresce
              </span>
            </h2>
            <p className="relative text-muted mb-12">
              Numeri reali, storie vere, talento italiano.
            </p>
            <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-10">
              {stats.map(({ label, value }) => (
                <div key={label}>
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
                    {value}
                  </div>
                  <div className="text-sm text-muted uppercase tracking-widest">
                    {label}
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
