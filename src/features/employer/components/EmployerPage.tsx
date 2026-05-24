// src/feature/employer/components/EmployerPage.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CreatePostForm from "./CreatePostForm";
import PostList from "./PostList";
import type { posts } from "@/src/shared/lib/db/schema";

type Post = typeof posts.$inferSelect;

type Props = {
  userPosts: Post[];
};

export default function EmployerPage({ userPosts }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handlePostCreated = () => {
    setMessage({ type: "success", text: "آگهی با موفقیت ثبت شد 🎉" });
    router.refresh();
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">داشبورد کارفرما</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-200 mb-4">آگهی جدید</h2>
        <CreatePostForm onSuccess={handlePostCreated} />
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg mb-6 text-sm ${
            message.type === "success"
              ? "text-green-300 bg-green-900/30 border border-green-800"
              : "text-red-300 bg-red-900/30 border border-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-200 mb-4">
          آگهی‌های من ({userPosts.length})
        </h2>
        <PostList posts={userPosts} />
      </div>
    </main>
  );
}
