import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { PendingApprovals } from "@/components/admin/PendingApprovals";
import { UsersTable } from "@/components/admin/UsersTable";
import { CoursesSection } from "@/components/admin/CoursesSection";

export default async function AdminPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const rawRole =
    (user.publicMetadata.role as string | undefined) ??
    (user.unsafeMetadata?.role as string | undefined) ??
    null;
  const role = rawRole ? String(rawRole).toLowerCase().trim() : null;

  if (role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <section className="min-h-screen bg-bg py-12 px-4 sm:px-6 md:px-10 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            Admin Control Center
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-text-secondary sm:text-base">
            Review enrollment requests, manage courses, and monitor learner
            progress across UltimaSpark Academy.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[2fr,3fr]">
          <Card className="border border-border bg-surface shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary">
                Pending Approvals
              </CardTitle>
              <CardDescription className="text-text-secondary">
                Approve or reject enrollment requests across all courses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PendingApprovals />
            </CardContent>
          </Card>

          <Card className="border border-border bg-surface shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary">Courses</CardTitle>
              <CardDescription className="text-text-secondary">
                Create, edit, or delete courses and see enrollment counts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CoursesSection />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
          <Card className="border border-border bg-surface shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary">Users</CardTitle>
              <CardDescription className="text-text-secondary">
                Search, inspect, and manage learner enrollments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTable />
            </CardContent>
          </Card>

          <Card className="border border-border bg-surface shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary">Testimonials</CardTitle>
              <CardDescription className="text-text-secondary">
                Review and approve learner testimonials before they appear publicly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/admin/testimonials"
                className="inline-flex items-center justify-center rounded-lg bg-growth px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-growth/90"
              >
                Manage Testimonials
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}


