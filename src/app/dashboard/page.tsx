import { auth, clerkClient } from "@clerk/nextjs/server";
import { userHasAdminRole } from "@/lib/admin-role";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TopicCompleteButton } from "@/components/TopicCompleteButton";
import { TopicQuiz } from "@/components/TopicQuiz";
import { TopicNotes } from "@/components/TopicNotes";
import {
  resolveTopicQuizContent,
  topicQuizStorageKey,
} from "@/lib/topic-quiz-shared";
import {
  topicNoteKey,
  topicVideoNoteKey,
} from "@/lib/topic-notes-keys";

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

  const progress =
    (user.publicMetadata.progress as
      | Record<
          string,
          {
            completedWeeks?: number[];
            completedTopics?: string[];
            quizzes?: Record<string, { passed: boolean; score?: number }>;
            topicNotes?: Record<string, string>;
          }
        >
      | undefined) ?? {};

  const enrollmentDates =
    (user.publicMetadata.enrollmentDates as
      | Record<string, string>
      | undefined) ?? {};

  const enrollmentTypes =
    (user.publicMetadata.enrollmentTypes as
      | Record<string, "subscription" | "cohort">
      | undefined) ?? {};
  const cohortAssignments =
    (user.publicMetadata.cohortAssignments as Record<string, string> | undefined) ?? {};

  const liveSessionVideos =
    (user.publicMetadata.liveSessionVideos as
      | Record<
          string,
          Record<string, Record<string, string[] | Record<string, string[]>>>
        >
      | undefined) ?? {};

  const claimedCertificates =
    (user.publicMetadata.claimedCertificates as string[] | undefined) ?? [];

  const isAdmin = userHasAdminRole(user);

  const allCourses = await getCourses();

  const baseCourseConfigs = isAdmin
    ? allCourses
    : allCourses.filter((c) => enrolledCourses.includes(c.slug));

  const hasAnyCourses = baseCourseConfigs.length > 0;

  const subscriptionCourses = baseCourseConfigs.filter(
    (c) => isAdmin || (enrollmentTypes[c.slug] ?? "subscription") === "subscription",
  );
  const cohortCourses = baseCourseConfigs.filter(
    (c) => isAdmin || enrollmentTypes[c.slug] === "cohort",
  );

  const isWeekUnlocked = (
    courseSlug: string,
    week: number,
    courseWeeks: { topics?: { id: string }[] }[] = [],
  ) => {
    if (isAdmin) return true;
    if (week === 1) return true;

    const completedTopicIds = progress[courseSlug]?.completedTopics ?? [];
    const prevWeek = courseWeeks[week - 2];
    const prevWeekTopics = prevWeek?.topics ?? [];
    const prevTopicsComplete =
      prevWeekTopics.length > 0 &&
      prevWeekTopics.every((t) => completedTopicIds.includes(t.id));
    if (prevTopicsComplete) return true;

    const enrolledAtIso = enrollmentDates[courseSlug];
    if (!enrolledAtIso) return false;
    const enrolledAt = new Date(enrolledAtIso);
    const daysSince = differenceInCalendarDays(new Date(), enrolledAt);
    const requiredDays = (week - 1) * 7;
    return daysSince >= requiredDays;
  };

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
                {baseCourseConfigs.map((course) => {
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
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-primary">My Courses</h2>

            {!hasAnyCourses ? (
              <p className="mt-2 text-sm text-text-secondary sm:text-base">
                No courses enrolled yet. <a href="/courses" className="font-medium text-primary hover:text-spark">Browse courses</a> to get started.
              </p>
            ) : (
              <>
                {subscriptionCourses.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-spark">
                      Pre-Recorded Library
                    </h3>
                    {subscriptionCourses.map((course) => {
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
                      const weeks = course.weeksDetail ?? [];

                      return (
                        <div
                          key={`subscription-${course.slug}`}
                          className="rounded-xl border border-border bg-surface p-6 shadow-sm"
                        >
                          <h4 className="text-xl font-semibold text-primary">
                            {course.title} Library
                          </h4>
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

                          <Accordion className="mt-4 space-y-2">
                            {weeks.map((week, weekIndex) => {
                              const weekNumber = weekIndex + 1;
                              const unlocked = isWeekUnlocked(
                                course.slug,
                                weekNumber,
                                weeks,
                              );
                              const topics = week.topics ?? [];

                              return (
                                <AccordionItem
                                  key={`${course.slug}-sub-week-${weekNumber}`}
                                  value={`${course.slug}-sub-week-${weekNumber}`}
                                >
                                  <AccordionTrigger className="text-left text-sm font-semibold text-primary">
                                    Week {weekNumber}: {week.title}
                                  </AccordionTrigger>
                                  <AccordionContent className="space-y-3">
                                    {!unlocked ? (
                                      <div className="space-y-2 rounded-lg border border-dashed border-border bg-bg/40 p-4 text-xs text-text-secondary">
                                        <p className="flex items-center gap-2 font-medium text-text-primary">
                                          <Lock className="h-4 w-4 text-text-secondary" />
                                          <span>Week {weekNumber} is locked</span>
                                        </p>
                                        <p>
                                          Complete previous topics or wait for drip unlock to access this week.
                                        </p>
                                      </div>
                                    ) : (
                                      topics.map((topic) => (
                                        <div
                                          key={topic.id}
                                          className="rounded-lg border border-border bg-surface p-4 shadow-sm"
                                        >
                                          <div className="flex items-center justify-between gap-3">
                                            <p className="text-sm font-medium text-text-primary">
                                              {topic.title}
                                            </p>
                                            <TopicCompleteButton
                                              courseSlug={course.slug}
                                              itemId={topic.id}
                                              type="topic"
                                            />
                                          </div>

                                          {topic.videoId ? (
                                            <>
                                              <div className="mt-3 aspect-video overflow-hidden rounded-lg border border-border shadow-sm">
                                                <iframe
                                                  width="100%"
                                                  height="100%"
                                                  src={`https://www.youtube.com/embed/${topic.videoId}?rel=0`}
                                                  title={`${course.title} - ${topic.title}`}
                                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                  allowFullScreen
                                                  className="h-full w-full"
                                                />
                                              </div>
                                              {course.topicInstructorNotes?.[topic.id] ? (
                                                <div className="mt-3 rounded-lg border border-spark/25 bg-spark/5 p-3">
                                                  <p className="text-xs font-semibold uppercase tracking-wide text-spark">
                                                    From your instructor
                                                  </p>
                                                  <p className="mt-2 whitespace-pre-wrap text-sm text-text-primary">
                                                    {course.topicInstructorNotes[topic.id]}
                                                  </p>
                                                </div>
                                              ) : null}
                                              <TopicNotes
                                                courseSlug={course.slug}
                                                noteKey={topicNoteKey(topic.id)}
                                                initialNote={
                                                  courseProgress?.topicNotes?.[
                                                    topicNoteKey(topic.id)
                                                  ] ?? ""
                                                }
                                              />
                                            </>
                                          ) : (
                                            <p className="mt-3 rounded-md border border-dashed border-border bg-bg/40 px-3 py-2 text-xs text-text-secondary">
                                              Video coming soon for this topic.
                                            </p>
                                          )}
                                          <TopicQuiz
                                            courseSlug={course.slug}
                                            topicId={topic.id}
                                            content={resolveTopicQuizContent(
                                              topic,
                                            )}
                                            passed={
                                              courseProgress?.quizzes?.[
                                                topicQuizStorageKey(topic.id)
                                              ]?.passed ?? false
                                            }
                                          />
                                        </div>
                                      ))
                                    )}
                                  </AccordionContent>
                                </AccordionItem>
                              );
                            })}
                          </Accordion>
                        </div>
                      );
                    })}
                  </div>
                )}

                {cohortCourses.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
                      Live Session Recordings
                    </h3>
                    {cohortCourses.map((course) => {
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
                      const weeks = course.weeksDetail ?? [];
                      const courseCohortsFromCourse = course.cohortLiveVideos ?? {};
                      const courseCohortsFromUser = liveSessionVideos[course.slug] ?? {};
                      const courseCohorts =
                        Object.keys(courseCohortsFromCourse).length > 0
                          ? courseCohortsFromCourse
                          : courseCohortsFromUser;
                      const availableCohortIds = Object.keys(courseCohorts);
                      const assignedCohortId =
                        cohortAssignments[course.slug] ??
                        (availableCohortIds.length === 1
                          ? availableCohortIds[0]
                          : isAdmin
                            ? availableCohortIds[0]
                            : undefined);
                      const liveByWeek = assignedCohortId
                        ? (courseCohorts[assignedCohortId] ?? {})
                        : {};

                      return (
                        <div
                          key={`cohort-${course.slug}`}
                          className="rounded-xl border border-border bg-surface p-6 shadow-sm"
                        >
                          <h4 className="text-xl font-semibold text-primary">
                            {course.title} Cohort Recordings
                          </h4>
                          <div className="mt-2 space-y-1">
                            <p className="text-xs font-medium uppercase tracking-wide text-growth">
                              Progress: {percent}% complete
                            </p>
                            <Progress value={percent} className="bg-bg/60">
                              <ProgressIndicator className="bg-growth" />
                            </Progress>
                          </div>

                          <Accordion className="mt-4 space-y-2">
                            {weeks.map((week, weekIndex) => {
                              const weekNumber = weekIndex + 1;
                              const weekKey = `week-${weekNumber}`;
                              const unlocked = isWeekUnlocked(
                                course.slug,
                                weekNumber,
                                weeks,
                              );
                              const topics = week.topics ?? [];
                              const weekBucket = liveByWeek[weekKey];
                              const weekVideosByTopic: Record<string, string[]> = Array.isArray(
                                weekBucket,
                              )
                                ? { __general__: weekBucket }
                                : (weekBucket ?? {});

                              return (
                                <AccordionItem
                                  key={`${course.slug}-cohort-week-${weekNumber}`}
                                  value={`${course.slug}-cohort-week-${weekNumber}`}
                                >
                                  <AccordionTrigger className="text-left text-sm font-semibold text-primary">
                                    Week {weekNumber}: {week.title}
                                  </AccordionTrigger>
                                  <AccordionContent className="space-y-3">
                                    {!unlocked ? (
                                      <div className="space-y-2 rounded-lg border border-dashed border-border bg-bg/40 p-4 text-xs text-text-secondary">
                                        <p className="flex items-center gap-2 font-medium text-text-primary">
                                          <Lock className="h-4 w-4 text-text-secondary" />
                                          <span>Week {weekNumber} is locked</span>
                                        </p>
                                        <p>
                                          Complete previous topics or wait for drip unlock to access this week.
                                        </p>
                                      </div>
                                    ) : (
                                      <>
                                        {!assignedCohortId ? (
                                          <p className="rounded-md border border-dashed border-border bg-bg/40 px-3 py-2 text-xs text-text-secondary">
                                            Waiting for cohort assignment. Your admin needs to assign you to a cohort for this course.
                                          </p>
                                        ) : (
                                          <div className="space-y-3">
                                            {topics.map((topic) => {
                                              const topicVideos = weekVideosByTopic[topic.id] ?? [];
                                              return (
                                                <div
                                                  key={`${course.slug}-${weekKey}-${topic.id}-cohort-card`}
                                                  className="rounded-lg border border-border bg-surface p-4 shadow-sm"
                                                >
                                                  <div className="flex items-center justify-between gap-3">
                                                    <p className="text-sm font-medium text-text-primary">
                                                      {topic.title}
                                                    </p>
                                                    <TopicCompleteButton
                                                      courseSlug={course.slug}
                                                      itemId={topic.id}
                                                      type="topic"
                                                    />
                                                  </div>

                                                  {course.topicInstructorNotes?.[topic.id] ? (
                                                    <div className="mt-3 rounded-lg border border-spark/25 bg-spark/5 p-3">
                                                      <p className="text-xs font-semibold uppercase tracking-wide text-spark">
                                                        From your instructor
                                                      </p>
                                                      <p className="mt-2 whitespace-pre-wrap text-sm text-text-primary">
                                                        {course.topicInstructorNotes[topic.id]}
                                                      </p>
                                                    </div>
                                                  ) : null}
                                                  {topicVideos.length > 0 ? (
                                                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                                      {topicVideos.map((videoId, idx) => {
                                                        const nk = topicVideoNoteKey(
                                                          topic.id,
                                                          videoId,
                                                        );
                                                        return (
                                                        <div
                                                          key={`${course.slug}-${weekKey}-${topic.id}-${videoId}-${idx}`}
                                                          className="space-y-1"
                                                        >
                                                          <p className="text-xs font-medium text-text-secondary">
                                                            Live session video {idx + 1}
                                                          </p>
                                                          <div className="aspect-video overflow-hidden rounded-lg border border-border shadow-sm">
                                                            <iframe
                                                              width="100%"
                                                              height="100%"
                                                              src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                                                              title={`${course.title} ${weekKey} ${topic.title} live ${idx + 1}`}
                                                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                              allowFullScreen
                                                              className="h-full w-full"
                                                            />
                                                          </div>
                                                          <TopicNotes
                                                            courseSlug={course.slug}
                                                            noteKey={nk}
                                                            initialNote={
                                                              courseProgress?.topicNotes?.[nk] ??
                                                              ""
                                                            }
                                                          />
                                                        </div>
                                                        );
                                                      })}
                                                    </div>
                                                  ) : (
                                                    <p className="mt-3 rounded-md border border-dashed border-border bg-bg/40 px-3 py-2 text-xs text-text-secondary">
                                                      Live session video will appear here after the class.
                                                    </p>
                                                  )}
                                                  <TopicQuiz
                                                    courseSlug={course.slug}
                                                    topicId={topic.id}
                                                    content={resolveTopicQuizContent(
                                                      topic,
                                                    )}
                                                    passed={
                                                      courseProgress?.quizzes?.[
                                                        topicQuizStorageKey(
                                                          topic.id,
                                                        )
                                                      ]?.passed ?? false
                                                    }
                                                  />
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </AccordionContent>
                                </AccordionItem>
                              );
                            })}
                          </Accordion>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
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
                  Get started by exploring our courses and cohorts.
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
