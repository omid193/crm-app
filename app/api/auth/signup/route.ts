// app/api/auth/signup/route.ts
import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { ApiResponse } from "@/lib/api-responses";

const SignupSchema = z.object({
  name: z.string().min(2, "name have to be at least 2 characters"),
  email: z.string().email("email is not correct"),
  password: z.string().min(6, "password have be 6 characters"),
});

type SignupInput = z.infer<typeof SignupSchema>;

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
