import { db } from "@/db";
import Link from "next/link";

export default async function HomePage() {
  const allPosts = await db.select().from(posts);

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">📝 بلاگ ساده</h1>

      <div className="grid gap-4">
        {allPosts.map((post: any) => (
          <Link
            key={post.id}
            href={`/blog/${post.id}`}
            className="block p-6 border rounded-lg hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-semibold">{post.title}</h2>
            <p className="text-gray-500 mt-2">
              {new Date(post.createdAt).toLocaleDateString("fa-IR")}
            </p>
          </Link>
        ))}

        {allPosts.length === 0 && (
          <p className="text-gray-500">هنوز مقاله‌ای نوشته نشده!</p>
        )}
      </div>
    </main>
  );
}
