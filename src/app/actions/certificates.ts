"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import * as React from "react";
import { Resend } from "resend";
import { render } from "@react-email/render";
import CertificateReady from "@/emails/CertificateReady";
import { getCourses } from "@/lib/courses";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

type ClaimResult =
  | { success: true }
  | { success: false; error: string };

export async function claimCertificate(
  courseSlug: string,
): Promise<ClaimResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const claimed =
      (user.publicMetadata.claimedCertificates as string[] | undefined) ?? [];

    if (claimed.includes(courseSlug)) {
      return { success: true };
    }

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        claimedCertificates: [...claimed, courseSlug],
      },
    });

    // Best-effort certificate email notification.
    try {
      if (resend) {
        const courseTitle =
          (await getCourses()).find((c) => c.slug === courseSlug)?.title ?? courseSlug;

        const toEmail =
          user.emailAddresses?.[0]?.emailAddress ??
          user.primaryEmailAddress?.emailAddress ??
          null;

        const displayName = user.firstName ?? user.username ?? "Student";

        const certificateLink = `https://ultimaspark.com/api/certificates/download?courseSlug=${encodeURIComponent(
          courseSlug,
        )}`;

        if (toEmail) {
          const html = await render(
            React.createElement(CertificateReady, {
              name: displayName,
              course: courseTitle,
              certificateLink,
            }),
          );

          await resend.emails.send({
            from: "UltimaSpark Academy <noreply@ultimaspark.com>",
            to: toEmail,
            subject: `Your ${courseTitle} Certificate is Ready!`,
            html,
          });
        }
      }
    } catch (err) {
      console.error("claimCertificate email error:", err);
    }

    return { success: true };
  } catch (err) {
    console.error("Claim certificate error:", err);
    return { success: false, error: "Failed to claim certificate" };
  }
}

