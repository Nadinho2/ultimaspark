import * as React from "react";
import { Button, Heading, Preview, Section, Text } from "@react-email/components";

import { EmailLayout } from "./EmailLayout";
import { EmailFooter } from "./components/EmailFooter";

export interface Props {
  name: string;
  course: string;
  week: number;
  progressPercent: number;
}

// Usage example (for html):
// import { render } from "@react-email/render";
// const html = await render(<CongratsWeek {...props} />);
export default function CongratsWeek({
  name,
  course,
  week,
  progressPercent,
}: Props) {
  const safeName = name?.trim() ? name : "there";
  const pct = Number.isFinite(progressPercent)
    ? Math.min(100, Math.max(0, Math.round(progressPercent)))
    : 0;

  const preview = `Congrats, ${safeName}! You completed Week ${week} of ${course} 🚀`;

  return (
    <EmailLayout
      preview={preview}
      previewNode={<Preview>{preview}</Preview>}
      includeFooter={false}
    >
      <Section
        style={{
          background: "linear-gradient(to right, #7C3AED, #F59E0B)",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        <Heading
          style={{
            color: "#ffffff",
            margin: 0,
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "0.01em",
          }}
        >
          Week {week} Complete!
        </Heading>
      </Section>

      <Section style={{ padding: "22px 18px 0" }}>
        <Text style={{ margin: 0, fontSize: 16, color: "#111827" }}>
          Hi {safeName},
        </Text>
        <Text style={{ margin: "12px 0 0", fontSize: 14, color: "#6B7280" }}>
          You're making great progress in {course}! Keep the spark alive.
        </Text>

        <Section style={{ marginTop: 18 }}>
          <Text style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>
            Progress: {pct}%
          </Text>

          <div
            className="progress-track"
            style={{
              background: "#e5e7eb",
              borderRadius: "4px",
              height: "12px",
              marginTop: 8,
              overflow: "hidden",
            }}
          >
            <div
              className="progress-fill"
              style={{
                background: "#059669",
                width: `${pct}%`,
                height: "100%",
                borderRadius: "4px",
              }}
            />
          </div>
        </Section>

        <Section style={{ marginTop: 22, textAlign: "center" }}>
          <Button
            href="https://ultimaspark.com/dashboard"
            className="email-cta"
            style={{
              background: "#F59E0B",
              color: "#111827",
              padding: "16px 32px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            Continue to Dashboard
          </Button>
        </Section>
      </Section>

      <style>
        {`
          @media (prefers-color-scheme: dark) {
            .progress-track { background: #374151 !important; }
            .progress-fill { background: #10B981 !important; }
            .email-cta { color: #0B0A0F !important; }
          }
        `}
      </style>

      <EmailFooter />
    </EmailLayout>
  );
}

