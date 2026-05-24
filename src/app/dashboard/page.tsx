import { getSession } from "@/src/shared/lib/auth/jwt";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/signin");
  }
  if (session.role === "employer") {
    redirect("/dashboard/employer");
  }
  if (session.role === "jobSeeker") {
    redirect("/dashboard/seeker");
  }
  return <p>hi</p>
}
