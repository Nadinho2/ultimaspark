import { auth, clerkClient } from "@clerk/nextjs/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { randomUUID } from "crypto";
import * as React from "react";

import { CertificatePDF } from "@/components/CertificatePDF";
import { getCourses } from "@/lib/courses";

// PDF rendering is Node-only; ensure this runs in the Node runtime on Vercel.
export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const courseSlug = url.searchParams.get("courseSlug");

  if (!courseSlug) {
    return new Response("Missing courseSlug", { status: 400 });
  }

  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const claimed =
      (user.publicMetadata.claimedCertificates as string[] | undefined) ?? [];
    if (!claimed.includes(courseSlug)) {
      return new Response("Forbidden", { status: 403 });
    }

    const courseTitle =
      (await getCourses()).find((c) => c.slug === courseSlug)?.title ?? courseSlug;

    const displayName = user.firstName ?? user.username ?? "Student";

    const dateString = new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    const certificateId = randomUUID().slice(0, 8);

    // `renderToBuffer` expects the React-PDF <Document/> tree.
    // `CertificatePDF` is a React component that returns a Document, so we cast to satisfy types.
    const pdfBuffer = await renderToBuffer(
      React.createElement(CertificatePDF, {
        userName: displayName,
        courseName: courseTitle,
        dateString,
        certificateId,
      }) as any,
    );

    const safeTitle = courseTitle.replace(/[^a-z0-9-_ ]/gi, "").trim();
    const filename = `${safeTitle || "certificate"}-Certificate.pdf`;

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("Certificate download error:", err);
    return new Response("Failed to generate certificate", { status: 500 });
  }
}

