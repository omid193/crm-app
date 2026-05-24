// src/feature/employer/components/CreatePostForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostSchema, type PostInput } from "@/src/shared/lib/validations/posts";
import { useState } from "react";

type Props = {
  onSuccess?: () => void;
};

export default function CreatePostForm({ onSuccess }: Props) {
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
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">عنوان شغلی</label>
        <input
          {...register("title")}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          placeholder="مثلاً: React Developer"
        />
        {errors.title && (
          <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">توضیحات</label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none"
          placeholder="شرح موقعیت شغلی..."
        />
        {errors.description && (
          <p className="text-red-400 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">دسته‌بندی</label>
        <select
          {...register("category")}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
        >
          <option value="" className="bg-gray-800">
            انتخاب کنید...
          </option>
          <option value="frontend" className="bg-gray-800">
            Frontend
          </option>
          <option value="backend" className="bg-gray-800">
            Backend
          </option>
          <option value="fullstack" className="bg-gray-800">
            Fullstack
          </option>
          <option value="devops" className="bg-gray-800">
            DevOps
          </option>
          <option value="mobile" className="bg-gray-800">
            Mobile
          </option>
          <option value="data" className="bg-gray-800">
            Data
          </option>
        </select>
        {errors.category && (
          <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>
        )}
      </div>

      {/* Location & Salary */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            مکان (اختیاری)
          </label>
          <input
            {...register("location")}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            placeholder="مثلاً: تهران"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            حقوق (اختیاری)
          </label>
          <input
            {...register("salary")}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            placeholder="مثلاً: ۲۰-۳۰ میلیون"
          />
        </div>
      </div>

      {/* Server Message */}
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

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
      >
        {isSubmitting ? "در حال ثبت..." : "ثبت آگهی"}
      </button>
    </form>
  );
}
