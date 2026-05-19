"use client";

import { SigninInput, SigninSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function SigninForm() {
  const [serverMessage, setServerMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit, // میاد قبل از اجرای سابمیت کلی کار برامون انجام میده که یکیش ولیدیشن هستش
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SigninInput>({
    resolver: zodResolver(SigninSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (serverMessage?.type === "success") {
      const timer = setTimeout(() => {
        setServerMessage(null);
        redirect("/dashboard");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [serverMessage]);

  const onSubmit = async (data: SigninInput) => {
    setServerMessage(null);

    try {
      const res = await fetch("/api/auth/signin", {
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

    setServerMessage({
      type: "success",
      message: "ورود شما با موفقیت انجام شد",
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        {isSubmitting ? "در حال ورود..." : "ورود"}
      </button>
    </form>
  );
}
