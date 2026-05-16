// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  console.log(token);

  if (!token) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  // اگه Token بود = بذار ادامه بده
  return NextResponse.next();
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
