// lib/db/schema/users.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { posts } from "./posts";
import { profiles } from "./profiles";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  email: text("email").notNull().unique(),
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


// ۲. رابطه‌ها
export const usersRelations = relations(users, ({ one, many }) => ({
  // کاربر ← یک پروفایل (One-to-One)
  profile: one(profiles),

  // کاربر ← چندین پست (One-to-Many)
  posts: many(posts),
}));