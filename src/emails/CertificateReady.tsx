import * as React from "react";
import { Button, Heading, Section, Text } from "@react-email/components";

import { EmailLayout } from "./EmailLayout";

interface Props {
  name: string;
  course: string;
  certificateLink: string;
}

// Usage example (for html):
// import { render } from "@react-email/render";
// const html = await render(
//   <CertificateReady
//     name="Nadinho"
//     course="Vibe Coding"
//     certificateLink="https://ultimaspark.com/verify-cert/abc"
//   />,
// );
export default function CertificateReady({
  name,
  course,
  certificateLink,
}: Props) {
  const safeName = name?.trim() ? name : "Student";
  const preview = `Your certificate for ${course} is ready!`;

  return (
    <EmailLayout preview={preview}>
      <Section
        style={{
          padding: "42px 18px 18px",
          textAlign: "center",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <Heading
          as="h2"
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 900,
            color: "#111827",
            letterSpacing: "0.01em",
          }}
        >
          Achievement Unlocked
        </Heading>

        <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              backgroundColor: "rgba(5,150,105,0.12)",
              border: "1px solid rgba(5,150,105,0.22)",
              color: "#059669",
              borderRadius: 999,
              padding: "8px 12px",
              fontWeight: 800,
              fontSize: 13,
              lineHeight: 1.2,
              textAlign: "center",
            }}
          >
            100% Complete
          </div>
        </div>

        <Text
          style={{
            margin: "18px 0 0",
            fontSize: 14,
            lineHeight: 1.6,
            color: "#6B7280",
          }}
        >
          Congrats <strong style={{ color: "#111827" }}>{safeName}</strong>! You completed{" "}
          <strong style={{ color: "#111827" }}>{course}</strong>. Download your certificate.
        </Text>
      </Section>

      <Section style={{ padding: "0 18px 8px", textAlign: "center" }}>
        <Button
          href={certificateLink}
          style={{
            background: "#059669",
            color: "#ffffff",
            padding: "16px 28px",
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: 900,
            display: "inline-block",
            border: "1px solid rgba(0,0,0,0.04)",
          }}
          className="cert-cta"
        >
          Download Certificate
        </Button>
      </Section>

      <style>
        {`
          @media (prefers-color-scheme: dark) {
            .cert-cta { background: #10B981 !important; }
          }
        `}
      </style>
    </EmailLayout>
  );
}

