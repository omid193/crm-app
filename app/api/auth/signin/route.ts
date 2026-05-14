import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { SigninSchema } from "@/lib/validations";
import { ApiResponse } from "@/lib/api-responses";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = SigninSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.errors[0].message;
      return ApiResponse.badRequest(firstError);
    }
    const { email, password } = validation.data;

    const foundUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (foundUser.length === 0) {
      return ApiResponse.unauthorized("email or password is invalid ");
    }
    const user = foundUser[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return ApiResponse.unauthorized("email or password is invalid ");
    }
    const { password: _, ...safeUser } = user;

    await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return ApiResponse.success(safeUser, 200);
  } catch (error) {
    console.log(error);
    return ApiResponse.serverError(error);
  }
}
