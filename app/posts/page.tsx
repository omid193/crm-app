import { db } from "@/lib/db";
import Link from "next/link";

export default async function PostsArchive() {
  const allPosts = await db.query.posts.findMany({
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    with: { author: true },
  });
  return (
    <main className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-100">آگهی‌های شغلی</h1>

        <div className="grid grid-cols-2 gap-4">
          {allPosts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-gray-700 hover:bg-gray-800/50 transition-all shadow-lg shadow-black/10"
            >
              <h2 className="font-bold text-lg mb-2 text-gray-100">
                {post.title}
              </h2>

              <div className="flex gap-3 text-sm text-gray-400 flex-wrap">
                <span className="bg-blue-900/40 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full">
                  {post.category}
                </span>
                {post.location && <span>📍 {post.location}</span>}
                {post.salary && <span>💰 {post.salary}</span>}
              </div>

              <p className="text-xs text-gray-500 mt-2">
                {post.author?.name ?? "ناشناس"}
                {" - "}
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString("fa-IR")
                  : ""}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
