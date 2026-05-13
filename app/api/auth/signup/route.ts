// app/api/auth/signup/route.ts
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { ApiResponse } from "@/lib/api-responses";
import { SignupSchema, type SignupInput } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body: SignupInput = await req.json();
    const validation = SignupSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      return ApiResponse.badRequest(firstError.message);
    }

    const { name, email, password } = validation.data;
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
      .values({ name, email, password: hashedPassword })
      .returning();

    const { password: _, ...safeUser } = newUser;

    return ApiResponse.success(safeUser, 201);
  } catch (error) {
    return ApiResponse.serverError(error);
  }
}
