import { db } from "@/src/shared/lib/db";
import { posts, users } from "@/src/shared/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PostsDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await db
    .select({
      id: posts.id,
      title: posts.title,
      description: posts.description,
      category: posts.category,
      location: posts.location,
      salary: posts.salary,
      createAt: posts.createdAt,
      author: users.name,
      authorEmail: users.email,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id)) // توی جدول یوزر ، جایی که (یوزر ای دی) برابر با (پست اوتر ای دی) بود
    .where(eq(posts.id, Number(id)))
    .limit(1);

  if (data.length === 0) {
    notFound();
  }

  const post = data[0];

  console.log(post, await params);
  return (
    <main className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-3xl mx-auto">
        {/* دکمه برگشت */}
        <Link
          href="/posts"
          className="text-blue-400 hover:text-blue-300 mb-4 inline-block transition-colors"
        >
          ← همه آگهی‌ها
        </Link>

        {/* کارت اصلی */}
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-xl shadow-black/20">
          <h1 className="text-3xl font-bold mb-4 text-gray-100">
            {post.title}
          </h1>

          {/* متا دیتا */}
          <div className="flex gap-4 mb-6 text-gray-400 text-sm flex-wrap">
            <span className="bg-blue-900/40 text-blue-300 border border-blue-800 px-3 py-1 rounded-full">
              {post.category}
            </span>
            {post.location && <span>📍 {post.location}</span>}
            {post.salary && <span>💰 {post.salary}</span>}
          </div>

          {/* توضیحات */}
          <div className="prose prose-invert max-w-none mb-8 text-gray-300">
            <p>{post.description}</p>
          </div>

          {/* اطلاعات کارفرما */}
          <div className="border-t border-gray-800 pt-4 text-sm text-gray-500">
            <p>
              منتشر شده توسط:{" "}
              <span className="text-gray-400">{post.author}</span>
            </p>
            {post.createAt && (
              <p>
                تاریخ: {new Date(post.createAt).toLocaleDateString("fa-IR")}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
