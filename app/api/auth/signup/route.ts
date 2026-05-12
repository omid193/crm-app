// app/api/auth/signup/route.ts

import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // دریزل میاد جواب رو توی یک ارایه میده که ما دی استراکچرش میکنیم
    const [a] = await db
      .insert(users)
      // دقت کن ک اینجا هارت کد و تستی داریم یوزر هارو میزنمی پس هردفه ایمیل رو عوض کن
      .values({
        name: "test name",
        email: "boss5@gmail.com",
        password: "1234",
        role: "employer",
      })
      .returning();
    console.log(a);

    return NextResponse.json(a);
  } catch (error) {
    console.log(error);
  }
}
// thunder client : http://localhost:3000/api/auth/signup
