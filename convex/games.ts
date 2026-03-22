import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { QueryCtx, query } from "./_generated/server";

async function enrichGame(ctx: QueryCtx, game: Doc<"games">) {
  const [status, genres, platforms] = await Promise.all([
    ctx.db.get(game.status),
    Promise.all(game.genres.map((id) => ctx.db.get(id))),
    Promise.all(game.platforms.map((id) => ctx.db.get(id))),
  ]);

  return {
    ...game,
    status,
    genres: genres.filter((g) => g !== null),
    platforms: platforms.filter((p) => p !== null),
  };
}

export const findAll = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const result = await ctx.db.query("games").paginate(args.paginationOpts);
    const enriched = await Promise.all(result.page.map((game) => enrichGame(ctx, game)));
    return { ...result, page: enriched };
  },
});

export const findOne = query({
  args: { id: v.id("games") },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.id);
    if (!game) return null;
    return enrichGame(ctx, game);
  },
});
