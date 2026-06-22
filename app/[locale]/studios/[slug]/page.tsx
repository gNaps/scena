"use client";

import GameCard from "@/components/GameCard";
import HomeNavbar from "@/components/HomeNavbar";
import { api } from "@/convex/_generated/api";
import { accentColor } from "@/lib/display";
import { t } from "@/lib/i18n";
import { useQuery } from "convex/react";
import { Check, Globe, Instagram, Linkedin, Mail, MapPin } from "lucide-react";
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
      <>
        <HomeNavbar locale={locale} />
        <main className="flex items-center justify-center min-h-[60vh]">
          <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </main>
      </>
    );
  }

  if (studio === null) {
    return (
      <>
        <HomeNavbar locale={locale} />
        <main className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted font-mono text-[13px]">{tr.studioDetail.notFound}</p>
        </main>
      </>
    );
  }

  const color = accentColor(studio._id);
  const region = studio.region?.replace(/-/g, " ");

  return (
    <>
      <HomeNavbar locale={locale} />
      <main>
        {/* Banner */}
        <div className="relative overflow-hidden border-b border-border-soft">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(70% 130% at 78% -20%, ${color} 0%, transparent 52%)`,
              opacity: 0.85,
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(#fff 0.8px, transparent 0.8px)",
              backgroundSize: "18px 18px",
            }}
          />
          <div className="relative max-w-[1180px] mx-auto px-6 sm:px-12 pt-10 pb-11">
            <Link
              href={`/${locale}/studios`}
              className="font-mono text-[12px] tracking-[0.06em] text-foreground/80 hover:text-foreground transition-colors"
            >
              ← {tr.studioDetail.backAll}
            </Link>
            <div className="flex items-center gap-4 mt-7 mb-3.5">
              {studio.logoUrl ? (
                <span className="w-[54px] h-[54px] rounded-full shrink-0 overflow-hidden flex items-center justify-center bg-[#101015] border border-border">
                  <img
                    src={studio.logoUrl}
                    alt={studio.name}
                    className="w-full h-full object-contain p-1.5"
                  />
                </span>
              ) : (
                <span
                  className="w-[54px] h-[54px] rounded-full shrink-0"
                  style={{ background: color }}
                />
              )}
              <div className="font-mono font-medium text-[12px] tracking-[0.14em] uppercase text-foreground flex items-center gap-1.5 capitalize">
                <MapPin size={13} />
                {[studio.location, region].filter(Boolean).join(" · ")}
              </div>
            </div>
            <h1 className="font-sans font-extrabold text-[48px] sm:text-[72px] lg:text-[84px] leading-[0.9] tracking-[-0.03em] text-text-strong">
              {studio.name}
            </h1>
            {region && (
              <div className="flex gap-2 mt-5">
                <span className="font-mono font-medium text-[11px] tracking-[0.06em] uppercase text-foreground border border-white/30 px-2.5 py-1.5 rounded-[2px] capitalize">
                  {region}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="max-w-[1180px] mx-auto px-6 sm:px-12 py-12 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-start">
          {/* Main */}
          <div>
            <h2 className="font-sans font-extrabold text-[24px] text-text-strong mb-4">
              {tr.studioDetail.heading}
            </h2>
            <p className="font-mono text-[16px] leading-[1.7] text-[#C2C2C9] whitespace-pre-line mb-10">
              {studio.description}
            </p>

            <h2 className="font-sans font-extrabold text-[24px] text-text-strong mb-5">
              {tr.studioDetail.games}
              {games && games.length > 0 ? ` · ${games.length}` : ""}
            </h2>
            {games === undefined ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              </div>
            ) : games.length === 0 ? (
              <p className="text-muted font-mono text-[13px]">{tr.studioDetail.no_games}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
                {games.map((game) => (
                  <GameCard key={game._id} game={game} locale={locale} variant="full" />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-[84px] flex flex-col gap-4">
            {/* On the map */}
            <div className="bg-surface-elevated border border-border rounded-[3px] p-[18px]">
              <div className="font-mono font-medium text-[10px] tracking-[0.14em] uppercase text-muted mb-4">
                {tr.studioDetail.onMap}
              </div>
              <div className="relative flex items-center justify-center py-6 rounded-[2px] bg-[#0b0b0f] overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage: "radial-gradient(#fff 0.8px, transparent 0.8px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <span className="relative flex items-center justify-center">
                  <span className="absolute w-9 h-9 rounded-full bg-primary/20" />
                  <span className="relative w-3.5 h-3.5 rounded-full bg-primary" />
                </span>
              </div>
              {studio.location && (
                <div className="text-center font-mono font-medium text-[11px] tracking-[0.1em] uppercase text-primary mt-3 capitalize">
                  {studio.location}
                </div>
              )}
            </div>

            {/* Info table */}
            <div className="bg-surface border border-border rounded-[3px] p-5">
              {region && (
                <InfoRow label={tr.studioDetail.info_region} value={region} capitalize />
              )}
              {studio.location && (
                <InfoRow
                  label={tr.studioDetail.info_location}
                  value={studio.location}
                  last={!studio.email}
                />
              )}
              {studio.email && (
                <div className="flex items-center justify-between gap-4 py-2.5">
                  <span className="font-mono text-[12px] text-muted shrink-0">
                    {tr.studioDetail.info_email}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(studio.email);
                      setEmailCopied(true);
                      setTimeout(() => setEmailCopied(false), 2000);
                    }}
                    className={`flex items-center gap-1.5 font-mono font-medium text-[12px] transition-colors ${
                      emailCopied ? "text-primary" : "text-foreground hover:text-primary"
                    }`}
                  >
                    {emailCopied ? <Check size={13} /> : <Mail size={13} />}
                    {emailCopied ? tr.studioDetail.copied : studio.email}
                  </button>
                </div>
              )}
            </div>

            {/* Social icons */}
            {(studio.urlInstagram || studio.urlLinkedin || studio.urlWebsite) && (
              <div className="flex items-center gap-2">
                {studio.urlInstagram && (
                  <SocialIcon href={studio.urlInstagram}>
                    <Instagram size={16} />
                  </SocialIcon>
                )}
                {studio.urlLinkedin && (
                  <SocialIcon href={studio.urlLinkedin}>
                    <Linkedin size={16} />
                  </SocialIcon>
                )}
              </div>
            )}

            {/* Website CTA */}
            {studio.urlWebsite && (
              <a
                href={studio.urlWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-[15px] rounded-[2px] bg-primary text-[#0B0B0F] font-mono font-bold text-[13px] tracking-[0.06em] uppercase transition-colors hover:bg-accent-hover"
              >
                <Globe size={15} />
                {tr.studioDetail.website} →
              </a>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

function InfoRow({
  label,
  value,
  last = false,
  capitalize = false,
}: {
  label: string;
  value: string;
  last?: boolean;
  capitalize?: boolean;
}) {
  return (
    <div
      className={`flex justify-between gap-4 py-2.5 ${
        last ? "" : "border-b border-border"
      }`}
    >
      <span className="font-mono text-[12px] text-muted shrink-0">{label}</span>
      <span
        className={`font-mono font-medium text-[12px] text-foreground text-right ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function SocialIcon({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2.5 rounded-[2px] border border-border bg-surface text-muted hover:text-foreground hover:border-border-strong transition-colors"
    >
      {children}
    </a>
  );
}
