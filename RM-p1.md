```markdown
# SQLite + Drizzle + Next.js — راهنمای سریع

## نصب

```bash
npm install @libsql/client drizzle-orm
npm install -D drizzle-kit tsx
```

## ساختار پروژه

```
src/db/
  schema.ts   ← تعریف جدول‌ها
  index.ts    ← اتصال به دیتابیس
  seed.ts     ← داده تستی
.env.local    ← DATABASE_URL=file:local.db
drizzle.config.ts
```

## ۱. Schema (تعریف جدول)

```ts
// src/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  role: text('role', { enum: ['admin', 'editor'] }).default('editor'),
})
```

| متد | معنی | معادل Payload |
|-----|------|---------------|
| `sqliteTable('name', {})` | ساخت جدول | `CollectionConfig` |
| `text().notNull()` | متن اجباری | `{ type: 'text', required: true }` |
| `.unique()` | مقدار یکتا | `{ unique: true }` |
| `.default(x)` | مقدار پیش‌فرض | `{ defaultValue: x }` |
| `.references(() => parent.id)` | کلید خارجی | `{ type: 'relationship', relationTo: 'parent' }` |
| `{ enum: [...] }` | مقادیر محدود | `{ type: 'select', options: [...] }` |

## ۲. اتصال

```ts
// src/db/index.ts
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

const client = createClient({
  url: process.env.DATABASE_URL ?? 'file:local.db',
})

export const db = drizzle(client, { schema })
```

## ۳. تنظیمات Drizzle Kit

```ts
// drizzle.config.ts
import type { Config } from 'drizzle-kit'

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: { url: 'local.db' },
} satisfies Config
```

## ۴. اسکریپت‌ها

```json
{
  "db:push": "drizzle-kit push",
  "db:generate": "drizzle-kit generate",
  "db:studio": "drizzle-kit studio",
  "seed": "npx tsx src/db/seed.ts"
}
```

## ۵. عملیات اصلی (CRUD)

```ts
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

// READ همه
const all = await db.select().from(users)

// READ یکی
const [user] = await db.select().from(users).where(eq(users.id, 5))

// CREATE
const [newUser] = await db.insert(users).values({ username: 'ali' }).returning()

// UPDATE
await db.update(users).set({ role: 'admin' }).where(eq(users.id, 5))

// DELETE
await db.delete(users).where(eq(users.id, 5))
```

| عملگر | معنی |
|-------|------|
| `eq(a, b)` | a = b |
| `ne(a, b)` | a != b |
| `gt(a, b)` | a > b |
| `lt(a, b)` | a < b |

## ۶. API Route نمونه

```ts
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'

export async function GET() {
  const data = await db.select().from(users)
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const [user] = await db.insert(users).values(body).returning()
  return NextResponse.json(user, { status: 201 })
}
```

## ۷. Server Component

```tsx
// app/page.tsx
import { db } from '@/db'
import { users } from '@/db/schema'

export default async function Page() {
  const allUsers = await db.select().from(users)
  return <div>{allUsers.map(u => <p key={u.id}>{u.username}</p>)}</div>
}
```

## ۸. مقایسه با Payload

| Drizzle | Payload |
|---------|---------|
| `sqliteTable(...)` | `CollectionConfig` |
| `db.select().from(x)` | `payload.find({ collection: x })` |
| `db.insert(x).values(y)` | `payload.create({ collection: x, data: y })` |
| `db.update(x).set(y).where(...)` | `payload.update({ collection: x, id, data: y })` |
| `db.delete(x).where(...)` | `payload.delete({ collection: x, id })` |
| API Route دستی | خودکار |
| Auth دستی | `auth: true` |

## ۹. کامندهای پرکاربرد

```bash
npm run db:push        # Schema رو مستقیم روی دیتابیس اعمال کن
npm run db:generate    # فایل مایگریشن بساز
npm run db:studio      # پنل بصری دیتابیس
npm run seed           # داده تستی بریز
```

## ۱۰. نکات کلیدی

- **`.returning()`** — بعد از Insert/Update، رکورد ساخته شده رو برگردون
- **`.toISOString()`** — تاریخ رو توی SQLite به صورت string ذخیره کن
- **`process.env.DATABASE_URL ?? 'file:local.db'`** — مسیر دیتابیس رو از متغیر محیطی بخون، در غیر این صورت local.db
- **پاک کردن دیتابیس** = حذف فایل `local.db` + اجرای دوباره `db:push` + `seed`
- **Server Component** می‌تونه async باشه و مستقیم کوئری بزنه. نیازی به useEffect نیست
```