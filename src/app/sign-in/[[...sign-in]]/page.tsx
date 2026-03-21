import { safeRedirectPath } from "@/lib/safe-redirect-path";
import { SignInClient } from "./SignInClient";

type PageProps = {
  searchParams: Promise<{ redirect_url?: string | string[] }>;
};

export default async function SignInPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const raw =
    typeof params.redirect_url === "string"
      ? params.redirect_url
      : params.redirect_url?.[0];
  const afterSignIn = safeRedirectPath(raw);

  return <SignInClient forceRedirectUrl={afterSignIn} />;
}
