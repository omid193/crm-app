// src/feature/employer/components/EditPostForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostSchema, type PostInput } from "@/src/shared/lib/validations/posts";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { posts } from "@/src/shared/lib/db/schema";

type Post = typeof posts.$inferSelect;

type Props = {
  post: Post;
  onSuccess?: () => void;
};

export default function EditPostForm({ post, onSuccess }: Props) {
  const router = useRouter();
  const [serverMessage, setServerMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostInput>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: post.title,
      description: post.description,
      category: post.category,
      location: post.location || "",
      salary: post.salary || "",
    },
  });

  const onSubmit = async (data: PostInput) => {
    setServerMessage(null);

    const res = await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      setServerMessage({ type: "error", text: result.error });
      return;
    }

    router.refresh();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">عنوان</label>
        <input
          {...register("title")}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        />
        {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">توضیحات</label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
        />
        {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">دسته‌بندی</label>
        <select
          {...register("category")}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        >
          <option value="frontend" className="bg-gray-800">Frontend</option>
          <option value="backend" className="bg-gray-800">Backend</option>
          <option value="fullstack" className="bg-gray-800">Fullstack</option>
          <option value="devops" className="bg-gray-800">DevOps</option>
          <option value="mobile" className="bg-gray-800">Mobile</option>
          <option value="data" className="bg-gray-800">Data</option>
        </select>
        {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">مکان</label>
          <input
            {...register("location")}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">حقوق</label>
          <input
            {...register("salary")}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {serverMessage && (
        <p
          className={`text-sm p-2.5 rounded-lg ${
            serverMessage.type === "success"
              ? "text-green-300 bg-green-900/30 border border-green-800"
              : "text-red-300 bg-red-900/30 border border-red-800"
          }`}
        >
          {serverMessage.text}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
      >
        {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </button>
    </form>
  );
}