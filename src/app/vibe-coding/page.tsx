"use client";

import { useUser } from "@clerk/nextjs";
import { useTransition, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EnrollButton } from "@/components/EnrollButton";
import { TopicCompleteButton } from "@/components/TopicCompleteButton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { CheckCircle } from "lucide-react";
import { submitQuiz } from "@/app/actions/quiz";

const COURSE_SLUG = "vibe-coding" as const;

export default function VibeCodingPage() {
  const { user } = useUser();

  const progress =
    (user?.publicMetadata?.progress as
      | Record<string, { completedWeeks?: number[]; completedTopics?: string[] }>
      | undefined) ?? {};
  const courseProgress = progress[COURSE_SLUG] as
    | {
        completedWeeks?: number[];
        completedTopics?: string[];
        quizzes?: Record<string, { passed: boolean; score?: number }>;
      }
    | undefined;
  const completedTopics = courseProgress?.completedTopics ?? [];
  const quizzes = courseProgress?.quizzes ?? {};

  const isWeekUnlocked = (week: number) => {
    if (week === 1) return true;
    const topicsPerWeek = 3;
    const requiredCompleted = (week - 1) * topicsPerWeek;
    const hasTopics = completedTopics.length >= requiredCompleted;
    const prevWeekKey = `week-${week - 1}`;
    const prevQuiz = quizzes[prevWeekKey];
    const quizPassed = !prevQuiz || prevQuiz.passed;
    return hasTopics && quizPassed;
  };

  const [quizAnswer, setQuizAnswer] = useState<string>("");
  const [quizMessage, setQuizMessage] = useState<string | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [isQuizPending, startQuizTransition] = useTransition();

  const week1Quiz = quizzes["week-1"];

  return (
    <section className="min-h-screen bg-bg py-12 px-4 sm:px-6 md:px-10 lg:px-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="space-y-6">
          <p className="inline-flex items-center rounded-full border border-spark bg-surface px-4 py-1 text-xs font-medium uppercase tracking-wide text-spark">
            6 Weeks • Creative Coding
          </p>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            Vibe Coding Course
          </h1>
          <p className="mt-4 max-w-2xl text-base text-text-secondary sm:text-lg">
            6-week creative coding journey into generative visuals, interactive
            experiences, and vibe-driven design. Build expressive, next-gen interfaces.
          </p>
          <EnrollButton courseSlug="vibe-coding" />
        </header>

        <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
          <div>
            <Accordion className="mx-auto flex w-full max-w-4xl flex-col gap-3">
              <AccordionItem value="week-1">
                <AccordionTrigger className="text-left text-2xl font-semibold text-primary hover:text-spark transition py-4 px-4 sm:py-6 sm:px-6 bg-surface/50 rounded-lg data-[state=open]:bg-surface data-[state=open]:border-spark border border-transparent">
                  Week 1: Vibe Fundamentals
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
                  <p className="text-sm text-text-secondary sm:text-base">
                    Establish the language of vibe: aesthetics, rhythm, and feel expressed
                    through code.
                  </p>
                  <Accordion className="mt-4 space-y-2">
                    <AccordionItem value="week-1-topic-1">
                      <AccordionTrigger className="text-left text-lg font-medium text-text-primary hover:text-spark">
                        Topic: Aesthetic Coding Principles
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>What makes an interface feel &quot;alive&quot;</li>
                          <li>Balancing minimalism with expressiveness</li>
                          <li>Borrowing from music, fashion, and film</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="vibe-coding"
                          itemId="vibe-coding-week-1-topic-1"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="week-1-topic-2">
                      <AccordionTrigger className="text-left text-lg font-medium text-text-primary hover:text-spark">
                        Topic: Color Theory in Code
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Building palettes and gradients</li>
                          <li>Contrast, accessibility, and mood</li>
                          <li>Animating color for micro-interactions</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="vibe-coding"
                          itemId="vibe-coding-week-1-topic-2"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="week-1-topic-3">
                      <AccordionTrigger className="text-left text-lg font-medium text-text-primary hover:text-spark">
                        Topic: Motion & Rhythm
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Easing, timing, and rhythm</li>
                          <li>Micro vs. macro motion patterns</li>
                          <li>Building motion systems, not one-offs</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="vibe-coding"
                          itemId="vibe-coding-week-1-topic-3"
                          type="topic"
                        />
                        <div className="mt-6 space-y-3 rounded-lg border border-primary/20 bg-surface/60 p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-text-primary">
                              Week 1 Quiz
                            </p>
                            {week1Quiz?.passed && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <span className="inline-flex cursor-help items-center gap-1 text-[11px] text-growth">
                                    <CheckCircle className="h-3 w-3" />
                                    Passed
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="bg-surface text-text-primary">
                                  <span>Quiz passed with score {week1Quiz.score}%</span>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <p className="text-xs text-text-secondary">
                            A quick check to reinforce the core ideas from Week 1.
                          </p>
                          <RadioGroup
                            value={quizAnswer}
                            onValueChange={(val) => {
                              setQuizAnswer(val);
                              setQuizMessage(null);
                              setQuizError(null);
                            }}
                            className="mt-2 space-y-2"
                          >
                            <label className="flex cursor-pointer items-start gap-2 rounded-md border border-white/10 bg-surface/60 p-3 text-xs text-text-secondary hover:border-spark">
                              <RadioGroupItem value="a" />
                              <span>Vibe is only about picking trending colors.</span>
                            </label>
                            <label className="flex cursor-pointer items-start gap-2 rounded-md border border-white/10 bg-surface/60 p-3 text-xs text-text-secondary hover:border-spark">
                              <RadioGroupItem value="b" />
                              <span>
                                Vibe is the felt experience created by motion, color, rhythm, and
                                interaction working together.
                              </span>
                            </label>
                            <label className="flex cursor-pointer items-start gap-2 rounded-md border border-white/10 bg-surface/60 p-3 text-xs text-text-secondary hover:border-spark">
                              <RadioGroupItem value="c" />
                              <span>Vibe is just adding as many animations as possible.</span>
                            </label>
                            <label className="flex cursor-pointer items-start gap-2 rounded-md border border-white/10 bg-surface/60 p-3 text-xs text-text-secondary hover:border-spark">
                              <RadioGroupItem value="d" />
                              <span>
                                Vibe only matters for marketing pages, not product interfaces.
                              </span>
                            </label>
                          </RadioGroup>
                          <Button
                            type="button"
                            size="sm"
                            disabled={isQuizPending || week1Quiz?.passed || !quizAnswer}
                            onClick={() => {
                              if (!quizAnswer) return;
                              setQuizMessage(null);
                              setQuizError(null);
                              startQuizTransition(async () => {
                                const formData = new FormData();
                                formData.append("courseSlug", COURSE_SLUG);
                                formData.append("week", "1");
                                formData.append("answer", quizAnswer);
                                const result = await submitQuiz(formData);
                                if (result.success) {
                                  if (result.passed) {
                                    setQuizMessage("Beautiful — you passed the Week 1 quiz!");
                                  } else {
                                    setQuizError("Close. Revisit the topics and try again.");
                                  }
                                } else {
                                  setQuizError(result.error);
                                }
                              });
                            }}
                            className="mt-1 bg-spark text-bg hover:bg-spark/90"
                          >
                            {week1Quiz?.passed
                              ? "Quiz Passed"
                              : isQuizPending
                                ? "Submitting..."
                                : "Submit Quiz"}
                          </Button>
                          {quizMessage && (
                            <p className="text-[11px] text-growth">{quizMessage}</p>
                          )}
                          {quizError && (
                            <p className="text-[11px] text-secondary">{quizError}</p>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </AccordionContent>
              </AccordionItem>

              {isWeekUnlocked(2) && (
                <AccordionItem value="week-2">
                  <AccordionTrigger className="text-left text-2xl font-semibold text-primary hover:text-spark transition py-4 px-4 sm:py-6 sm:px-6 bg-surface/50 rounded-lg data-[state=open]:bg-surface data-[state=open]:border-spark border border-transparent">
                    Week 2: Creative Frontend Systems
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
                    <p className="text-sm text-text-secondary sm:text-base">
                      Build a composable design system that supports expressive, animated
                      UI elements.
                    </p>
                    <Accordion className="mt-4 space-y-2">
                      <AccordionItem value="week-2-topic-1">
                        <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                          Topic: Components as Instruments
                        </AccordionTrigger>
                        <AccordionContent className="pl-4 sm:pl-6">
                          <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                            <li>Designing primitives with clear roles</li>
                            <li>Styling strategies with Tailwind</li>
                            <li>State and interaction patterns</li>
                          </ul>
                          <TopicCompleteButton
                            courseSlug="vibe-coding"
                            itemId="vibe-coding-week-2-topic-1"
                            type="topic"
                          />
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="week-2-topic-2">
                        <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                          Topic: Layouts with Flow
                        </AccordionTrigger>
                        <AccordionContent className="pl-4 sm:pl-6">
                          <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                            <li>Responsive grids and rhythm</li>
                            <li>Whitespace as a design tool</li>
                            <li>Information hierarchy & narrative</li>
                          </ul>
                          <TopicCompleteButton
                            courseSlug="vibe-coding"
                            itemId="vibe-coding-week-2-topic-2"
                            type="topic"
                          />
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="week-2-topic-3">
                        <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                          Topic: Animation Systems
                        </AccordionTrigger>
                        <AccordionContent className="pl-4 sm:pl-6">
                          <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                            <li>Using motion libraries responsibly</li>
                            <li>Defining motion tokens</li>
                            <li>Performance considerations</li>
                          </ul>
                          <TopicCompleteButton
                            courseSlug="vibe-coding"
                            itemId="vibe-coding-week-2-topic-3"
                            type="topic"
                          />
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              )}

              {isWeekUnlocked(3) && (
              <AccordionItem value="week-3">
                <AccordionTrigger className="text-left text-2xl font-semibold text-primary hover:text-spark transition py-4 px-4 sm:py-6 sm:px-6 bg-surface/50 rounded-lg data-[state=open]:bg-surface data-[state=open]:border-spark border border-transparent">
                  Week 3: Generative Visuals
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
                  <p className="text-sm text-text-secondary sm:text-base">
                    Explore generative patterns with code: particles, noise, and
                    procedural shapes.
                  </p>
                  <Accordion className="mt-4 space-y-2">
                    <AccordionItem value="week-3-topic-1">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: Drawing with Code
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Canvas and WebGL basics</li>
                          <li>Geometry and simple shaders</li>
                          <li>Working with noise & randomness</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="vibe-coding"
                          itemId="vibe-coding-week-3-topic-1"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="week-3-topic-2">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: Reactive Visuals
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Driving visuals from data streams</li>
                          <li>Audio-reactive experiences</li>
                          <li>Performance and frame budgets</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="vibe-coding"
                          itemId="vibe-coding-week-3-topic-2"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="week-3-topic-3">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: Composing Scenes
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Layering, depth, and parallax</li>
                          <li>Camera movement and focus</li>
                          <li>Exporting and capturing work</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="vibe-coding"
                          itemId="vibe-coding-week-3-topic-3"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
              )}

              {isWeekUnlocked(4) && (
              <AccordionItem value="week-4">
                <AccordionTrigger className="text-left text-2xl font-semibold text-primary hover:text-spark transition py-4 px-4 sm:py-6 sm:px-6 bg-surface/50 rounded-lg data-[state=open]:bg-surface data-[state=open]:border-spark border border-transparent">
                  Week 4: Interactive Vibe Interfaces
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
                  <p className="text-sm text-text-secondary sm:text-base">
                    Combine generative visuals and UX to craft interactive experiences.
                  </p>
                  <Accordion className="mt-4 space-y-2">
                    <AccordionItem value="week-4-topic-1">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: Input & Interaction Patterns
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Gestures, cursor, and scroll as instruments</li>
                          <li>Friction vs. delight</li>
                          <li>Designing for flow state</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="vibe-coding"
                          itemId="vibe-coding-week-4-topic-1"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="week-4-topic-2">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: State & Story
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Using state to drive narrative</li>
                          <li>Session-based experiences</li>
                          <li>Saving and sharing states</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="vibe-coding"
                          itemId="vibe-coding-week-4-topic-2"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="week-4-topic-3">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: Accessibility & Comfort
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Reducing motion when needed</li>
                          <li>Color and contrast considerations</li>
                          <li>Designing inclusive experiences</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="vibe-coding"
                          itemId="vibe-coding-week-4-topic-3"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
              )}

              {isWeekUnlocked(5) && (
              <AccordionItem value="week-5">
                <AccordionTrigger className="text-left text-2xl font-semibold text-primary hover:text-spark transition py-4 px-4 sm:py-6 sm:px-6 bg-surface/50 rounded-lg data-[state=open]:bg-surface data-[state=open]:border-spark border border-transparent">
                  Week 5: AI-Assisted Creation
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
                  <p className="text-sm text-text-secondary sm:text-base">
                    Use AI tools as collaborators for visuals, copy, and sound.
                  </p>
                  <Accordion className="mt-4 space-y-2">
                    <AccordionItem value="week-5-topic-1">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: Co-creating with Models
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Prompting for art and visuals</li>
                          <li>Iterating on design directions</li>
                          <li>Blending human and model taste</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="vibe-coding"
                          itemId="vibe-coding-week-5-topic-1"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="week-5-topic-2">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: Toolchains for Vibe Builders
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Design-to-code workflows</li>
                          <li>Versioning and asset management</li>
                          <li>Collaborating with other disciplines</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="vibe-coding"
                          itemId="vibe-coding-week-5-topic-2"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="week-5-topic-3">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: Ethics & Authorship
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Attribution and transparency</li>
                          <li>Respecting audience boundaries</li>
                          <li>Developing your own artistic voice</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="vibe-coding"
                          itemId="vibe-coding-week-5-topic-3"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
              )}

              {isWeekUnlocked(6) && (
              <AccordionItem value="week-6">
                <AccordionTrigger className="text-left text-2xl font-semibold text-primary hover:text-spark transition py-4 px-4 sm:py-6 sm:px-6 bg-surface/50 rounded-lg data-[state=open]:bg-surface data-[state=open]:border-spark border border-transparent">
                  Week 6: Vibe Capstone
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
                  <p className="text-sm text-text-secondary sm:text-base">
                    Design and ship a signature vibe project that expresses your style.
                  </p>
                  <Accordion className="mt-4 space-y-2">
                    <AccordionItem value="week-6-topic-1">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: Concept Development
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Finding the emotional core</li>
                          <li>Sketching and prototyping ideas</li>
                          <li>Picking constraints and scope</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="vibe-coding"
                          itemId="vibe-coding-week-6-topic-1"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="week-6-topic-2">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: Build & Polish
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Refining visuals, motion, and sound</li>
                          <li>Optimizing performance</li>
                          <li>Preparing for public release</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="vibe-coding"
                          itemId="vibe-coding-week-6-topic-2"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="week-6-topic-3">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: Launch & Reflection
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Sharing your work with the world</li>
                          <li>Documenting process & learnings</li>
                          <li>Planning your next experiments</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="vibe-coding"
                          itemId="vibe-coding-week-6-topic-3"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
              )}
            </Accordion>
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-secondary/40 bg-surface p-6 text-sm text-text-secondary">
              <h2 className="text-base font-semibold text-secondary">
                Prerequisites
              </h2>
              <ul className="mt-3 space-y-1 list-disc pl-5">
                <li>Basic React or frontend experience</li>
                <li>Interest in design, visuals, or music</li>
                <li>Willingness to experiment and iterate</li>
              </ul>
            </div>

            <div className="rounded-xl border border-primary/25 bg-surface p-6 text-sm text-text-secondary">
              <h2 className="text-base font-semibold text-primary">
                What You&apos;ll Build
              </h2>
              <p className="mt-3">
                A signature interactive experience that encodes your personal vibe —
                something you&apos;re proud to share in a portfolio or with friends.
              </p>
              <button className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-spark px-5 py-3 text-sm font-semibold text-bg shadow-sm transition hover:bg-spark/90">
                Get Notified About Next Cohort
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

