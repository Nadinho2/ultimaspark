import * as React from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
} from "@react-email/components";

import { EmailHeader } from "./components/EmailHeader";
import { EmailFooter } from "./components/EmailFooter";

export type EmailLayoutProps = {
  children: React.ReactNode;
  preview?: string;
  previewNode?: React.ReactNode;
  includeFooter?: boolean;
};

// Shared wrapper for all branded email templates.
export function EmailLayout({
  children,
  preview,
  previewNode,
  includeFooter = true,
}: EmailLayoutProps) {
  return (
    <Html lang="en">
      <Head />
      {previewNode ?? <Preview>{preview ?? "UltimaSpark Academy update"}</Preview>}

      <Body
        className="email-body"
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "var(--bg)",
          color: "var(--text-primary)",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <style>
          {`
            @media (prefers-color-scheme: dark) {
              .email-body {
                background-color: #0F1117 !important;
                color: #F9FAFB !important;
              }
              .email-container {
                background-color: #1F2937 !important;
                border-color: #374151 !important;
              }
              a { color: #FCD34D !important; }
            }
          `}
        </style>

        <Section style={{ width: "100%", margin: "0 auto" }}>
          <Container
            className="email-container"
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              padding: "20px",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              backgroundColor: "transparent",
            }}
          >
            <EmailHeader />
            <Section>{children}</Section>
            {includeFooter && <EmailFooter />}
          </Container>
        </Section>
      </Body>
    </Html>
  );
}

