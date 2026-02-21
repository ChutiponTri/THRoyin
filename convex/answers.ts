import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: { Name: v.string() },
  handler: async (ctx, { Name }) => {
    return await ctx.db.query("answers").filter( (q) => q.eq(q.field("Name"), Name)).collect();
  } 
})

export const create = mutation({
  args: {
    Name: v.string(),
    Instruction: v.string(),
    Question: v.string(),
    Answer: v.string(),
  },
  handler: async (ctx, { Name, Instruction, Question, Answer }) => {
    const existing = await ctx.db
    .query("answers")
    .filter((q) =>
      q.and(
        q.eq(q.field("Name"), Name),
        q.eq(q.field("Instruction"), Instruction),
        q.eq(q.field("Question"), Question),
      )
    )
    .first();

    if (existing) {
      await ctx.db.patch(existing._id, { Answer }); // ✅ update answer
      return { status: "updated", answer: existing._id };
    }
    
    const id = await ctx.db.insert("answers", { Name, Instruction, Question, Answer });

    return { status: "created", answer: id };
  }
})