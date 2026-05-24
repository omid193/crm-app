import { ApiResponse } from "@/src/shared/lib/api-responses";
import { db } from "@/src/shared/lib/db";
import { posts } from "@/src/shared/lib/db/schema";
import { PostInput, PostSchema } from "@/src/features/auth/validations/posts";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    const body: PostInput = await req.json();
    const validation = PostSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.errors[0].message;
      return ApiResponse.badRequest(firstError);
    }
    if (!userId) {
      return ApiResponse.unauthorized("there is no id");
    }
    const { title, description, category, location, salary } = validation.data;

    const [newPost] = await db
      .insert(posts)
      .values({
        title,
        description,
        category,
        location: location || null, // تبدیل undefined به null
        salary: salary || null, // تبدیل undefined به null
        authorId: Number(userId),
      })
      .returning();

    return ApiResponse.success(newPost, 201);
  } catch (error) {
    return ApiResponse.serverError(error);
  }
}
