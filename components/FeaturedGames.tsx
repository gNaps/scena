"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import GameCard from "./GameCard";

export default function FeaturedGames({ locale }: { locale: string }) {
  const games = useQuery(api.games.findAllFiltered, {});

  if (games === undefined) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-[300px] bg-surface border border-border rounded-[3px] animate-pulse"
          />
        ))}
      </div>
    );
  }

  const featured = games.slice(0, 6);
  if (featured.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
      {featured.map((game) => (
        <GameCard key={game._id} game={game} locale={locale} variant="full" />
      ))}
    </div>
  );
}
