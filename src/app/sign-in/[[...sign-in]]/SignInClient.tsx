"use client";

import { SignIn } from "@clerk/nextjs";

type Props = {
  forceRedirectUrl?: string;
};

/**
 * Hash routing avoids path/catch-all + Dashboard URL mismatches that often show a blank UI.
 * `ClerkProvider` must wrap app content inside `<body>` (not `<html>`) for embedded components.
 */
export function SignInClient({ forceRedirectUrl }: Props) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <SignIn
        routing="hash"
        {...(forceRedirectUrl ? { forceRedirectUrl } : {})}
      />
    </div>
  );
}
