import * as React from "react";
import { Heading, Img, Section, Text } from "@react-email/components";

const primary = "#7C3AED";
const spark = "#F59E0B";

export function EmailHeader() {
  return (
    <Section
      style={{
        padding: "24px 0 16px",
        textAlign: "center",
      }}
    >
      <Heading
        as="h1"
        style={{
          margin: 0,
          fontSize: "26px",
          fontWeight: 800,
          letterSpacing: "0.01em",
        }}
      >
        <span>Ultima</span>
        <span style={{ color: spark }}>Spark</span>
        <span> Academy</span>
      </Heading>
      <Text
        style={{
          margin: "8px 0 0",
          fontSize: "14px",
          lineHeight: "1.5",
          color: "#6B7280",
        }}
      >
        Ignite Your Future in AI & Coding
      </Text>
    </Section>
  );
}

