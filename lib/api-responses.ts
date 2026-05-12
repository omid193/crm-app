// lib/api-responses.ts
import { NextResponse } from "next/server";

export const ApiResponse = {
  // 400 - کاربر داده اشتباه فرستاده
  badRequest: (message = "Bad Request") =>
    NextResponse.json({ error: message }, { status: 400 }),

  // 401 - لاگین نکرده
  unauthorized: (message = "Unauthorized") =>
    NextResponse.json({ error: message }, { status: 401 }),

  // 403 - لاگین کرده ولی دسترسی نداره
  forbidden: (message = "Forbidden") =>
    NextResponse.json({ error: message }, { status: 403 }),

  // 404 - پیدا نشد
  notFound: (resource = "Item") =>
    NextResponse.json({ error: `${resource} not found` }, { status: 404 }),

  // 409 - تداخل (مثل ایمیل تکراری)
  conflict: (message = "Already exists") =>
    NextResponse.json({ error: message }, { status: 409 }),

  // 500 - خطای سرور
  serverError: (error?: unknown) =>
    NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    ),

  // 200/201 - موفقیت
  success: <T>(data: T, status = 200) => NextResponse.json(data, { status }),
};
