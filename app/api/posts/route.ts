// app/api/posts/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "به پست‌ها خوش آمدی! 🎉" });
}
