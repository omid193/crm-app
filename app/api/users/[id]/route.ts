// ۱. ایمپورت‌ها
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// ۲. GET = دریافت یه کاربر با id خاص
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // اول با await بازش کن
    const numericId = parseInt(id);

    if (isNaN(numericId)) {
      return NextResponse.json({ error: "id باید عدد باشه" }, { status: 400 });
    }

    const result = await db.select().from(users).where(eq(users.id, numericId));

    if (result.length === 0) {
      return NextResponse.json({ error: "کاربر پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: "خطا در دریافت کاربر" }, { status: 500 });
  }
}

// ۳. DELETE = حذف یه کاربر
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "id باید عدد باشه" }, { status: 400 });
    }

    await db.delete(users).where(eq(users.id, id));

    return NextResponse.json({ message: "کاربر حذف شد" });
  } catch (error) {
    return NextResponse.json({ error: "خطا در حذف کاربر" }, { status: 500 });
  }
}

// ۴. PUT = آپدیت یه کاربر
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    if (isNaN(id)) {
      return NextResponse.json({ error: "id باید عدد باشه" }, { status: 400 });
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        username: body.username,
        password: body.password,
        role: body.role,
      })
      .where(eq(users.id, id))
      .returning();

    if (!updatedUser) {
      return NextResponse.json({ error: "کاربر پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    if (error.message?.includes("UNIQUE constraint failed")) {
      return NextResponse.json(
        { error: "این username قبلاً استفاده شده" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "خطا در آپدیت کاربر" }, { status: 500 });
  }
}
