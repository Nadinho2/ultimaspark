import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { differenceInCalendarDays } from "date-fns";
import { Progress, ProgressIndicator } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Lock } from "lucide-react";
import { CertificateDownloadButton } from "@/components/CertificateDownloadButton";
import { getCourses } from "@/lib/courses";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const displayName = user.firstName || user.username || "there";

  const enrolledCourses =
    (user.publicMetadata.enrolledCourses as string[] | undefined) ?? [];
  const hasAnyCourses = enrolledCourses.length > 0;

  const progress =
    (user.publicMetadata.progress as
      | Record<
          string,
          {
            completedWeeks?: number[];
            completedTopics?: string[];
            quizzes?: Record<string, { passed: boolean; score?: number }>;
          }
        >
      | undefined) ?? {};

  const enrollmentDates =
    (user.publicMetadata.enrollmentDates as
      | Record<string, string>
      | undefined) ?? {};

  const claimedCertificates =
    (user.publicMetadata.claimedCertificates as string[] | undefined) ?? [];

  const role = (user.publicMetadata.role as string | undefined) ?? null;
  const isAdmin = role === "admin";

  const isWeekUnlocked = (courseSlug: string, week: number) => {
    if (isAdmin) return true;
    if (week === 1) return true;

    const courseTopics =
      progress[courseSlug]?.completedTopics ?? ([] as string[]);

    const topicsPerWeek = 3;
    const requiredCompleted = (week - 1) * topicsPerWeek;
    if (courseTopics.length >= requiredCompleted) {
      return true;
    }

    const enrolledAtIso = enrollmentDates[courseSlug];
    if (!enrolledAtIso) return false;
    const enrolledAt = new Date(enrolledAtIso);
    const daysSince = differenceInCalendarDays(new Date(), enrolledAt);
    const requiredDays = (week - 1) * 7;
    return daysSince >= requiredDays;
  };

  const allCourses = await getCourses();
  const enrolledCourseConfigs = allCourses.filter((c) =>
    enrolledCourses.includes(c.slug),
  );

  return (
    <section className="min-h-screen bg-bg py-12 px-4 sm:px-6 md:px-10 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <h1 className="bg-gradient-to-r from-primary to-spark bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl lg:text-5xl">
            Welcome back, {displayName}!
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-text-secondary sm:text-base">
            Your UltimaSpark Academy dashboard. Access your enrolled courses,
            progress, and recordings here.
          </p>
        </header>

        {hasAnyCourses && (
          <section className="mb-8">
            <Card className="bg-surface border border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-primary">Progress Overview</CardTitle>
                <CardDescription className="text-text-secondary">
                  Snapshot of your progress across enrolled courses.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrolledCourseConfigs.map((course) => {
                  const courseProgress = progress[course.slug];
                  const completedTopics =
                    courseProgress?.completedTopics?.length ?? 0;
                  const totalTopics =
                    course.weeksDetail?.reduce(
                      (sum, w) => sum + (w.topics?.length ?? 0),
                      0,
                    ) ?? 0;
                  const percent =
                    totalTopics > 0
                      ? Math.min(
                          100,
                          Math.round((completedTopics / totalTopics) * 100),
                        )
                      : 0;
                  const completedWeeks =
                    courseProgress?.completedWeeks?.length ?? 0;

                  return (
                    <div key={course.slug}>
                      <div className="flex items-center justify-between text-xs font-medium text-text-secondary">
                        <span>{course.title}</span>
                        <span>{percent}% complete</span>
                      </div>
                      <Progress value={percent} className="bg-bg/60">
                        <ProgressIndicator className="bg-growth" />
                      </Progress>
                      <p className="mt-1 text-[11px] text-text-secondary">
                        Weeks completed: {completedWeeks}/{course.weeks}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </section>
        )}

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <section>
            <h2 className="text-2xl font-semibold text-primary">
              My Courses
            </h2>

            {!hasAnyCourses ? (
              <p className="mt-4 text-sm text-text-secondary sm:text-base">
                No courses enrolled yet.{" "}
                                <a
                  href="/courses"
                                  className="font-medium text-primary hover:text-spark"
                >
                  Browse courses
                </a>{" "}
                to get started.
              </p>
            ) : (
              <div className="mt-4 space-y-6">
                {enrolledCourseConfigs.map((course) => {
                  const courseProgress = progress[course.slug];
                  const completedTopics =
                    courseProgress?.completedTopics?.length ?? 0;
                  const totalTopics =
                    course.weeksDetail?.reduce(
                      (sum, w) => sum + (w.topics?.length ?? 0),
                      0,
                    ) ?? 0;
                  const percent =
                    totalTopics > 0
                      ? Math.min(
                          100,
                          Math.round((completedTopics / totalTopics) * 100),
                        )
                      : 0;
                  const hasClaimed = claimedCertificates.includes(course.slug);

                  // Fallback hardcoded videos for legacy AI/Vibe courses
                  const fallbackVideos =
                    course.slug === "ai-automation"
                      ? [
                          { week: 1, title: "Week 1: Foundations", youtubeId: "dQw4w9WgXcQ" },
                          { week: 2, title: "Week 2: Workflows", youtubeId: "dQw4w9WgXcQ" },
                          { week: 3, title: "Week 3: Language Models & Retrieval", youtubeId: "dQw4w9WgXcQ" },
                          { week: 4, title: "Week 4: Tool Integration & Agents", youtubeId: "dQw4w9WgXcQ" },
                          { week: 5, title: "Week 5: Shipping Production Automations", youtubeId: "dQw4w9WgXcQ" },
                          { week: 6, title: "Week 6: Capstone – Design & Ship", youtubeId: "dQw4w9WgXcQ" },
                        ]
                      : course.slug === "vibe-coding"
                        ? [
                            { week: 1, title: "Week 1: Vibe Fundamentals", youtubeId: "dQw4w9WgXcQ" },
                            { week: 2, title: "Week 2: Creative Systems", youtubeId: "dQw4w9WgXcQ" },
                            { week: 3, title: "Week 3: Generative Visuals", youtubeId: "dQw4w9WgXcQ" },
                            { week: 4, title: "Week 4: Interactive Vibe Interfaces", youtubeId: "dQw4w9WgXcQ" },
                            { week: 5, title: "Week 5: AI-Assisted Creation", youtubeId: "dQw4w9WgXcQ" },
                            { week: 6, title: "Week 6: Vibe Capstone", youtubeId: "dQw4w9WgXcQ" },
                          ]
                        : [];

                  const videos = (course.videos && course.videos.length > 0)
                    ? course.videos
                    : fallbackVideos;

                  return (
                    <div
                      key={course.slug}
                      className="rounded-xl border border-border bg-surface p-6 shadow-sm"
                    >
                      <h3 className="text-xl font-semibold text-primary">
                        {course.title} Recordings
                      </h3>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-growth">
                          Progress: {percent}% complete
                        </p>
                        <Progress value={percent} className="bg-bg/60">
                          <ProgressIndicator className="bg-growth" />
                        </Progress>
                        {percent >= 100 && !hasClaimed && (
                          <CertificateDownloadButton
                            userName={displayName}
                            courseName={course.title}
                            courseSlug={course.slug as unknown as string}
                          />
                        )}
                      </div>

                      {videos.length > 0 ? (
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          {videos.map(
                            (video: { week: number; title: string; youtubeId: string }) =>
                              isWeekUnlocked(course.slug, video.week) ? (
                              <div key={video.youtubeId} className="space-y-2">
                                <p className="text-sm font-medium text-text-primary">
                                  {video.title}
                                </p>
                                <div className="aspect-video overflow-hidden rounded-lg border border-border shadow-sm">
                                  <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0`}
                                    title={video.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="h-full w-full"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div
                                key={video.youtubeId}
                                className="space-y-2 rounded-lg border border-dashed border-border bg-bg/40 p-4 text-xs text-text-secondary"
                              >
                                <p className="flex items-center gap-2 font-medium text-text-primary">
                                  <Lock className="h-4 w-4 text-text-secondary" />
                                  <span>{video.title} locked</span>
                                </p>
                                <p>
                                  Complete previous weeks or wait for drip unlock to
                                  access this recording.
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <p className="mt-4 text-xs text-text-secondary">
                          No recordings configured yet for this course.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-primary">
                Quick Links
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                <li>
                  <a
                    href="/user"
                    className="transition-colors hover:text-spark"
                  >
                    Update Profile
                  </a>
                </li>
                <li>
                  <a
                    href="/settings"
                    className="transition-colors hover:text-spark"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="/courses"
                    className="transition-colors hover:text-spark"
                  >
                    Browse Courses
                  </a>
                </li>
              </ul>
            </div>

            {!hasAnyCourses && (
              <div className="rounded-xl border border-border bg-surface p-6 text-sm text-text-secondary shadow-sm">
                <p className="font-medium text-text-primary">
                  No active enrollments yet
                </p>
                <p className="mt-2">
                  Get started by exploring our flagship AI Automation and Vibe
                  Coding cohorts.
                </p>
                <a
                  href="/courses"
                  className="mt-3 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary/90"
                >
                  Browse Courses
                </a>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

