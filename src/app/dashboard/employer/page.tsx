// app/(dashboard)/employer/page.tsx
import EmployerPage from "@/components/layout/EmployerPage";
import { getSession } from "@/src/shared/lib/auth/jwt";
import { db } from "@/src/shared/lib/db";
import { posts } from "@/src/shared/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function EmployerDashboard() {
  const session = await getSession();

  if (!session || session.role !== "employer") {
    redirect("/dashboard");
  }

  const userPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.authorId, session.userId))
    .orderBy(desc(posts.createdAt));

  return <EmployerPage userPosts={userPosts} userId={session.userId} />;
}
