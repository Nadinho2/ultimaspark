import { CoursesSection } from "@/components/admin/CoursesSection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Subscription videos",
};

export default function AdminSubscriptionPage() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-primary sm:text-2xl">
          Subscription videos
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-text-secondary sm:text-base">
          Create and edit courses, curriculum, topic videos for the pre-recorded
          library, check-in quizzes, and instructor notes.
        </p>
      </header>

      <Card className="border border-border bg-surface shadow-sm">
        <CardHeader>
          <CardTitle className="text-primary">Courses &amp; library content</CardTitle>
          <CardDescription className="text-text-secondary">
            Everything learners see under the subscription track on the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CoursesSection variant="subscription" />
        </CardContent>
      </Card>
    </div>
  );
}
