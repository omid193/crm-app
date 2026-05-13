// lib/validations/auth.ts
import { z } from "zod";

// Schema برای Signup
export const SignupSchema = z.object({
  name: z.string().min(2, "name have to be at least 2 characters"),
  email: z.string().email("email is not correct"),
  password: z.string().min(6, "password have be 6 characters"),
});

// Schema برای Login (فیلدهای کمتری داره)
export const LoginSchema = z.object({
  email: z.string().email("email is not correct"),
  password: z.string().min(6, "password have be 6 characters"),
});

// تایپ‌ها - مستقیم از Schema استخراج می‌شن
export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
