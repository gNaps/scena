import HomeNavbar from "@/components/HomeNavbar";
import Link from "next/link";
import { Gamepad2, Building2, Send, Rocket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <HomeNavbar />
      <main className="pt-16">
        <section className="flex flex-col items-center justify-center text-center px-6 py-32">
          <h1 className="text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            SCENE
          </h1>
          <p className="text-xl text-muted mb-6">
            La piattaforma per i{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-semibold">
              videogiochi italiani
            </span>
            .
          </p>
          <p className="text-base text-muted mb-12">
            Scopri i videogiochi italiani che ancora non conosci. Una community
            per sviluppatori, appassionati e curiosi.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/games">Esplora giochi</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/studios">Unisciti come studio</Link>
            </Button>
          </div>
        </section>

        <section className="px-6 pb-32 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Gamepad2,
                title: "Esplora i giochi",
                description: "Scopri titoli indipendenti made in Italy, dal puzzle game all'action RPG.",
                href: "/games",
              },
              {
                icon: Building2,
                title: "Esplora gli studi",
                description: "Conosci i team dietro i giochi: storie, visioni e progetti in corso.",
                href: "/studios",
              },
              {
                icon: Send,
                title: "Candida il tuo gioco",
                description: "Hai un gioco italiano? Portalo sulla piattaforma e fatti trovare.",
                href: "/games/new",
              },
              {
                icon: Rocket,
                title: "Candida il tuo studio",
                description: "Crea il profilo del tuo studio e connettiti con la community italiana.",
                href: "/studios/new",
              },
            ].map(({ icon: Icon, title, description, href }) => (
              <Link key={href} href={href} className="group">
                <Card className="h-full relative overflow-hidden border-white/10 bg-surface hover:border-primary/50 transition-colors duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardHeader className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-2">
                      <Icon size={20} className="text-white" />
                    </div>
                    <CardTitle>{title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <CardDescription className="text-muted leading-relaxed">{description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
