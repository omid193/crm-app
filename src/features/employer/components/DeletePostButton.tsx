// src/feature/employer/components/DeletePostButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  postId: number;
  postTitle: string;
};

export default function DeletePostButton({ postId, postTitle }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`آیا از حذف "${postTitle}" مطمئنی؟`)) return;

    setIsDeleting(true);

    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error || "خطا در حذف");
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-400 hover:text-red-300 hover:bg-red-900/30 border border-red-800 hover:border-red-700 px-3 py-1 rounded-lg text-sm transition-colors disabled:opacity-50"
    >
      {isDeleting ? "در حال حذف..." : "حذف"}
    </button>
  );
}
