// src/feature/employer/components/EditPostButton.tsx
"use client";

import { useState } from "react";
import EditPostForm from "./EditPostForm";
import type { posts } from "@/src/shared/lib/db/schema";

type Post = typeof posts.$inferSelect;

type Props = {
  post: Post;
};

export default function EditPostButton({ post }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 border border-blue-800 hover:border-blue-700 px-3 py-1 rounded-lg text-sm transition-colors"
      >
        ویرایش
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-200">ویرایش آگهی</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-300 text-xl"
              >
                ✕
              </button>
            </div>
            <EditPostForm post={post} onSuccess={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}