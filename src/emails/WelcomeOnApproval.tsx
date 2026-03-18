import * as React from "react";
import { Button, Heading, Section, Text } from "@react-email/components";

import { EmailLayout } from "./EmailLayout";

interface Props {
  name: string;
  course: string;
}

// Usage example (for html):
// import { render } from "@react-email/render";
// const html = await render(
//   <WelcomeOnApproval name="Nadinho" course="AI Automation" />,
// );
export default function WelcomeOnApproval({ name, course }: Props) {
  const safeName = name?.trim() ? name : "Student";

  const preview = `Welcome to ${course} – your access is now active!`;

  return (
    <EmailLayout preview={preview}>
      <Section
        style={{
          background: "linear-gradient(to right, #7C3AED, #F59E0B)",
          padding: "42px 18px 28px",
          textAlign: "center",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            backgroundColor: "rgba(255,255,255,0.12)",
            borderRadius: 999,
          }}
        >
          {/* Green check icon */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" fill="#059669" />
            <path
              d="M16.5 8.5L10.5 14.5L7.5 11.5"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Text style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#ffffff" }}>
            Approved & Ready!
          </Text>
        </div>

        <Heading
          as="h2"
          style={{
            margin: "18px 0 0",
            fontSize: 26,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "0.01em",
          }}
        >
          Your enrollment is live
        </Heading>
      </Section>

      <Section style={{ padding: "22px 18px 0" }}>
        <Text style={{ margin: 0, fontSize: 16, color: "#111827" }}>
          Hi {safeName},
        </Text>
        <Text style={{ margin: "12px 0 0", fontSize: 14, lineHeight: 1.6, color: "#6B7280" }}>
          Your enrollment in <strong style={{ color: "#111827" }}>{course}</strong> has been
          approved. Start Week 1 now.
        </Text>

        <Section style={{ marginTop: 22, textAlign: "center" }}>
          <Button
            href="https://ultimaspark.com/dashboard"
            style={{
              background: "#F59E0B",
              color: "#111827",
              padding: "16px 30px",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 800,
              display: "inline-block",
              border: "1px solid rgba(17,24,39,0.12)",
            }}
          >
            Go to Dashboard
          </Button>
        </Section>
      </Section>

      <style>
        {`
          @media (prefers-color-scheme: dark) {
            .welcome-body { color: #F9FAFB !important; }
            .welcome-text { color: #9CA3AF !important; }
          }
        `}
      </style>
    </EmailLayout>
  );
}

