"use client";

import HomeNavbar from "@/components/HomeNavbar";
import { api } from "@/convex/_generated/api";
import { getLocalizedName, getLocalizedValue, t } from "@/lib/i18n";
import { useQuery } from "convex/react";
import { ArrowLeft, ExternalLink, Gamepad2, Globe } from "lucide-react";
import Link from "next/link";
import { use } from "react";

const PLATFORM_URLS: Record<string, { label: string; field: string }> = {
  urlSteam: { label: "Steam", field: "urlSteam" },
  urlEpicGames: { label: "Epic Games", field: "urlEpicGames" },
  urlPsStore: { label: "PlayStation Store", field: "urlPsStore" },
  urlXboxStore: { label: "Xbox Store", field: "urlXboxStore" },
  urlNintendoStore: { label: "Nintendo Store", field: "urlNintendoStore" },
  urlItchIo: { label: "itch.io", field: "urlItchIo" },
  urlKickstarter: { label: "Kickstarter", field: "urlKickstarter" },
};

export default function GameDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = use(params);
  const game = useQuery(api.games.findBySlug, { slug });

  if (game === undefined) {
    return (
      <main className="pt-16 flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </main>
    );
  }

  if (game === null) {
    return (
      <main className="pt-16 flex items-center justify-center min-h-screen">
        <p className="text-muted">Gioco non trovato.</p>
      </main>
    );
  }

  const tr = t(locale);
  const description = getLocalizedValue(game.description, locale);
  const statusColor = game.status?.color ?? "hsl(240 5% 65%)";

  const storeLinks = Object.values(PLATFORM_URLS)
    .map(({ label, field }) => ({
      label,
      url: (game as any)[field] as string | undefined,
    }))
    .filter((l) => l.url);

  if (game.urlOther) {
    storeLinks.push(
      ...game.urlOther.map((u) => ({ label: u.label, url: u.url })),
    );
  }

  return (
    <>
      <HomeNavbar />
      <main className="pt-16 pb-24">
        {/* Hero cover */}
        <div className="relative w-full h-[40vh] md:h-[55vh] overflow-hidden">
          {game.coverUrl ? (
            <img
              src={game.coverUrl}
              alt={game.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/10" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 max-w-5xl mx-auto">
            <div className="flex items-end gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                {game.status && (
                  <span
                    className="inline-block text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-md mb-3"
                    style={{
                      color: statusColor,
                      background: `color-mix(in srgb, ${statusColor} 15%, rgba(0,0,0,0.45))`,
                      border: `1px solid color-mix(in srgb, ${statusColor} 30%, transparent)`,
                    }}
                  >
                    {getLocalizedName(game.status.languages, locale)}
                  </span>
                )}
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  {game.title}
                </h1>
                {game.studio && (
                  <Link
                    href={`/${locale}/studios/${game.studio.slug}`}
                    className="text-muted hover:text-foreground transition-colors text-sm mt-1 inline-block"
                  >
                    {game.studio.name}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="max-w-5xl mx-auto px-6 mt-6">
          <Link
            href={`/${locale}/games`}
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft size={15} />
            {tr.games.back}
          </Link>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-6 mt-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Main */}
          <div className="md:col-span-2 flex flex-col gap-8">
            {description && (
              <section>
                <h2 className="text-sm font-semibold text-muted uppercase tracking-widest mb-3">
                  {tr.gameDetail.description}
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  {description}
                </p>
              </section>
            )}

            {game.genres.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-muted uppercase tracking-widest mb-3">
                  {tr.gameDetail.genres}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {game.genres.map((genre) => (
                    <span
                      key={genre._id}
                      className="text-sm px-3 py-1 rounded-full border border-primary/20 text-primary/80"
                    >
                      {getLocalizedName(genre.languages, locale)}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Screenshots */}
            {game.screenshotUrls.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-muted uppercase tracking-widest mb-3">
                  {tr.gameDetail.screenshots}
                </h2>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 snap-x snap-mandatory">
                  {game.screenshotUrls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/img block shrink-0 w-72 overflow-hidden rounded-xl border border-white/10 snap-start"
                    >
                      <img
                        src={url}
                        alt={`Screenshot ${i + 1}`}
                        className="w-full aspect-video object-cover transition-transform duration-500 group-hover/img:scale-105"
                      />
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Videos */}
            {game.videos && game.videos.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-muted uppercase tracking-widest mb-3">
                  {tr.gameDetail.videos}
                </h2>
                <div className="flex flex-col gap-3">
                  {game.videos.map((url, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-xl border border-white/10 aspect-video"
                    >
                      <iframe
                        src={`${url}`}
                        title={`Video ${i + 1}`}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {game.platforms.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-muted uppercase tracking-widest mb-3">
                  {tr.gameDetail.platforms}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {game.platforms.map((p) => (
                    <span
                      key={p._id}
                      className="flex items-center gap-1.5 text-sm px-3 py-1 rounded-full bg-white/5 text-muted"
                    >
                      <Gamepad2 size={13} />
                      {p.key}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {storeLinks.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-muted uppercase tracking-widest mb-3">
                  {tr.gameDetail.available}
                </h2>
                <div className="flex flex-col gap-2">
                  {storeLinks.map(({ label, url }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-surface hover:border-primary/40 transition-colors text-sm text-foreground"
                    >
                      <span>{label}</span>
                      <ExternalLink size={13} className="text-muted" />
                    </a>
                  ))}
                </div>
              </section>
            )}

            {game.studio && (
              <section>
                <h2 className="text-sm font-semibold text-muted uppercase tracking-widest mb-3">
                  {tr.gameDetail.studio}
                </h2>
                <Link
                  href={`/${locale}/studios/${game.studio.slug}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-surface hover:border-primary/40 transition-colors"
                >
                  <Globe size={16} className="text-muted shrink-0" />
                  <span className="text-sm text-foreground">
                    {game.studio.name}
                  </span>
                </Link>
              </section>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
