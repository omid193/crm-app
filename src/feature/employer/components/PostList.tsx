// src/feature/employer/components/PostList.tsx
import type { posts } from "@/src/shared/lib/db/schema";
import DeletePostButton from "./DeletePostButton";

type Post = typeof posts.$inferSelect;

type Props = {
  posts: Post[];
};

export default function PostList({ posts: postList }: Props) {
  if (postList.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">هنوز آگهی‌ای ثبت نکردی</p>
    );
  }

  return (
    <div className="space-y-3">
      {postList.map((post) => (
        <div
          key={post.id}
          className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-gray-100 font-medium truncate">
                {post.title}
              </h3>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                <span className="bg-blue-900/40 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full text-xs">
                  {post.category}
                </span>
                {post.location && (
                  <span className="text-gray-500 text-xs">
                    📍 {post.location}
                  </span>
                )}
                {post.salary && (
                  <span className="text-gray-500 text-xs">
                    💰 {post.salary}
                  </span>
                )}
              </div>
            </div>
            <DeletePostButton postId={post.id} postTitle={post.title} />
          </div>
        </div>
      ))}
    </div>
  );
}
