import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

export const getUser = query({
    args: {
        userId: v.string(),
    },
    handler: async (context, args) => {
        if (!args.userId) {
            throw new Error("User ID is required");
        }
        const user = await context.db.query("users")
        .withIndex("by_user_id", )
        .filter((q)=>q.eq(q.field("userId"), args.userId))
        .first();

        if (!user) {
            throw new Error("User not found");
        }
        return user;    
    },
});