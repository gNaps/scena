"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getLocalizedName, getLocalizedValue, t } from "@/lib/i18n";
import { usePaginatedQuery, useQuery } from "convex/react";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import MultiSelectDropdown, { DropdownOption } from "./MultiSelectDropdown";

const ITEMS_PER_PAGE = 20;

export default function GamesList({ locale }: { locale: string }) {
  const tr = t(locale);
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [statusIds, setStatusIds] = useState<string[]>([]);
  const [genreIds, setGenreIds] = useState<string[]>([]);
  const [studioIds, setStudioIds] = useState<string[]>([]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearch(inputValue.trim()), 400);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Dropdown options
  const statuses = useQuery(api.statuses.findAll) ?? [];
  const genres = useQuery(api.genres.findAll) ?? [];
  const studios = useQuery(api.studios.findAllForMap) ?? [];

  const statusOptions: DropdownOption[] = statuses.map((s) => ({
    id: s._id,
    label: getLocalizedName(s.languages, locale),
    color: s.color,
  }));
  const genreOptions: DropdownOption[] = genres.map((g) => ({
    id: g._id,
    label: getLocalizedName(g.languages, locale),
  }));
  const studioOptions: DropdownOption[] = studios.map((s) => ({
    id: s._id,
    label: s.name,
  }));

  const hasFilters = statusIds.length > 0 || genreIds.length > 0 || studioIds.length > 0;

  // Filtered query (no pagination)
  const filteredResults = useQuery(
    api.games.findAllFiltered,
    hasFilters
      ? {
          search: search || undefined,
          statusIds: statusIds as Id<"statuses">[],
          genreIds: genreIds as Id<"genres">[],
          studioIds: studioIds as Id<"studios">[],
        }
      : "skip"
  );

  // Paginated query (no filters)
  const { results: paginatedResults, status: paginatedStatus, loadMore } = usePaginatedQuery(
    api.games.findAll,
    { search: search || undefined },
    { initialNumItems: ITEMS_PER_PAGE }
  );

  const results = hasFilters ? (filteredResults ?? []) : paginatedResults;
  const isLoading = hasFilters ? filteredResults === undefined : paginatedStatus === "LoadingFirstPage";

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (hasFilters) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && paginatedStatus === "CanLoadMore") {
          loadMore(ITEMS_PER_PAGE);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasFilters, paginatedStatus, loadMore]);

  return (
    <div>
      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 mb-8">
        <div className="relative w-full sm:flex-1 sm:min-w-[200px] sm:max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={tr.games.search}
            className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <MultiSelectDropdown label={tr.games.filter_status} options={statusOptions} selected={statusIds} onChange={setStatusIds} />
          <MultiSelectDropdown label={tr.games.filter_genre} options={genreOptions} selected={genreIds} onChange={setGenreIds} />
          <MultiSelectDropdown label={tr.games.filter_studio} options={studioOptions} selected={studioIds} onChange={setStudioIds} />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((game) => (
              <Link
                key={game._id}
                href={`/${locale}/games/${game.slug}`}
                className="group relative flex flex-col rounded-2xl border border-white/10 bg-surface overflow-hidden hover:border-white/20 transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

                {/* Cover */}
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
                  {game.status && (() => {
                    const c = game.status.color ?? "hsl(240 5% 65%)";
                    return (
                      <span
                        className="absolute top-2 right-2 z-10 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-md"
                        style={{
                          color: c,
                          background: `color-mix(in srgb, ${c} 15%, rgba(0,0,0,0.45))`,
                          border: `1px solid color-mix(in srgb, ${c} 30%, transparent)`,
                          boxShadow: `0 0 12px color-mix(in srgb, ${c} 20%, transparent)`,
                        }}
                      >
                        {getLocalizedName(game.status.languages, locale)}
                      </span>
                    );
                  })()}
                </div>

                {/* Content */}
                <div className="relative flex-1 flex flex-col gap-2 p-5">
                  <div>
                    <h2 className="text-base font-semibold text-foreground line-clamp-1">
                      {game.title}
                    </h2>
                    {game.studio && (
                      <p className="text-xs text-muted/60 mt-0.5">{game.studio.name}</p>
                    )}
                  </div>

                  <p className="text-sm text-muted line-clamp-2">
                    {getLocalizedValue(game.description, locale)}
                  </p>

                  {game.platforms.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {game.platforms.map((platform) => (
                        <span key={platform._id} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted">
                          {platform.key}
                        </span>
                      ))}
                    </div>
                  )}

                  {game.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {game.genres.map((genre) => (
                        <span key={genre._id} className="text-xs px-2 py-0.5 rounded-full border border-primary/20 text-primary/70">
                          {getLocalizedName(genre.languages, locale)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {!hasFilters && paginatedStatus === "LoadingMore" && (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
          )}

          <div ref={sentinelRef} className="h-1" />

          {results.length === 0 && (
            <p className="text-center text-muted py-16">{tr.games.empty}</p>
          )}
        </>
      )}
    </div>
  );
}
