// lib/validations/auth.ts
import { z } from "zod";

// Schema برای Signup
export const SignupSchema = z.object({
  name: z
    .string({ required_error: "name required " })
    .min(2, "name have to be at least 2 characters"),
  email: z
    .string({ required_error: "email required " })
    .email("email is not correct"),
  password: z
    .string({ required_error: "email required " })
    .min(6, "password have be 6 characters"),
});

// Schema برای Login (فیلدهای کمتری داره)
export const SigninSchema = z.object({
  email: z
    .string({ required_error: "email required " })
    .email("email is not correct"),
  password: z
    .string({ required_error: "password required " })
    .min(6, "password have be 6 characters"),
});

// تایپ‌ها - مستقیم از Schema استخراج می‌شن
export type SignupInput = z.infer<typeof SignupSchema>;
export type SigninInput = z.infer<typeof SigninSchema>;
