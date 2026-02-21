import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  }
})

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    const existing = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("name"), name))
      .first();

    if (existing) {
      return { status: "exists", user: existing };
    }

    const id = await ctx.db.insert("users", { name });
    const user = await ctx.db.get(id);

    return { status: "created", user };
  },
});