import HomeNavbar from "@/components/HomeNavbar";
import StudiosList from "@/components/StudiosList";

export default async function StudiosPage({
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
              Studi
            </h1>
            <p className="text-muted">I team italiani dietro i giochi.</p>
          </div>
          <StudiosList />
        </section>
      </main>
    </>
  );
}
