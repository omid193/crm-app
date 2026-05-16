// middleware.ts
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const key = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, key);

    const headers = new Headers(req.headers);
    // نام گذاری با ایکس یه جور قانونیه که این هدر رو خودمون کاستم اضافه کردیم
    headers.set("x-user-id", String(payload.userId));
    headers.set("x-user-email", String(payload.email));
    headers.set("x-user-role", String(payload.role));

    return NextResponse.next({
      // درخواست جدید
      request: {
        headers: headers, // ← Header های درخواست جدید
      },
    });
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
