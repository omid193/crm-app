```markdown
# SQLite + Drizzle + Next.js — راهنمای سریع

## نصب

```bash
npm install @libsql/client drizzle-orm
npm install -D drizzle-kit tsx
```
داداش، خیلی سوال خوبی پرسیدی. بیا کامل برات بازش کنم.

---

## ساختاری که دیدی چیه؟

این ساختاری که دیدی، **دقیقاً روش استاندارد Drizzle با LibSQL/Turso** هست. از `@libsql/client` به جای `better-sqlite3` استفاده می‌کنه. تفاوت اصلی‌شون اینه:

| ویژگی | `better-sqlite3` | `@libsql/client` |
|--------|------------------|------------------|
| **نوع اتصال** | مستقیم به فایل | HTTP یا فایل |
| **آینده** | فقط لوکال | لوکال + بعداً می‌تونی به Turso (ابری) وصل بشی |
| **نیاز به کامپایل** | داره (C++ bindings) | نداره (خالص JS) |
| **مناسب برای** | پروژه لوکال خالص | پروژه‌ای که بعداً می‌خواد آنلاین بشه |

---

## بررسی ساختار پوشه‌بندی

### روشی که دیدی:
```
src/lib/db/
├── db.ts          # اتصال به دیتابیس
├── schema/
│   ├── index.ts   # جمع‌آوری و خروجی گرفتن همه اسکیماها
│   └── auth.ts    # اسکیمای احراز هویت
│   └── jobs.ts    # اسکیمای آگهی‌های شغلی (بعداً اضافه میشه)
```

### روش ساده‌تری که من گفتم:
```
db/
├── index.ts       # اتصال به دیتابیس
└── schema.ts      # همه اسکیماها توی یه فایل
```

---

## کدوم روش بهتره؟

### روش ماژولار (همونی که دیدی) ✅ استاندارد حرفه‌ای
**مزایا:**
- هر بخش منطقی (Auth, Jobs, Payments) اسکیمای جدا داره
- برای پروژه‌های بزرگ عالیه
- طبق اصول **Separation of Concerns** هست
- وقتی پروژه بزرگ بشه، مدیریتش راحت‌تره
- کاملاً طبق داکیومنت Drizzle هست

**معایب:**
- برای پروژه کوچک و یادگیری شاید زیادی پیچیده باشه

### روش تک فایلی (روش ساده من) 📝 برای شروع و یادگیری
**مزایا:**
- سریع راه می‌افته
- همه چی یه جا هست، راحت می‌بینی
- برای دوره آموزشی که داری می‌بینی کافیه

**معایب:**
- وقتی ۱۰-۱۵ مدل داشته باشی، فایل شلوغ میشه
- حرفه‌ای نیست

---

## توصیه من برای دوره تو

با توجه به اینکه داری دوره Job Board رو می‌بینی، **روش ماژولار رو انتخاب کن** اما نه خیلی پیچیده. یه ساختار منطقی و تمیز:

```
lib/
└── db/
    ├── db.ts              # اتصال اصلی
    ├── schema/
    │   ├── index.ts       # جمع کردن همه
    │   ├── users.ts       # اسکیمای کاربران
    │   └── posts.ts       # اسکیمای آگهی‌های شغلی
    └── seed.ts            # داده اولیه (اختیاری)
```

---

## فایل‌های کامل برای دوره Job Board

### ۱. فایل `lib/db/db.ts` (اتصال به دیتابیس)

```typescript
// lib/db/db.ts
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const client = createClient({
  // لوکال کار می‌کنه، بعداً می‌تونی URL تورسو رو بدی
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});

export const db = drizzle(client, { schema });
```

**نکته:** این ساختار دقیقاً طبق داکیومنت رسمی Drizzle هست.

---

### ۲. فایل `lib/db/schema/users.ts` (اسکیمای کاربران)

```typescript
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
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// رابطه: هر کاربر چندین آگهی داره
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));
```

---

### ۳. فایل `lib/db/schema/posts.ts` (اسکیمای آگهی‌های شغلی)

```typescript
// lib/db/schema/posts.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category", {
    enum: ["frontend", "backend", "fullstack", "devops", "mobile", "data"],
  }).notNull(),
  location: text("location"),
  salary: text("salary"),
  authorId: integer("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// رابطه: هر آگهی متعلق به یه کاربره
export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));
```

---

### ۴. فایل `lib/db/schema/index.ts` (جمع کردن همه اسکیماها)

```typescript
// lib/db/schema/index.ts
export * from "./users";
export * from "./posts";
```

---

### ۵. فایل `.env` (تنظیمات محیطی)

```env
DATABASE_URL="file:./dev.db"
```

---

## مقایسه با روش ساده (تک فایلی)

### روش ساده (همه توی `schema.ts`):
```typescript
// db/schema.ts - همه چی یه جا
export const users = sqliteTable("users", { ... });
export const posts = sqliteTable("posts", { ... });
export const usersRelations = relations(users, ({ many }) => ({ ... }));
export const postsRelations = relations(posts, ({ one }) => ({ ... }));
```

### روش ماژولار (ساختار حرفه‌ای):
```
schema/
├── index.ts    // فقط صادرات مجدد
├── users.ts    // فقط کاربران
└── posts.ts    // فقط آگهی‌ها
```

---

## نام‌گذاری‌ها: آیا اصولی و طبق داکیومنت هست؟

**بله، کاملاً استاندارد هست:**

| چیز | نام‌گذاری | طبق داکیومنت؟ |
|-----|-----------|----------------|
| پوشه اصلی | `lib/db/` | ✅ (می‌تونه `db/` هم باشه) |
| فایل اتصال | `db.ts` | ✅ |
| پوشه اسکیماها | `schema/` | ✅ (اختیاری ولی رایجه) |
| فایل جمع‌کننده | `index.ts` | ✅ (الگوی بشکه‌ای - Barrel Export) |
| اسکیمای کاربران | `users.ts` | ✅ |
| اسکیمای آگهی‌ها | `posts.ts` | ✅ |

---

## جمع‌بندی و پیشنهاد نهایی

**برای دوره Job Board، ساختار ماژولار رو برو.** دلایل:

1. **حرفه‌ای‌تره** - یاد می‌گیری پروژه واقعی چطور سازماندهی میشه
2. **با دوره هماهنگه** - دوره هم Prisma رو با مدل‌های جداگونه یاد میده
3. **آماده برای آینده** - بعداً می‌تونی schema های payments, applications, reviews رو راحت اضافه کنی
4. **طبق اصول Drizzle** - داکیومنت رسمی هم توی پروژه‌های بزرگ این ساختار رو پیشنهاد میده

**نگران نباش**، پیچیده نیست. فقط فایل‌ها جدا شدن ولی logic همونه. هر جا که توی دوره از `prisma.user.create()` استفاده می‌کنه، تو از `db.insert(users).values()` استفاده می‌کنی.

اگه می‌خوای، می‌تونم یه **Cheat Sheet** برات درست کنم که دقیقاً بگم هر دستور Prisma توی دوره، معادلش توی Drizzle چی میشه.