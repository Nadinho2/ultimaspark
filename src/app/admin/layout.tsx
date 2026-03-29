import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { userHasAdminRole } from "@/lib/admin-role";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  if (!userHasAdminRole(user)) {
    redirect("/dashboard");
  }

  return (
    <section className="min-h-screen bg-bg py-12 px-4 sm:px-6 md:px-10 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-spark">
            UltimaSpark Academy
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            Admin
          </h1>
        </header>
        <AdminNav />
        {children}
      </div>
    </section>
  );
}
