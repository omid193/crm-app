import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { customers } from "@/db/schema"
import { eq } from "drizzle-orm"

// 📤 POST - ایجاد مشتری جدید
export async function POST(req: NextRequest) {
  try {
    // ۱. گرفتن داده از body (همیشه await کن)
    const body = await req.json()
    
    // ۲. اعتبارسنجی ساده
    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json(
        { 
          status: "failed", 
          message: "نام، نام خانوادگی و ایمیل الزامی هستند" 
        },
        { status: 400 }
      )
    }

    // ۳. چک کردن ایمیل تکراری
    const existingCustomer = await db
      .select()
      .from(customers)
      .where(eq(customers.email, body.email))
      .limit(1)

    if (existingCustomer.length > 0) {
      return NextResponse.json(
        { 
          status: "failed", 
          message: "این ایمیل قبلاً ثبت شده است" 
        },
        { status: 409 }
      )
    }

    // ۴. ایجاد مشتری جدید
    const newCustomer = await db
      .insert(customers)
      .values({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone || null,
        company: body.company || null,
        status: body.status || "lead",
        source: body.source || "other",
        notes: body.notes || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning() // مهم: برای برگردوندن داده ذخیره شده

    // ۵. برگردوندن پاسخ موفق
    return NextResponse.json(
      {
        status: "success",
        message: "مشتری با موفقیت ثبت شد",
        data: newCustomer[0]
      },
      { status: 201 } // 201 Created
    )

  } catch (error) {
    // ۶. مدیریت خطا
    console.error("Error creating customer:", error)
    
    return NextResponse.json(
      {
        status: "failed",
        message: "خطا در ثبت مشتری",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// 📥 GET - گرفتن لیست مشتریان
export async function GET(req: NextRequest) {
  try {
    // گرفتن query parameters (برای فیلتر)
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")

    let allCustomers

    if (status) {
      // فیلتر بر اساس وضعیت
      allCustomers = await db
        .select()
        .from(customers)
        .where(eq(customers.status, status))
    } else {
      // همه مشتریان
      allCustomers = await db
        .select()
        .from(customers)
        .orderBy(customers.createdAt)
    }

    return NextResponse.json({
      status: "success",
      data: allCustomers,
      total: allCustomers.length
    })

  } catch (error) {
    console.error("Error fetching customers:", error)
    
    return NextResponse.json(
      {
        status: "failed",
        message: "خطا در دریافت مشتریان"
      },
      { status: 500 }
    )
  }
}