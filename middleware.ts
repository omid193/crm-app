// middleware.ts
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import mainConfig from "@/lib/config";

const key = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, key);
    console.log("user", payload);

    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ error: "pleas login again" }, { status: 401 });
  }
}

// فقط این مسیرها محافظت بشن
export const config = {
  matcher: [
    "/api/posts/:path*", // همه API پست‌ها
    // "/dashboard/:path*",    // همه داشبورد
    // "/admin/:path*",        // همه ادمین
    // "/((?!api/auth|_next|favicon.ico).*)",
    // "/api/((?!auth).*)"  میشه از همه مسیر ها محافظت کن بجز اث
  ],
};
