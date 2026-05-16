// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  const email = req.headers.get("x-user-email");

  console.log(userId, email);

  return NextResponse.json({ message: "به پست‌ها خوش آمدی! 🎉" });
}
