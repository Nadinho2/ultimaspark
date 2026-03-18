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

const COURSE_SLUG = "ai-automation" as const;

export default function AiAutomationPage() {
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
            6 Weeks • Project-Based
          </p>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            AI Automation Course
          </h1>
          <p className="mt-4 max-w-2xl text-base text-text-secondary sm:text-lg">
            6-week intensive: Build intelligent agents, automate workflows, and master
            AI tools. Each week you will ship hands-on, production-minded projects.
          </p>
          <EnrollButton courseSlug="ai-automation" />
        </header>

        <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
          <div>
            <Accordion className="mx-auto flex w-full max-w-4xl flex-col gap-3">
              <AccordionItem value="week-1">
                <AccordionTrigger className="text-left text-2xl font-semibold text-primary hover:text-spark transition py-4 px-4 sm:py-6 sm:px-6 bg-surface/50 rounded-lg data-[state=open]:bg-surface data-[state=open]:border-spark border border-transparent">
                  Week 1: Foundations of AI Automation
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
                  <p className="text-sm text-text-secondary sm:text-base">
                    Understand the landscape of AI automation, key concepts, and how
                    agents fit into modern workflows.
                  </p>
                  <Accordion className="mt-4 space-y-2">
                    <AccordionItem value="week-1-topic-1">
                      <AccordionTrigger className="text-left text-lg font-medium text-text-primary hover:text-spark">
                        Topic: Introduction to AI Agents
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>What is an AI agent and why it matters</li>
                          <li>Key components: memory, tools, policies</li>
                          <li>Real-world examples in support, ops, and dev</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="ai-automation"
                          itemId="ai-automation-week-1-topic-1"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="week-1-topic-2">
                      <AccordionTrigger className="text-left text-lg font-medium text-text-primary hover:text-spark">
                        Topic: Prompting & Reasoning Basics
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Effective prompting patterns for agents</li>
                          <li>Controlling tone, safety, and constraints</li>
                          <li>Common pitfalls and debugging strategies</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="ai-automation"
                          itemId="ai-automation-week-1-topic-2"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="week-1-topic-3">
                      <AccordionTrigger className="text-left text-lg font-medium text-text-primary hover:text-spark">
                        Topic: Tooling Overview
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>APIs, webhooks, and job runners</li>
                          <li>Integrating external services and SaaS tools</li>
                          <li>Designing simple, observable automations</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="ai-automation"
                          itemId="ai-automation-week-1-topic-3"
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
                            Answer this quick check-in to confirm your understanding of Week 1.
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
                              <span>
                                AI agents are static scripts that never adapt and cannot call tools.
                              </span>
                            </label>
                            <label className="flex cursor-pointer items-start gap-2 rounded-md border border-white/10 bg-surface/60 p-3 text-xs text-text-secondary hover:border-spark">
                              <RadioGroupItem value="b" />
                              <span>
                                AI agents are just dashboards for monitoring human workflows.
                              </span>
                            </label>
                            <label className="flex cursor-pointer items-start gap-2 rounded-md border border-white/10 bg-surface/60 p-3 text-xs text-text-secondary hover:border-spark">
                              <RadioGroupItem value="c" />
                              <span>
                                AI agents are systems that use models, memory, and tools to take
                                actions toward a goal.
                              </span>
                            </label>
                            <label className="flex cursor-pointer items-start gap-2 rounded-md border border-white/10 bg-surface/60 p-3 text-xs text-text-secondary hover:border-spark">
                              <RadioGroupItem value="d" />
                              <span>
                                AI agents are only useful for chatbots and cannot automate workflows.
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
                                    setQuizMessage("Nice work — you passed the Week 1 quiz!");
                                  } else {
                                    setQuizError("Not quite yet — review the topics and try again.");
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
                    Week 2: Workflow Automation & Orchestration
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
                    <p className="text-sm text-text-secondary sm:text-base">
                      Learn to design robust, observable workflows that connect tools,
                      APIs, and agents together.
                    </p>
                    <Accordion className="mt-4 space-y-2">
                      <AccordionItem value="week-2-topic-1">
                        <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                          Topic: Mapping Business Workflows
                        </AccordionTrigger>
                        <AccordionContent className="pl-4 sm:pl-6">
                          <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                            <li>Identifying automation opportunities</li>
                            <li>Designing human-in-the-loop flows</li>
                            <li>Defining SLAs and guardrails</li>
                          </ul>
                          <TopicCompleteButton
                            courseSlug="ai-automation"
                            itemId="ai-automation-week-2-topic-1"
                            type="topic"
                          />
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="week-2-topic-2">
                        <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                          Topic: Orchestration Patterns
                        </AccordionTrigger>
                        <AccordionContent className="pl-4 sm:pl-6">
                          <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                            <li>Sequential vs. parallel tasks</li>
                            <li>Error handling and retries</li>
                            <li>Idempotency and safe re-runs</li>
                          </ul>
                          <TopicCompleteButton
                            courseSlug="ai-automation"
                            itemId="ai-automation-week-2-topic-2"
                            type="topic"
                          />
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="week-2-topic-3">
                        <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                          Topic: Monitoring & Observability
                        </AccordionTrigger>
                        <AccordionContent className="pl-4 sm:pl-6">
                          <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                            <li>Structured logging for automations</li>
                            <li>Alerting on failures and anomalies</li>
                            <li>Measuring impact and ROI</li>
                          </ul>
                          <TopicCompleteButton
                            courseSlug="ai-automation"
                            itemId="ai-automation-week-2-topic-3"
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
                  Week 3: Language Models & Retrieval
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
                  <p className="text-sm text-text-secondary sm:text-base">
                    Go deeper into model behavior, retrieval-augmented generation, and
                    knowledge graph style automations.
                  </p>
                  <Accordion className="mt-4 space-y-2">
                    <AccordionItem value="week-3-topic-1">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: Model Capabilities & Limits
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Choosing the right model for the job</li>
                          <li>Latency, cost, and quality tradeoffs</li>
                          <li>Mitigating hallucinations</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="ai-automation"
                          itemId="ai-automation-week-3-topic-1"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="week-3-topic-2">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: Retrieval & Memory
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Document chunking and embeddings</li>
                          <li>Short-term vs. long-term memory</li>
                          <li>Designing context windows</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="ai-automation"
                          itemId="ai-automation-week-3-topic-2"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="week-3-topic-3">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: RAG in Production
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Evaluating retrieval quality</li>
                          <li>Versioning and rollbacks</li>
                          <li>Monitoring grounding quality</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="ai-automation"
                          itemId="ai-automation-week-3-topic-3"
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
                  Week 4: Tool Integration & Agents
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
                  <p className="text-sm text-text-secondary sm:text-base">
                    Wire agents into tools, CRMs, and internal systems to do real work.
                  </p>
                  <Accordion className="mt-4 space-y-2">
                    <AccordionItem value="week-4-topic-1">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: Defining Tool Schemas
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Designing safe tool contracts</li>
                          <li>Input/output validation strategies</li>
                          <li>Error surfaces for agents</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="ai-automation"
                          itemId="ai-automation-week-4-topic-1"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="week-4-topic-2">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: Multi-step Agents
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Planning vs. acting architectures</li>
                          <li>Loop prevention and control</li>
                          <li>Chaining tools across domains</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="ai-automation"
                          itemId="ai-automation-week-4-topic-2"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="week-4-topic-3">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: Human Oversight
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Approval queues and review UIs</li>
                          <li>Escalation patterns</li>
                          <li>Feedback loops to improve agents</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="ai-automation"
                          itemId="ai-automation-week-4-topic-3"
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
                  Week 5: Shipping Production Automations
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
                  <p className="text-sm text-text-secondary sm:text-base">
                    Take projects from prototype to reliable production systems.
                  </p>
                  <Accordion className="mt-4 space-y-2">
                    <AccordionItem value="week-5-topic-1">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: Hardening & Testing
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Unit tests for tools and orchestrations</li>
                          <li>Eval suites for LLM behavior</li>
                          <li>Chaos testing and failure drills</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="ai-automation"
                          itemId="ai-automation-week-5-topic-1"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="week-5-topic-2">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: Security & Compliance
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Secrets management and permissions</li>
                          <li>Data residency and logging</li>
                          <li>Reviewing vendor risk</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="ai-automation"
                          itemId="ai-automation-week-5-topic-2"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="week-5-topic-3">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: Deployments & Rollouts
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Canary and staged rollouts</li>
                          <li>Versioning flows and tools</li>
                          <li>Communicating changes to stakeholders</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="ai-automation"
                          itemId="ai-automation-week-5-topic-3"
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
                  Week 6: Capstone – Design & Ship
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
                  <p className="text-sm text-text-secondary sm:text-base">
                    Design, build, and present a capstone AI automation that solves a
                    real problem in your world.
                  </p>
                  <Accordion className="mt-4 space-y-2">
                    <AccordionItem value="week-6-topic-1">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: Project Design Review
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Scoping a realistic capstone</li>
                          <li>Choosing the right tools and stack</li>
                          <li>Defining success metrics</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="ai-automation"
                          itemId="ai-automation-week-6-topic-1"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="week-6-topic-2">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: Implementation & Coaching
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Technical guidance and reviews</li>
                          <li>Iterating on feedback</li>
                          <li>Preparing demo environments</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="ai-automation"
                          itemId="ai-automation-week-6-topic-2"
                          type="topic"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="week-6-topic-3">
                      <AccordionTrigger className="text-left text-lg font-medium text-secondary hover:text-spark">
                        Topic: Demo & Reflection
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 sm:pl-6">
                        <ul className="mt-2 space-y-1 list-disc pl-6 text-sm text-text-secondary">
                          <li>Presenting your automation</li>
                          <li>Capturing learnings & next steps</li>
                          <li>Packaging a portfolio-ready story</li>
                        </ul>
                        <TopicCompleteButton
                          courseSlug="ai-automation"
                          itemId="ai-automation-week-6-topic-3"
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
                <li>Comfortable with JavaScript or TypeScript</li>
                <li>Basic familiarity with APIs and HTTP</li>
                <li>Curiosity about automation and agents</li>
              </ul>
            </div>

            <div className="rounded-xl border border-primary/25 bg-surface p-6 text-sm text-text-secondary">
              <h2 className="text-base font-semibold text-primary">
                What You&apos;ll Build
              </h2>
              <p className="mt-3">
                By the end of the cohort, you&apos;ll ship a production-minded AI
                automation or agent that solves a real workflow for you or your team.
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

