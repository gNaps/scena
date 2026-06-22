import { getLocalizedName, getLocalizedValue } from "@/lib/i18n";
import { accentColor, yearOf } from "@/lib/display";
import Link from "next/link";

type LangName = { code: string; name: string };

export interface GameCardData {
  _id: string;
  title: string;
  slug?: string;
  description: { code: string; value: string }[];
  releaseTime?: number;
  expectedReleaseTime?: number;
  coverUrl?: string | null;
  status?: { color?: string; languages: LangName[] } | null;
  genres: { _id: string; languages: LangName[] }[];
  platforms: { _id: string; key: string }[];
  studio?: { name: string } | null;
}

export default function GameCard({
  game,
  locale,
  variant = "compact",
}: {
  game: GameCardData;
  locale: string;
  variant?: "compact" | "full";
}) {
  const color = accentColor(game._id);
  const year = yearOf(game.releaseTime, game.expectedReleaseTime);
  const genre = game.genres[0] ? getLocalizedName(game.genres[0].languages, locale) : null;
  const platStr = game.platforms.map((p) => p.key).join(" · ");

  return (
    <Link
      href={`/${locale}/games/${game.slug}`}
      className="group block bg-surface border border-border rounded-[3px] overflow-hidden transition-colors hover:border-border-strong"
    >
      {/* Cover */}
      <div
        className={`relative bg-[#101015] flex items-end p-4 overflow-hidden ${
          variant === "full" ? "h-[172px]" : "h-[152px]"
        }`}
      >
        {game.coverUrl ? (
          <img
            src={game.coverUrl}
            alt={game.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 opacity-55"
            style={{
              background: `radial-gradient(130% 120% at 78% 0%, ${color} 0%, transparent 62%)`,
            }}
          />
        )}
        {genre && (
          <span className="relative font-mono font-bold text-[10px] tracking-[0.1em] uppercase text-white bg-black/40 px-2.5 py-1.5 rounded-[2px]">
            {genre}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-[18px]">
        <div className="flex items-baseline justify-between gap-3">
          <div className="font-sans font-bold text-[18px] leading-tight text-text-strong line-clamp-1">
            {game.title}
          </div>
          {year && <div className="font-mono text-[11px] text-muted shrink-0">{year}</div>}
        </div>

        {variant === "full" && (
          <p className="font-mono text-[12px] leading-[1.55] text-muted my-2.5 line-clamp-2">
            {getLocalizedValue(game.description, locale)}
          </p>
        )}

        <div className="flex items-center gap-2 mt-2.5">
          <span
            className="w-[7px] h-[7px] rounded-full shrink-0"
            style={{ background: color }}
          />
          {game.studio && (
            <span className="font-mono font-medium text-[11px] text-text-2 truncate">
              {game.studio.name}
            </span>
          )}
          {variant === "full" && platStr && (
            <span className="ml-auto font-mono text-[11px] text-text-dim truncate">
              {platStr}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
