// ۱. ایمپورت تایپ Config
import type { Config } from "drizzle-kit";
import config from "./src/shared/lib/config";

// ۲. اکسپورت تنظیمات
export default {
  // ۳. مسیر فایل schema
  schema: "./src/shared/lib/db/schema",
  // ۴. مسیر خروجی مایگریشن‌ها
  out: "./drizzle",
  // ۵. نوع دیتابیس
  dialect: "sqlite",
  // ۶. اطلاعات اتصال به دیتابیس
  dbCredentials: {
    url: config.DATABASE_URL,
  },
} satisfies Config;
