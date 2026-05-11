// lib/db/schema/users.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { posts } from "./posts";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name"),
  password: text("password").notNull(),
  role: text("role", { enum: ["jobSeeker", "employer"] })
    .notNull()
    .default("jobSeeker"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// رابطه: هر کاربر چندین آگهی داره
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));
