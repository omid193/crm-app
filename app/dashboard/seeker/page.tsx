// app/(dashboard)/seeker/page.tsx
import { getSession } from "@/lib/auth/jwt";
import { redirect } from "next/navigation";

export default async function SeekerDashboard() {
  const session = await getSession();

  if (!session || session.role !== "jobSeeker") {
    redirect("/signin");
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">داشبورد کارجو</h1>

      {/* پروفایل */}
      <div className="bg-sky-950 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">پروفایل من</h2>
        <p className="text-gray-400">به زودی: ویرایش پروفایل</p>
      </div>

      {/* آگهی‌های موجود */}
      <div className="bg-sky-950 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">آگهی‌های شغلی</h2>
        <p className="text-gray-400">به زودی: لیست آگهی‌ها</p>
      </div>
    </main>
  );
}