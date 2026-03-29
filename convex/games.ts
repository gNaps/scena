import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { QueryCtx, query, mutation } from "./_generated/server";

async function enrichGame(ctx: QueryCtx, game: Doc<"games">) {
  const [status, genres, platforms, studio, coverUrl, screenshotUrls] = await Promise.all([
    ctx.db.get(game.status),
    Promise.all(game.genres.map((id) => ctx.db.get(id))),
    Promise.all(game.platforms.map((id) => ctx.db.get(id))),
    ctx.db.get(game.studio),
    game.cover ? ctx.storage.getUrl(game.cover) : Promise.resolve(null),
    game.screenshots
      ? Promise.all(game.screenshots.map((id) => ctx.storage.getUrl(id)))
      : Promise.resolve([]),
  ]);

  return {
    ...game,
    status,
    genres: genres.filter((g) => g !== null),
    platforms: platforms.filter((p) => p !== null),
    studio,
    coverUrl,
    screenshotUrls: screenshotUrls.filter((u) => u !== null),
  };
}

async function searchGames(ctx: QueryCtx, search: string) {
  const matchingStudios = await ctx.db
    .query("studios")
    .withSearchIndex("search_name", (q) => q.search("name", search))
    .collect();

  const [titleGames, ...studioGameArrays] = await Promise.all([
    ctx.db
      .query("games")
      .withSearchIndex("search_title", (q) => q.search("title", search))
      .collect(),
    ...matchingStudios.map((s) =>
      ctx.db.query("games").withIndex("by_studio", (q) => q.eq("studio", s._id)).collect()
    ),
  ]);

  const seen = new Set(titleGames.map((g) => g._id));
  const extra = studioGameArrays.flat().filter((g) => !seen.has(g._id));
  return [...titleGames, ...extra];
}

export const findAll = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.search) {
      const games = await searchGames(ctx, args.search);
      const enriched = await Promise.all(games.map((g) => enrichGame(ctx, g)));
      return { page: enriched, isDone: true, continueCursor: "" };
    }

    const result = await ctx.db.query("games").paginate(args.paginationOpts);
    const enriched = await Promise.all(result.page.map((g) => enrichGame(ctx, g)));
    return { ...result, page: enriched };
  },
});

export const findAllFiltered = query({
  args: {
    search: v.optional(v.string()),
    statusIds: v.optional(v.array(v.id("statuses"))),
    genreIds: v.optional(v.array(v.id("genres"))),
    studioIds: v.optional(v.array(v.id("studios"))),
  },
  handler: async (ctx, args) => {
    const { search, statusIds = [], genreIds = [], studioIds = [] } = args;

    let games = search
      ? await searchGames(ctx, search)
      : await ctx.db.query("games").collect();

    if (statusIds.length > 0) {
      const ids = new Set(statusIds);
      games = games.filter((g) => ids.has(g.status));
    }
    if (studioIds.length > 0) {
      const ids = new Set(studioIds);
      games = games.filter((g) => ids.has(g.studio));
    }
    if (genreIds.length > 0) {
      const ids = new Set(genreIds);
      games = games.filter((g) => g.genres.some((id) => ids.has(id)));
    }

    return await Promise.all(games.map((g) => enrichGame(ctx, g)));
  },
});

export const findBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const game = await ctx.db
      .query("games")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!game) return null;
    return enrichGame(ctx, game);
  },
});

export const findByStudio = query({
  args: { studioId: v.id("studios") },
  handler: async (ctx, args) => {
    const games = await ctx.db
      .query("games")
      .withIndex("by_studio", (q) => q.eq("studio", args.studioId))
      .collect();
    return await Promise.all(games.map((g) => enrichGame(ctx, g)));
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

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
