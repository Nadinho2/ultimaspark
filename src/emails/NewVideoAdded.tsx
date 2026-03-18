import * as React from "react";
import { Button, Heading, Section, Text } from "@react-email/components";

import { EmailLayout } from "./EmailLayout";

interface Props {
  name: string;
  course: string;
  week: number;
  videoTitle: string;
  videoLink: string;
}

// Usage example (for html):
// import { render } from "@react-email/render";
// const html = await render(
//   <NewVideoAdded
//     name="Nadinho"
//     course="AI Automation"
//     week={2}
//     videoTitle="Agents in Practice"
//     videoLink="https://www.youtube.com/watch?v=..."
//   />,
// );
export default function NewVideoAdded({
  name,
  course,
  week,
  videoTitle,
  videoLink,
}: Props) {
  const safeName = name?.trim() ? name : "Student";
  const preview = `New video added to Week ${week} of ${course}`;

  return (
    <EmailLayout preview={preview}>
      <Section
        style={{
          background: "linear-gradient(to right, #F59E0B, #7C3AED)",
          padding: "42px 18px 22px",
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
          {/* Yellow spark accent */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12 2L13.7 8.3L20 10L13.7 11.7L12 18L10.3 11.7L4 10L10.3 8.3L12 2Z"
              fill="#FCD34D"
            />
          </svg>
          <Text style={{ margin: 0, fontSize: 14, fontWeight: 900, color: "#ffffff" }}>
            Fresh Content Alert
          </Text>
        </div>

        <Heading
          as="h2"
          style={{
            margin: "18px 0 0",
            fontSize: 26,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "0.01em",
          }}
        >
          Week {week} is updated
        </Heading>
      </Section>

      <Section style={{ padding: "22px 18px 0" }}>
        <Text style={{ margin: 0, fontSize: 16, color: "#111827" }}>Hi {safeName},</Text>
        <Text style={{ margin: "12px 0 0", fontSize: 14, lineHeight: 1.6, color: "#6B7280" }}>
          A new video{" "}
          <span
            style={{
              backgroundColor: "rgba(245,158,11,0.14)",
              border: "1px solid rgba(245,158,11,0.25)",
              color: "#111827",
              padding: "2px 8px",
              borderRadius: 999,
              fontWeight: 800,
            }}
          >
            'new'
          </span>{" "}
          is now available in Week {week} of{" "}
          <strong style={{ color: "#111827" }}>{course}</strong>.
        </Text>
        <Text style={{ margin: "12px 0 0", fontSize: 14, color: "#111827" }}>
          Video: <strong>{videoTitle}</strong>
        </Text>

        <Section style={{ marginTop: 22, textAlign: "center" }}>
          <Button
            href={videoLink}
            style={{
              background: "#F59E0B",
              color: "#111827",
              padding: "16px 30px",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 900,
              display: "inline-block",
              border: "1px solid rgba(17,24,39,0.12)",
            }}
            className="video-cta"
          >
            Watch Now
          </Button>
        </Section>
      </Section>

      <style>
        {`
          @media (prefers-color-scheme: dark) {
            .video-cta { background: #FCD34D !important; color: #0B0A0F !important; }
          }
        `}
      </style>
    </EmailLayout>
  );
}

