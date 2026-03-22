"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useEffect, useRef } from "react";

const ITEMS_PER_PAGE = 20;

export default function StudiosList() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.studios.findAll,
    {},
    { initialNumItems: ITEMS_PER_PAGE }
  );

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && status === "CanLoadMore") {
          loadMore(ITEMS_PER_PAGE);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [status, loadMore]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {results.map((studio) => (
          <div
            key={studio._id}
            className="group relative flex flex-col rounded-2xl border border-white/10 bg-surface p-5 overflow-hidden hover:border-white/20 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex-1">
              <h2 className="text-base font-semibold text-foreground mb-1 line-clamp-1">
                {studio.name}
              </h2>
              <p className="text-xs text-muted/70 mb-2">{studio.location}</p>
              <p className="text-sm text-muted line-clamp-3">
                {studio.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {status === "LoadingMore" && (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>
      )}

      <div ref={sentinelRef} className="h-1" />

      {status === "Exhausted" && results.length === 0 && (
        <p className="text-center text-muted py-16">Nessuno studio trovato.</p>
      )}
    </div>
  );
}
