import { query } from "./_generated/server";

export const findAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("platforms").collect();
  },
});
