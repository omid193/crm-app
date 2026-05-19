// components/CreatePostForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { PostSchema, type PostInput } from "@/lib/validations/posts";

export function CreatePostForm({ onSuccess }: { onSuccess?: () => void }) {
  const [serverMessage, setServerMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostInput>({
    resolver: zodResolver(PostSchema),
  });

  const onSubmit = async (data: PostInput) => {
    setServerMessage(null);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      setServerMessage({ type: "error", text: result.error });
      return;
    }

    reset();
    onSuccess?.(); // ← صدا زدن callback برای رفرش
  };

  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register("title")}
          placeholder="عنوان شغلی"
          className="border p-2 rounded w-full"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div>
        <textarea
          {...register("description")}
          placeholder="توضیحات"
          className="border p-2 rounded w-full"
          rows={4}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div>
        <select {...register("category")} className="border p-2 rounded w-full">
          <option value="">دسته‌بندی</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="fullstack">Fullstack</option>
          <option value="devops">DevOps</option>
          <option value="mobile">Mobile</option>
          <option value="data">Data</option>
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          {...register("location")}
          placeholder="مکان (اختیاری)"
          className="border p-2 rounded"
        />
        <input
          {...register("salary")}
          placeholder="حقوق (اختیاری)"
          className="border p-2 rounded"
        />
      </div>

      {serverMessage && (
        <p
          className={`text-sm p-2 rounded ${serverMessage.type === "success" ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50"}`}
        >
          {serverMessage.text}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 w-full"
      >
        {isSubmitting ? "در حال ثبت..." : "ثبت آگهی"}
      </button>
    </form>
  );
}
