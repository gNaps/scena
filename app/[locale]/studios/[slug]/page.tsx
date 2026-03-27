"use client";

import { api } from "@/convex/_generated/api";
import HomeNavbar from "@/components/HomeNavbar";
import { getLocalizedName, getLocalizedValue, t } from "@/lib/i18n";
import { useQuery } from "convex/react";
import { ArrowLeft, Check, Globe, Instagram, Linkedin, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";

export default function StudioDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = use(params);
  const tr = t(locale);
  const [emailCopied, setEmailCopied] = useState(false);
  const studio = useQuery(api.studios.findBySlug, { slug });
  const games = useQuery(
    api.games.findByStudio,
    studio ? { studioId: studio._id } : "skip"
  );

  if (studio === undefined) {
    return (
      <main className="pt-16 flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </main>
    );
  }

  if (studio === null) {
    return (
      <main className="pt-16 flex items-center justify-center min-h-screen">
        <p className="text-muted">Studio non trovato.</p>
      </main>
    );
  }

  return (
    <>
    <HomeNavbar />
    <main className="pt-16 pb-24">
      {/* Header */}
      <div className="relative border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        <div className="relative max-w-5xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Logo */}
          <div className="w-20 h-20 rounded-2xl border border-white/10 bg-surface flex items-center justify-center overflow-hidden shrink-0">
            {studio.logoUrl ? (
              <img
                src={studio.logoUrl}
                alt={studio.name}
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {studio.name}
                </h1>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {studio.location && (
                    <span className="flex items-center gap-1 text-sm text-muted">
                      <MapPin size={13} />
                      {studio.location}
                    </span>
                  )}
                  {studio.region && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full border border-white/10 text-muted capitalize">
                      {studio.region.replace(/-/g, " ")}
                    </span>
                  )}
                </div>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-2">
                {studio.urlWebsite && (
                  <a
                    href={studio.urlWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-white/10 bg-surface hover:border-primary/40 transition-colors text-muted hover:text-foreground"
                  >
                    <Globe size={16} />
                  </a>
                )}
                {studio.urlInstagram && (
                  <a
                    href={studio.urlInstagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-white/10 bg-surface hover:border-primary/40 transition-colors text-muted hover:text-foreground"
                  >
                    <Instagram size={16} />
                  </a>
                )}
                {studio.urlLinkedin && (
                  <a
                    href={studio.urlLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-white/10 bg-surface hover:border-primary/40 transition-colors text-muted hover:text-foreground"
                  >
                    <Linkedin size={16} />
                  </a>
                )}
                <div className="relative">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(studio.email);
                      setEmailCopied(true);
                      setTimeout(() => setEmailCopied(false), 2000);
                    }}
                    title={studio.email}
                    className={`p-2 rounded-xl border bg-surface transition-colors ${
                      emailCopied
                        ? "border-green-500/50 text-green-400"
                        : "border-white/10 text-muted hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {emailCopied ? <Check size={16} /> : <Mail size={16} />}
                  </button>
                  {emailCopied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-medium px-2 py-1 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 whitespace-nowrap pointer-events-none">
                      Copied!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back */}
      <div className="max-w-5xl mx-auto px-6 mt-6">
        <Link
          href={`/${locale}/studios`}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft size={15} />
          {tr.studios.back}
        </Link>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 mt-6 flex flex-col gap-12">
        {/* Description */}
        <section>
          <h2 className="text-sm font-semibold text-muted uppercase tracking-widest mb-3">
            {tr.studioDetail.about}
          </h2>
          <p className="text-foreground/80 leading-relaxed max-w-2xl">
            {studio.description}
          </p>
        </section>

        {/* Games */}
        <section>
          <h2 className="text-sm font-semibold text-muted uppercase tracking-widest mb-6">
            {tr.studioDetail.games}
          </h2>
          {games === undefined ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
          ) : games.length === 0 ? (
            <p className="text-muted text-sm">{tr.studioDetail.no_games}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.map((game) => {
                const statusColor = game.status?.color ?? "hsl(240 5% 65%)";
                return (
                  <Link
                    key={game._id}
                    href={`/${locale}/games/${game.slug}`}
                    className="group relative flex flex-col rounded-2xl border border-white/10 bg-surface overflow-hidden hover:border-white/20 transition-colors"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />

                    <div className="relative w-full aspect-[16/9] bg-white/5 overflow-hidden">
                      {game.coverUrl ? (
                        <img
                          src={game.coverUrl}
                          alt={game.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-transparent to-black/40" />
                      {game.status && (
                        <span
                          className="absolute top-2 right-2 z-10 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-md"
                          style={{
                            color: statusColor,
                            background: `color-mix(in srgb, ${statusColor} 15%, rgba(0,0,0,0.45))`,
                            border: `1px solid color-mix(in srgb, ${statusColor} 30%, transparent)`,
                          }}
                        >
                          {getLocalizedName(game.status.languages, locale)}
                        </span>
                      )}
                    </div>

                    <div className="relative p-4 flex flex-col gap-1">
                      <h3 className="text-sm font-semibold text-foreground line-clamp-1">
                        {game.title}
                      </h3>
                      <p className="text-xs text-muted line-clamp-2">
                        {getLocalizedValue(game.description, locale)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
    </>
  );
}
