import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const profiles = sqliteTable("profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }).unique(),
  bio: text("bio"),

  userId: integer("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));
