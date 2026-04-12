import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { QueryCtx, mutation, query } from "./_generated/server";

async function enrichStudio(ctx: QueryCtx, studio: Doc<"studios">) {
  const logoUrl = studio.logo
    ? await ctx.storage.getUrl(studio.logo)
    : null;

  return { ...studio, logoUrl };
}

export const findAll = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.search) {
      const studios = await ctx.db
        .query("studios")
        .withSearchIndex("search_name", (q) => q.search("name", args.search!))
        .collect();
      const enriched = await Promise.all(studios.map((s) => enrichStudio(ctx, s)));
      return { page: enriched, isDone: true, continueCursor: "" };
    }

    const result = await ctx.db.query("studios").paginate(args.paginationOpts);
    const enriched = await Promise.all(result.page.map((s) => enrichStudio(ctx, s)));
    return { ...result, page: enriched };
  },
});

export const findAllFiltered = query({
  args: {
    search: v.optional(v.string()),
    regions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { search, regions = [] } = args;

    let studios = search
      ? await ctx.db
          .query("studios")
          .withSearchIndex("search_name", (q) => q.search("name", search))
          .collect()
      : await ctx.db.query("studios").collect();

    if (regions.length > 0) {
      const set = new Set(regions);
      studios = studios.filter((s) => s.region && set.has(s.region));
    }

    return await Promise.all(studios.map((s) => enrichStudio(ctx, s)));
  },
});

export const findAllForMap = query({
  args: {},
  handler: async (ctx) => {
    const studios = await ctx.db.query("studios").collect();
    return await Promise.all(studios.map((s) => enrichStudio(ctx, s)));
  },
});

export const findBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const studio = await ctx.db
      .query("studios")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!studio) return null;
    return enrichStudio(ctx, studio);
  },
});

export const findOne = query({
  args: { id: v.id("studios") },
  handler: async (ctx, args) => {
    const studio = await ctx.db.get(args.id);
    if (!studio) return null;
    return enrichStudio(ctx, studio);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
