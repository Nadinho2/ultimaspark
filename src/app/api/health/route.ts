import { NextResponse } from "next/server";

/** Use this URL to confirm which commit Vercel actually deployed (JSON). */
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    ok: true,
    vercelGitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    vercelEnv: process.env.VERCEL_ENV ?? null,
    nodeEnv: process.env.NODE_ENV,
  });
}
