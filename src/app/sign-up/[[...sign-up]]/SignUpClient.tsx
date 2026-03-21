"use client";

import { SignUp } from "@clerk/nextjs";

type Props = {
  forceRedirectUrl?: string;
};

/**
 * Hash routing — see SignInClient comment (avoids blank embedded flows).
 */
export function SignUpClient({ forceRedirectUrl }: Props) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <SignUp
        routing="hash"
        {...(forceRedirectUrl ? { forceRedirectUrl } : {})}
      />
    </div>
  );
}
