"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getLocalizedName, t } from "@/lib/i18n";
import { usePaginatedQuery, useQuery } from "convex/react";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import GameCard from "./GameCard";
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
            className="w-full bg-surface border border-border rounded-[2px] pl-10 pr-4 py-2.5 font-mono text-[13px] text-foreground placeholder:text-text-dim focus:outline-none focus:border-primary transition-colors"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[18px]">
            {results.map((game) => (
              <GameCard key={game._id} game={game} locale={locale} variant="compact" />
            ))}
          </div>

          {!hasFilters && paginatedStatus === "LoadingMore" && (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
          )}

          <div ref={sentinelRef} className="h-1" />

          {results.length === 0 && (
            <p className="text-center text-muted py-16 font-mono text-[13px]">{tr.games.empty}</p>
          )}
        </>
      )}
    </div>
  );
}
