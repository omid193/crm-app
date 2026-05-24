// app/api/auth/signup/route.ts
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/src/shared/lib/db";
import { users } from "@/src/shared/lib/db/schema";
import { ApiResponse } from "@/src/shared/lib/api-responses";
import { SignupSchema, type SignupInput } from "@/src/features/auth/validations";
import { createSession } from "@/src/features/auth/lib/jwt";

export async function POST(req: Request) {
  try {
    const body: SignupInput = await req.json();
    const validation = SignupSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      return ApiResponse.badRequest(firstError.message);
    }

    const { name, email, password, role } = validation.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingEmail = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email));

    if (existingEmail.length > 0) {
      return ApiResponse.conflict("this email already exists");
    }

    const [newUser] = await db
      .insert(users)
      .values({ name, email, role, password: hashedPassword })
      .returning();

    const { password: _, ...safeUser } = newUser;

    await createSession({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return ApiResponse.success(safeUser, 201);
  } catch (error) {
    return ApiResponse.serverError(error);
  }
}
