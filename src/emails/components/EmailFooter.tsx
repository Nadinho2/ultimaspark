import * as React from "react";
import { Hr, Link, Section, Text } from "@react-email/components";

const spark = "#F59E0B";

export function EmailFooter() {
  return (
    <Section style={{ padding: "18px 0 6px", textAlign: "center" }}>
      <Hr style={{ borderColor: "#E5E7EB" }} />

      <Section style={{ marginTop: 14 }}>
        <Text style={{ fontSize: 12, color: "#6B7280", margin: "0 0 10px" }}>
          © 2026 UltimaSpark Academy
        </Text>

        <Text style={{ fontSize: 12, color: "#6B7280", margin: "0 0 10px" }}>
          <Link
            href="https://ultimaspark.com/dashboard"
            style={{ color: spark, textDecoration: "underline" }}
          >
            Dashboard
          </Link>{" "}
          •{" "}
          <Link
            href="https://ultimaspark.com/testimonials/submit"
            style={{ color: spark, textDecoration: "underline" }}
          >
            Submit Testimonial
          </Link>{" "}
          •{" "}
          <Link
            href="https://x.com/NadinhoCrypto"
            style={{ color: spark, textDecoration: "underline" }}
          >
            X @NadinhoCrypto
          </Link>
        </Text>

        <Text style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>
          <Link
            href="https://ultimaspark.com/unsubscribe"
            style={{ color: spark, textDecoration: "underline" }}
          >
            Unsubscribe
          </Link>
          {"  "}
          (placeholder)
        </Text>
      </Section>
    </Section>
  );
}

