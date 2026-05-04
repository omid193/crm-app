// ۱. ایمپورت‌های Next.js
import { NextRequest, NextResponse } from "next/server";
// ۲. ایمپورت db و جدول users
import { db } from "@/db";
import { users } from "@/db/schema";

// ۳. GET = دریافت همه کاربران
export async function GET() {
  try {
    const allUsers = await db.select().from(users);
    return NextResponse.json(allUsers);
  } catch (error) {
    return NextResponse.json(
      { error: "خطا در دریافت کاربران" },
      { status: 500 },
    );
  }
}

// ۴. POST = ساختن کاربر جدید
export async function POST(request: NextRequest) {
  try {
    // ۴-الف. خوندن Body درخواست
    const body = await request.json();

    // ۴-ب. اعتبارسنجی دستی
    if (!body.username || !body.password) {
      return NextResponse.json(
        { error: "username و password اجباری هستن" },
        { status: 400 },
      );
    }

    // ۴-ج. Insert با returning که کاربر ساخته شده رو بگیریم
    const [newUser] = await db
      .insert(users)
      .values({
        username: body.username,
        password: body.password,
        role: body.role || "editor", // اگه role نداد، editor بذار
      })
      .returning();

    // ۴-د. برگردوندن کاربر ساخته شده
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    // ۴-ه. اگه username تکراری بود (unique constraint)
    if (error.message?.includes("UNIQUE constraint failed")) {
      return NextResponse.json(
        { error: "این username قبلاً استفاده شده" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "خطا در ساخت کاربر" }, { status: 500 });
  }
}
