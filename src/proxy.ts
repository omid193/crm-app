// proxy.ts
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const key = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;
  const method = req.method;

  if (method === "GET") {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, key);

    if (path === "/api/posts" && method === "POST") {
      if (payload.role !== "employer") {
        return NextResponse.json(
          { error: "فقط کار فرما میتوند اگهی بگذارد" },
          { status: 403 },
        );
      }
    }

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
    return NextResponse.json({ error }, { status: 401 });
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
