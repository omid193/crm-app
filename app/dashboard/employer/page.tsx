// app/(dashboard)/employer/page.tsx
import { getSession } from "@/lib/auth/jwt";
import { redirect } from "next/navigation";

export default async function EmployerDashboard() {
  const session = await getSession();

  if (!session || session.role !== "employer") {
    redirect("/dashboard");
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">داشبورد کارفرما</h1>

      {/* فرم ساخت آگهی */}
      <div className="bg-sky-950 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">آگهی جدید</h2>
        {/* فرم */}
      </div>

      {/* لیست آگهی‌های من */}
      <div className="bg-sky-950 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">آگهی‌های من</h2>
        <p className="text-gray-400">به زودی...</p>
      </div>
    </main>
  );
}
