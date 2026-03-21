"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EnrollButton } from "@/components/EnrollButton";
import type { Course } from "@/lib/courses";

type Props = {
  course: Course;
};

export function CoursePageTemplate({ course }: Props) {
  return (
    <section className="min-h-screen bg-bg py-12 px-4 sm:px-6 md:px-10 lg:px-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="space-y-6">
          <p className="inline-flex items-center rounded-full border border-spark bg-surface px-4 py-1 text-xs font-medium uppercase tracking-wide text-spark">
            {course.weeks} Weeks • Project-Based
          </p>
          <h1 className="mt-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl lg:text-5xl">
            {course.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-text-secondary sm:text-lg">
            {course.description}
          </p>
          <EnrollButton courseSlug={course.slug} />
        </header>

        <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
          <div>
            <Accordion className="mx-auto flex w-full max-w-4xl flex-col gap-3">
              {(course.weeksDetail ?? []).map((week, index) => (
                <AccordionItem key={week.title} value={`week-${index + 1}`}>
                  <AccordionTrigger className="text-left text-2xl font-semibold text-primary hover:text-spark transition py-4 px-4 sm:py-6 sm:px-6 bg-surface/50 rounded-lg data-[state=open]:bg-surface data-[state=open]:border-spark border border-transparent">
                    Week {index + 1}: {week.title}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
                    {week.summary && (
                      <p className="text-sm text-text-secondary sm:text-base">
                        {week.summary}
                      </p>
                    )}
                    <Accordion className="mt-4 space-y-2">
                      {week.topics.map((topic) => (
                        <AccordionItem
                          key={topic.id}
                          value={topic.id}
                        >
                          <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                            {topic.title}
                          </AccordionTrigger>
                          <AccordionContent className="pl-4 sm:pl-6">
                            {topic.subtopics && topic.subtopics.length > 0 && (
                              <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                                {topic.subtopics.map((subtopic) => (
                                  <li key={subtopic}>{subtopic}</li>
                                ))}
                              </ul>
                            )}
                            {topic.bullets && (
                              <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                                {topic.bullets.map((b) => (
                                  <li key={b}>{b}</li>
                                ))}
                              </ul>
                            )}
                            {topic.videoId && (
                              <a
                                href={`https://www.youtube.com/watch?v=${topic.videoId}`}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-flex items-center justify-center rounded-md border border-spark/40 bg-spark/10 px-3 py-1 text-xs font-semibold text-spark transition hover:bg-spark/20"
                              >
                                Watch Video
                              </a>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-secondary/30 bg-surface p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-secondary">
                What you’ll build
              </h2>
              <p className="mt-2 text-xs text-text-secondary">
                This course is structured as weekly projects with topic breakdowns.
                Video availability and completion are now tracked in your dashboard.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

