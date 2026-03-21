import { safeRedirectPath } from "@/lib/safe-redirect-path";
import { SignUpClient } from "./SignUpClient";

type PageProps = {
  searchParams: Promise<{ redirect_url?: string | string[] }>;
};

export default async function SignUpPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const raw =
    typeof params.redirect_url === "string"
      ? params.redirect_url
      : params.redirect_url?.[0];
  const afterSignUp = safeRedirectPath(raw);

  return <SignUpClient forceRedirectUrl={afterSignUp} />;
}
