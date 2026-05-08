// src/db/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// 👤 جدول اصلی مشتریان
export const customers = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  // اطلاعات شخصی
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  company: text("company"),

  // وضعیت مشتری (enum ساده با text)
  status: text("status", {
    enum: ["lead", "active", "inactive", "archived"],
  })
    .notNull()
    .default("lead"),

  // منبع جذب (برای تحلیل ساده)
  source: text("source", {
    enum: ["website", "referral", "social_media", "event", "other"],
  }).default("other"),

  // یادداشت
  notes: text("notes"),

  // زمان‌بندی (استفاده از ISO string - روش اصولی برای SQLite)
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
  updatedAt: text("updated_at").notNull().default(new Date().toISOString()),
});

// 📝 جدول یادداشت‌های جداگانه (رابطه one-to-many)
export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),

  content: text("content").notNull(),

  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});
