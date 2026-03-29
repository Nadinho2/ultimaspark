import Link from "next/link";
import { CoursesSection } from "@/components/admin/CoursesSection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Cohort videos",
};

export default function AdminCohortPage() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-primary sm:text-2xl">
          Cohort videos
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-text-secondary sm:text-base">
          Create cohorts per course and publish live session recordings for each
          cohort, week, and topic.
        </p>
        <p className="mt-2 text-xs text-text-secondary">
          Weeks and topics come from the course curriculum — edit those on{" "}
          <Link
            href="/admin/subscription"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Subscription videos
          </Link>
          .
        </p>
      </header>

      <Card className="border border-border bg-surface shadow-sm">
        <CardHeader>
          <CardTitle className="text-primary">Cohorts &amp; live recordings</CardTitle>
          <CardDescription className="text-text-secondary">
            Mapped to learner cohort assignments and the Live Session Recordings
            section on the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CoursesSection variant="cohort" />
        </CardContent>
      </Card>
    </div>
  );
}
