import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {
    Teacher: v.string(),
    Student: v.string(),
  },
  handler: async (ctx, { Teacher, Student }) => {
    return await ctx.db.query("teachers").filter((q) =>
      q.and(
        q.eq(q.field("Teacher"), Teacher),
        q.eq(q.field("Student"), Student)
      )
    ).collect();
  }
})

export const create = mutation({
  args: {
    Student: v.string(),
    Teacher: v.string(),
    Instruction: v.string(),
    Question: v.string(),
    Answer: v.string(),
    Score: v.number(),
    Comments: v.string(),
  },
  handler: async (ctx, { Student, Teacher, Instruction, Question, Answer, Score, Comments }) => {
    const existing = await ctx.db
    .query("teachers")
    .filter((q) =>
      q.and(
        q.eq(q.field("Teacher"), Teacher),
        q.eq(q.field("Student"), Student),
        q.eq(q.field("Instruction"), Instruction),
        q.eq(q.field("Question"), Question),
        q.eq(q.field("Answer"), Answer)
      )
    )
    .first();

    if (existing) {
      return await ctx.db.patch(existing._id, { Score, Comments }); // ✅ update score and comments
    }

    await ctx.db.insert("teachers", { Student, Teacher, Instruction, Question, Answer, Score, Comments });
  }
})