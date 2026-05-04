// ۱. ایمپورت توابع لازم از Drizzle
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// ۲. تعریف جدول users
// sqliteTable (tableName , {row1 : type("name").property()....})

// integer() & text() : نوعش ، یا عدد صحیح یا متن
// primaryKey({autoIncrement}) : کلید یکتایی که توی هر سطون داره یکی بهش اضافه میشه
// notNull : نمیتونه خالی باشه
// unique : باید یکتا باشه
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  // در قسمت دوم میتونیم یه مقدار ثابتی رو تعیین کنیم  و بعدش یه دیفالتی براش بزاریم
  role: text("role", { enum: ["admin", "editor"] }).default("editor"),
  // اگه مقداری داده نشد، زمان الان رو به صورت رشته ISO بذار.
  createdAt: text("created_at").default(new Date().toISOString()),
});

// ۳. تعریف جدول posts
export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  // ساخت روابط : داره به ستون ایدی در جدول یوزر اشاره میکنه
  userId: integer("user_id").references(() => users.id),
  createdAt: text("created_at").default(new Date().toISOString()),
});
