// app/api/auth/signup/route.ts

import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const SignupSchema = z.object({
  name: z.string().min(2, "name have to be at leas 2character"),
  email: z.string().email("not correct"),
  password: z.string().min(6, "have be 6 character"),
});

// ساخت تایپ به صورت داینامیک از روی اسکیمایی که همینجا ساختیم
type SignupInput = z.infer<typeof SignupSchema>;

export async function POST(req: NextRequest) {
  // ایمن کردن داده ها
  try {
    const body: SignupInput = await req.json();
    const validation = SignupSchema.safeParse(body);

    // ! شرط وجود داده ها
    // if (!name || !email || !password) {
    //   return NextResponse.json({ error: "all filed are necessary" },{ status: 400 },);
    // }
    // بجای اون بالایی این رو مینویسیم :

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 },
      );
    }

    const { name, email, password } = validation.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    // شرط تکراری نبودن ایمیل
    const existingEmail = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email));

    if (existingEmail.length > 0) {
      return NextResponse.json(
        { error: "this email already exists" },
        { status: 409 },
      );
    }

    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: hashedPassword })
      .returning();

    const { password: _, ...safeUser } = newUser;

    return NextResponse.json(safeUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
// thunder client : http://localhost:3000/api/auth/signup
