// lib/config.ts : نحوه استفاده صحیح از دات انو

import { loadEnvConfig } from "@next/env"; // کارش اینه که کانفیگ های دات انو رو لود میکنه

const projectDir = process.cwd(); // مسیر ریشه پروژه فعلی رو برمی‌گردونه
loadEnvConfig(projectDir); // مسیر رو میدیم بهش که دات انو رو پیدا کنه

const config = {
  DATABASE_URL: process.env.DATABASE_URL ?? "file:./data.db",
  JWT_SECRET: process.env.JWT_SECRET!, // علامت تعجب یعنی مطمئنم که وجود داره
  APP_ENV: process.env.APP_ENV ?? "development",
};

export default config;
