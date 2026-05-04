// ۱. ایمپورت db که ساختیم
import { db } from "./index";
// ۲. ایمپورت جدول‌ها از schema
import { users, posts } from "./schema";

async function seed() {
  console.log("start seeding database...");

  // ۳. پاک کردن داده‌های قبلی (برای اینکه تکراری نباشه)
  await db.delete(posts);
  await db.delete(users);

  // ۴. ساختن ۳ کاربر
  const [user1] = await db
    .insert(users)
    .values({
      username: "ali",
      password: "123456",
      role: "admin",
    })
    .returning(); // ← یعنی بعد از Insert، داده ساخته شده رو بهم برگردون

  const [user2] = await db
    .insert(users)
    .values({
      username: "sara",
      password: "654321",
      role: "editor",
    })
    .returning();

  const [user3] = await db
    .insert(users)
    .values({
      username: "reza",
      password: "pass123",
      role: "editor",
    })
    .returning();

  // ۵. ساختن ۵ پست برای کاربرهای مختلف
  await db.insert(posts).values([
    { title: "اولین پست علی", content: "سلام دنیا!", userId: user1.id },
    {
      title: "دومین پست علی",
      content: "دارم SQLite یاد میگیرم",
      userId: user1.id,
    },
    { title: "پست سارا", content: "من یه ادیتور هستم", userId: user2.id },
    { title: "پست رضا", content: "Next.js خیلی جالبه", userId: user3.id },
    { title: "یه پست دیگه از علی", content: "Drizzle عالیه", userId: user1.id },
  ]);

  console.log("seed completed");
}

// ۶. اجرای تابع
seed();
