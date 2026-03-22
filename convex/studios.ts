import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

export const findAll = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    // if (identity === null) {
    //   throw new Error("Not authenticated");
    // }
    return await ctx.db.query("studios").paginate(args.paginationOpts);
  },
});

export const findAllForMap = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("studios").collect();
  },
});

export const findOne = query({
  args: { id: v.id("studios") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    // if (identity === null) {
    //   throw new Error("Not authenticated");
    // }
    return await ctx.db.get(args.id);
  },
});
