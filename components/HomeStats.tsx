"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function HomeStats({ items }: { items: readonly string[] }) {
  const studios = useQuery(api.studios.findAllForMap);
  const games = useQuery(api.games.findAllFiltered, {});

  const studioCount = studios?.length ?? 0;
  const gameCount = games?.length ?? 0;
  const regionCount = studios
    ? new Set(studios.map((s) => s.region).filter(Boolean)).size
    : 0;

  const values = [studioCount, gameCount, regionCount];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3">
      {values.map((value, i) => (
        <div
          key={i}
          className="px-8 sm:px-12 py-11 border-b sm:border-b-0 sm:border-r last:border-0 border-border-soft"
        >
          <div
            className={`font-sans font-extrabold text-[56px] leading-none ${
              i === 0 ? "text-primary" : "text-text-strong"
            }`}
          >
            {value}
          </div>
          <div className="font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-muted mt-2.5">
            {items[i]}
          </div>
        </div>
      ))}
    </div>
  );
}
