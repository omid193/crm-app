// ۱. ایمپورت createClient از libsql
import { createClient } from "@libsql/client";
// ۲. ایمپورت drizzle از drizzle-orm
import { drizzle } from "drizzle-orm/libsql";
// ۳. ایمپورت Schema که ساختیم
import * as schema from "./schema";

// ۴. ساختن Client
const client = createClient({
  url: process.env.DATABASE_URL ?? "file:local.db", // مسیر فایل دیتابیس
});

// ۵. ساختن db با ترکیب Client و Schema
export const db = drizzle(client, { schema });
