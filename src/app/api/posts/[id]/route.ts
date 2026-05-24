// app/api/posts/[id]/route.ts
import { ApiResponse } from "@/src/shared/lib/api-responses";
import { db } from "@/src/shared/lib/db";
import { posts } from "@/src/shared/lib/db/schema";
import { PostSchema } from "@/src/shared/lib/validations/posts";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

interface DeleteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: DeleteParams) {
  try {
    const { id } = await params;
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return ApiResponse.unauthorized("ابتدا وارد شوید");
    }

    // ۱. پیدا کردن پست
    const [post] = await db
      .select({ authorId: posts.authorId })
      .from(posts)
      .where(eq(posts.id, Number(id)))
      .limit(1);

    if (!post) {
      return ApiResponse.notFound("پست");
    }

    // ۲. چک مالکیت (فقط صاحب پست می‌تونه حذف کنه)
    if (post.authorId !== Number(userId)) {
      return ApiResponse.forbidden("فقط صاحب آگهی می‌تونه حذفش کنه");
    }

    // ۳. حذف پست
    await db.delete(posts).where(eq(posts.id, Number(id)));

    return ApiResponse.success({ message: "آگهی با موفقیت حذف شد" });
  } catch (error) {
    return ApiResponse.serverError(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return ApiResponse.unauthorized("ابتدا وارد شوید");
    }

    // گرفتن پست برای چک مالکیت
    const [post] = await db
      .select({ authorId: posts.authorId })
      .from(posts)
      .where(eq(posts.id, Number(id)))
      .limit(1);

    if (!post) {
      return ApiResponse.notFound("پست");
    }

    if (post.authorId !== Number(userId)) {
      return ApiResponse.forbidden("فقط صاحب آگهی می‌تونه ویرایش کنه");
    }

    // اعتبارسنجی داده‌های جدید
    const body = await req.json();
    const validation = PostSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.errors[0].message;
      return ApiResponse.badRequest(firstError);
    }

    const { title, description, category, location, salary } = validation.data;

    // آپدیت پست
    const [updatedPost] = await db
      .update(posts)
      .set({
        title,
        description,
        category,
        location: location || null,
        salary: salary || null,
      })
      .where(eq(posts.id, Number(id)))
      .returning();

    return ApiResponse.success(updatedPost);
  } catch (error) {
    return ApiResponse.serverError(error);
  }
}
