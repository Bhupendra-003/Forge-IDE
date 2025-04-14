import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const syncUser = mutation({
    args: {
        userId: v.string(),
        email: v.string(),
        name: v.string(),
    },
    handler: async (context, args) => {
        // Trying to find user by userId
        const existingUser = await context.db
            .query("users")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .first();

        // Trying to create user if not exists
        if (!existingUser) {
            await context.db.insert("users", {
                userId: args.userId,
                email: args.email,
                name: args.name,
                isPro: false,
            });
        }
    },
});