"use client";

import { api } from "@/convex/_generated/api";
import { t } from "@/lib/i18n";
import { usePaginatedQuery, useQuery } from "convex/react";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import MultiSelectDropdown, { DropdownOption } from "./MultiSelectDropdown";

const ITEMS_PER_PAGE = 20;

const ITALIAN_REGIONS: DropdownOption[] = [
  { id: "abruzzo", label: "Abruzzo" },
  { id: "basilicata", label: "Basilicata" },
  { id: "calabria", label: "Calabria" },
  { id: "campania", label: "Campania" },
  { id: "emilia-romagna", label: "Emilia-Romagna" },
  { id: "friuli-venezia-giulia", label: "Friuli-Venezia Giulia" },
  { id: "lazio", label: "Lazio" },
  { id: "liguria", label: "Liguria" },
  { id: "lombardia", label: "Lombardia" },
  { id: "marche", label: "Marche" },
  { id: "molise", label: "Molise" },
  { id: "piemonte", label: "Piemonte" },
  { id: "puglia", label: "Puglia" },
  { id: "sardegna", label: "Sardegna" },
  { id: "sicilia", label: "Sicilia" },
  { id: "toscana", label: "Toscana" },
  { id: "trentino-alto-adige", label: "Trentino-Alto Adige" },
  { id: "umbria", label: "Umbria" },
  { id: "valle-d-aosta", label: "Valle d'Aosta" },
  { id: "veneto", label: "Veneto" },
];

export default function StudiosList({ locale }: { locale: string }) {
  const tr = t(locale);
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [regions, setRegions] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(inputValue.trim()), 400);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const hasFilters = regions.length > 0;

  const filteredResults = useQuery(
    api.studios.findAllFiltered,
    hasFilters ? { search: search || undefined, regions } : "skip"
  );

  const { results: paginatedResults, status: paginatedStatus, loadMore } = usePaginatedQuery(
    api.studios.findAll,
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
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={tr.studios.search}
            className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <MultiSelectDropdown
          label={tr.studios.filter_region}
          options={ITALIAN_REGIONS}
          selected={regions}
          onChange={setRegions}
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((studio) => (
              <Link
                key={studio._id}
                href={`/${locale}/studios/${studio.slug}`}
                className="group relative flex flex-col rounded-2xl border border-white/10 bg-surface overflow-hidden hover:border-white/20 transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

                {/* Logo */}
                <div className="relative w-full aspect-[16/9] bg-white/5 overflow-hidden">
                  {studio.logoUrl ? (
                    <img
                      src={studio.logoUrl}
                      alt={studio.name}
                      className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-transparent to-black/40" />
                  {studio.region && (
                    <span className="absolute top-2 right-2 z-10 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-md bg-black/50 border border-white/10 text-muted capitalize">
                      {studio.region.replace(/-/g, " ")}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="relative flex-1 flex flex-col gap-2 p-5">
                  <div>
                    <h2 className="text-base font-semibold text-foreground line-clamp-1">
                      {studio.name}
                    </h2>
                    {studio.location && (
                      <p className="text-xs text-muted/60 mt-0.5">{studio.location}</p>
                    )}
                  </div>
                  <p className="text-sm text-muted line-clamp-2">{studio.description}</p>
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
            <p className="text-center text-muted py-16">{tr.studios.empty}</p>
          )}
        </>
      )}
    </div>
  );
}
