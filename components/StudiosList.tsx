"use client";

import { api } from "@/convex/_generated/api";
import { t } from "@/lib/i18n";
import { usePaginatedQuery, useQuery } from "convex/react";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MultiSelectDropdown, { DropdownOption } from "./MultiSelectDropdown";
import StudioCard from "./StudioCard";

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
            className="w-full bg-surface border border-border rounded-[2px] pl-10 pr-4 py-2.5 font-mono text-[13px] text-foreground placeholder:text-text-dim focus:outline-none focus:border-primary transition-colors"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
            {results.map((studio) => (
              <StudioCard key={studio._id} studio={studio} locale={locale} />
            ))}
          </div>

          {!hasFilters && paginatedStatus === "LoadingMore" && (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
          )}

          <div ref={sentinelRef} className="h-1" />

          {results.length === 0 && (
            <p className="text-center text-muted py-16 font-mono text-[13px]">{tr.studios.empty}</p>
          )}
        </>
      )}
    </div>
  );
}
