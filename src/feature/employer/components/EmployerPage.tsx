"use client";

import { posts } from "@/src/shared/lib/db/schema";
import { CreatePostForm } from "./CreatePostForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Post = typeof posts.$inferSelect;

export default function EmployerPage({
  userPosts,
  userId,
}: {
  userPosts: Post[];
  userId: number;
}) {
  const router = useRouter();
  const [serverMessage, setServerMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handlePostCreated = () => {
    setServerMessage({ type: "success", text: "آگهی با موفقیت ثبت شد 🎉" });
    router.refresh();
  };

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">داشبورد کارفرما</h1>

      {/* فرم ساخت آگهی */}
      <div className="bg-sky-950 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">آگهی جدید</h2>
        <CreatePostForm onSuccess={handlePostCreated}  />
        {serverMessage && (
          <p
            className={`text-sm p-2 text-center rounded m-4 ${
              serverMessage.type === "success"
                ? "text-green-600 bg-green-50"
                : "text-red-500 bg-red-50"
            }`}
          >
            {serverMessage.text}
          </p>
        )}
      </div>

      {/* لیست آگهی‌های من */}
      <div className="bg-sky-950 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">آگهی‌های من</h2>
        {userPosts.map((item) => (
          <p key={item.id}>{item.title}</p>
        ))}
      </div>
    </main>
  );
}
