"use client";

import GameCard from "@/components/GameCard";
import HomeNavbar from "@/components/HomeNavbar";
import { api } from "@/convex/_generated/api";
import { accentColor, yearOf } from "@/lib/display";
import { getLocalizedName, getLocalizedValue, t } from "@/lib/i18n";
import { useQuery } from "convex/react";
import { X } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";

const PLATFORM_URLS: { label: string; field: string }[] = [
  { label: "Steam", field: "urlSteam" },
  { label: "Epic Games", field: "urlEpicGames" },
  { label: "PlayStation Store", field: "urlPsStore" },
  { label: "Xbox Store", field: "urlXboxStore" },
  { label: "Nintendo Store", field: "urlNintendoStore" },
  { label: "itch.io", field: "urlItchIo" },
  { label: "Kickstarter", field: "urlKickstarter" },
];

export default function GameDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = use(params);
  const game = useQuery(api.games.findBySlug, { slug });
  const otherGames = useQuery(
    api.games.findByStudio,
    game && game.studio ? { studioId: game.studio._id } : "skip"
  );
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const tr = t(locale);

  if (game === undefined) {
    return (
      <>
        <HomeNavbar locale={locale} />
        <main className="flex items-center justify-center min-h-[60vh]">
          <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </main>
      </>
    );
  }

  if (game === null) {
    return (
      <>
        <HomeNavbar locale={locale} />
        <main className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted font-mono text-[13px]">{tr.gameDetail.notFound}</p>
        </main>
      </>
    );
  }

  const description = getLocalizedValue(game.description, locale);
  const color = accentColor(game._id);
  const year = yearOf(game.releaseTime, game.expectedReleaseTime);
  const genre = game.genres[0] ? getLocalizedName(game.genres[0].languages, locale) : null;
  const platStr = game.platforms.map((p) => p.key).join(" · ");

  const storeLinks = PLATFORM_URLS.map(({ label, field }) => ({
    label,
    url: (game as unknown as Record<string, string | undefined>)[field],
  })).filter((l): l is { label: string; url: string } => Boolean(l.url));
  if (game.urlOther) {
    storeLinks.push(...game.urlOther.map((u) => ({ label: u.label, url: u.url })));
  }

  const others = (otherGames ?? []).filter((g) => g._id !== game._id);

  return (
    <>
      <HomeNavbar locale={locale} />
      <main>
        {/* Banner */}
        <div className="relative h-[340px] sm:h-[380px] overflow-hidden border-b border-border-soft">
          {game.coverUrl ? (
            <img
              src={game.coverUrl}
              alt={game.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : null}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(80% 140% at 75% -10%, ${color} 0%, transparent 55%), #0d0d12`,
              opacity: game.coverUrl ? 0.7 : 1,
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: "radial-gradient(#fff 0.8px, transparent 0.8px)",
              backgroundSize: "18px 18px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

          <div className="relative max-w-[1180px] mx-auto h-full px-6 sm:px-12 flex flex-col justify-end pb-9">
            <Link
              href={`/${locale}/games`}
              className="font-mono text-[12px] tracking-[0.06em] text-foreground/80 hover:text-foreground transition-colors mb-5"
            >
              ← {tr.gameDetail.backAll}
            </Link>
            <div className="flex items-center gap-2.5 mb-3.5 flex-wrap">
              {genre && (
                <span
                  className="font-mono font-bold text-[11px] tracking-[0.1em] uppercase text-[#0B0B0F] px-2.5 py-1.5 rounded-[2px]"
                  style={{ background: color }}
                >
                  {genre}
                </span>
              )}
              <span className="font-mono text-[12px] text-text-2">
                {[year, platStr].filter(Boolean).join(" · ")}
              </span>
            </div>
            <h1 className="font-sans font-extrabold text-[48px] sm:text-[72px] lg:text-[88px] leading-[0.9] tracking-[-0.03em] text-text-strong">
              {game.title}
            </h1>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-[1180px] mx-auto px-6 sm:px-12 py-12 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
          {/* Main */}
          <div>
            <h2 className="font-sans font-extrabold text-[24px] text-text-strong mb-4">
              {tr.gameDetail.heading}
            </h2>
            {description ? (
              <p className="font-mono text-[16px] leading-[1.7] text-[#C2C2C9] whitespace-pre-line mb-9">
                {description}
              </p>
            ) : (
              <p className="font-mono text-[15px] leading-[1.7] text-muted mb-9">—</p>
            )}

            {/* Media */}
            {(game.videos?.length || game.screenshotUrls.length > 0) && (
              <>
                <h2 className="font-sans font-extrabold text-[24px] text-text-strong mb-4">
                  {tr.gameDetail.media}
                </h2>
                {game.videos && game.videos.length > 0 && (
                  <div className="flex flex-col gap-3.5 mb-3.5">
                    {game.videos.map((url, i) => (
                      <div
                        key={i}
                        className="aspect-video rounded-[3px] border border-border overflow-hidden"
                      >
                        <iframe
                          src={url}
                          title={`Video ${i + 1}`}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                    ))}
                  </div>
                )}
                {game.screenshotUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                    {game.screenshotUrls.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setLightboxUrl(url)}
                        className="group/img block aspect-[16/10] overflow-hidden rounded-[3px] border border-border cursor-zoom-in"
                      >
                        <img
                          src={url}
                          alt={`Screenshot ${i + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-[84px] flex flex-col gap-4">
            {game.studio && (
              <Link
                href={`/${locale}/studios/${game.studio.slug}`}
                className="block bg-surface border border-border rounded-[3px] p-5 transition-colors hover:border-border-strong"
              >
                <div className="font-mono font-medium text-[10px] tracking-[0.14em] uppercase text-muted mb-3.5">
                  {tr.gameDetail.developedBy}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="w-[38px] h-[38px] rounded-full shrink-0"
                    style={{ background: accentColor(game.studio._id) }}
                  />
                  <span className="min-w-0">
                    <span className="block font-sans font-bold text-[18px] leading-tight text-text-strong truncate">
                      {game.studio.name}
                    </span>
                    {game.studio.location && (
                      <span className="block font-mono text-[11px] text-muted mt-0.5 truncate">
                        {game.studio.location}
                      </span>
                    )}
                  </span>
                </div>
                <div className="font-mono font-medium text-[11px] tracking-[0.06em] uppercase text-primary mt-4">
                  {tr.gameDetail.viewStudio} →
                </div>
              </Link>
            )}

            {/* Info table */}
            <div className="bg-surface border border-border rounded-[3px] p-5">
              {genre && (
                <InfoRow label={tr.gameDetail.info_genre} value={genre} />
              )}
              {year && <InfoRow label={tr.gameDetail.info_year} value={year} />}
              {platStr && (
                <InfoRow label={tr.gameDetail.info_platforms} value={platStr} last />
              )}
            </div>

            {/* Store links */}
            {storeLinks.length > 0 && (
              <div className="flex flex-col gap-2.5">
                {storeLinks.map(({ label, url }, i) => (
                  <a
                    key={`${label}-${i}`}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      i === 0
                        ? "flex items-center justify-center px-4 py-[15px] rounded-[2px] bg-primary text-[#0B0B0F] font-mono font-bold text-[13px] tracking-[0.06em] uppercase transition-colors hover:bg-accent-hover"
                        : "flex items-center justify-between px-4 py-3 rounded-[2px] border border-border bg-surface font-mono text-[12px] text-foreground transition-colors hover:border-border-strong"
                    }
                  >
                    <span>{i === 0 ? `${tr.gameDetail.goToStore} →` : label}</span>
                    {i !== 0 && <span className="text-muted">↗</span>}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Other games */}
        {game.studio && others.length > 0 && (
          <div className="border-t border-border-soft">
            <div className="max-w-[1180px] mx-auto px-6 sm:px-12 py-11">
              <h2 className="font-sans font-extrabold text-[28px] text-text-strong mb-6">
                {tr.gameDetail.otherGames} {game.studio.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
                {others.slice(0, 4).map((g) => (
                  <GameCard key={g._id} game={g} locale={locale} variant="compact" />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
          <img
            src={lightboxUrl}
            alt="Screenshot"
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[90vh] rounded-[3px] object-contain shadow-2xl"
          />
        </div>
      )}
    </>
  );
}

function InfoRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex justify-between gap-4 py-2.5 ${
        last ? "" : "border-b border-border"
      }`}
    >
      <span className="font-mono text-[12px] text-muted shrink-0">{label}</span>
      <span className="font-mono font-medium text-[12px] text-foreground text-right">
        {value}
      </span>
    </div>
  );
}
