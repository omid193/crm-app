import { loadEnvConfig } from "@next/env"; // کارش اینه که کانفیگ های دات انو رو لود میکنه

// Edge Runtime : نزدیک‌ترین سرور به کاربر ، و میدل ور هم جزو این دستس
// Node.js Runtime : سرور اصلی ، اسکریپت‌های جداگونه مثل دریزل کانفیگ
// توی اسکریپت‌های های جداگونه دات انو خودکار لود نمیشه و باید دستی لودش کنیم
// واسه همین از این روش استفاده میکنیم

const projectDir = process.cwd(); // مسیر ریشه پروژه فعلی رو برمی‌گردونه
loadEnvConfig(projectDir); // مسیر رو میدیم بهش که دات انو رو پیدا کنه

const config = {
  DATABASE_URL: process.env.DATABASE_URL ?? "file:./data.db",
  JWT_SECRET: process.env.JWT_SECRET!, // علامت تعجب یعنی مطمئنم که وجود داره
  APP_ENV: process.env.APP_ENV ?? "development",
} as const;

export default config;
