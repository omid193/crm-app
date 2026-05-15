"use client";

import { SignupInput, SignupSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function SignupForm() {
  const [serverMessage, setServerMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit, // میاد قبل از اجرای سابمیت کلی کار برامون انجام میده که یکیش ولیدیشن هستش
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (serverMessage?.type === "success") {
      const timer = setTimeout(() => {
        setServerMessage(null);
        redirect("/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [serverMessage]);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          // کاربر لاگین کرده → برو داشبورد
          redirect("/");
        }
      });
  }, []);

  const onSubmit = async (data: SignupInput) => {
    setServerMessage(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        setServerMessage({ type: "error", message: result.error });
        return;
      }
    } catch (error) {
      setServerMessage({ type: "error", message: "error in server " });
      console.log(error);
    }

    setServerMessage({ type: "success", message: "you signup successfully" });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <input
          {...register("name")}
          placeholder="اسم"
          className="border p-2 rounded w-full"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <input
          {...register("email")}
          type="email"
          placeholder="ایمیل"
          className="border p-2 rounded w-full"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <input
          {...register("password")}
          type="password"
          placeholder="رمز عبور"
          className="border p-2 rounded w-full"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      {/* Server Error */}
      {serverMessage && (
        <p
          className={`text-sm p-2 rounded ${
            serverMessage.type === "success"
              ? "text-green-600 bg-green-50"
              : "text-red-500 bg-red-50"
          }`}
        >
          {serverMessage.message}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isSubmitting ? "در حال ثبت‌نام..." : "ثبت‌نام"}
      </button>
    </form>
  );
}
