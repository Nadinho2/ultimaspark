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

export const metadata = {
  title: "Students",
};

export default function AdminHomePage() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-xl font-semibold text-primary sm:text-2xl">
          Students &amp; enrollments
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-text-secondary sm:text-base">
          Review enrollment requests, manage learner enrollments, and open user
          details. Manage course videos under{" "}
          <Link
            href="/admin/subscription"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Subscription videos
          </Link>{" "}
          or{" "}
          <Link
            href="/admin/cohort"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Cohort videos
          </Link>
          .
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-border bg-surface shadow-sm">
          <CardHeader>
            <CardTitle className="text-primary">Pending Approvals</CardTitle>
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
    </div>
  );
}
