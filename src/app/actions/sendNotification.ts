"use server";

import { Resend } from "resend";
import { render } from "@react-email/render";
import CongratsWeek from "@/emails/CongratsWeek";
import * as React from "react";

const resendApiKey = process.env.RESEND_API_KEY;

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendCongratsEmail(
  userEmail: string | null | undefined,
  userName: string | null | undefined,
  course: string,
  week: number,
  percent?: number,
) {
  // Trigger for testing:
  // - Completing a week via `markComplete` (type="week") OR
  // - Passing the week quiz via `submitQuiz` (both call this function).
  if (!resend || !userEmail) {
    console.warn(
      "Resend not configured or missing recipient email, skipping congrats email.",
    );
    return;
  }

  const safeName = userName || "there";

  try {
    const html = await render(
      React.createElement(CongratsWeek, {
        name: safeName,
        course,
        week,
        progressPercent: Math.round(percent ?? 0),
      }),
    );

    await resend.emails.send({
      from: "UltimaSpark Academy <noreply@ultimaspark.com>",
      to: userEmail,
      subject: `Congrats on Completing Week ${week} of ${course}!`,
      html,
      // replyTo: "support@ultimaspark.com" // optional
    });
  } catch (err) {
    console.error("Failed to send congrats email via Resend:", err);
  }
}

