// ۱. ایمپورت تایپ Config
import type { Config } from "drizzle-kit";

// ۲. اکسپورت تنظیمات
export default {
  // ۳. مسیر فایل schema
  schema: "./lib/db/schema",
  // ۴. مسیر خروجی مایگریشن‌ها
  out: "./drizzle",
  // ۵. نوع دیتابیس
  dialect: "sqlite",
  // ۶. اطلاعات اتصال به دیتابیس
  dbCredentials: {
    url: "data.db",
  },
} satisfies Config;
