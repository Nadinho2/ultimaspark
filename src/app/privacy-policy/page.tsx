import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | UltimaSpark Academy",
  description:
    "How UltimaSpark Academy collects, uses, and protects your personal information when you use our website and services.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "March 21, 2026";

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-spark">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Last updated: {lastUpdated}
        </p>
        <p className="mt-6 text-base leading-relaxed text-text-secondary">
          UltimaSpark Academy (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the
          website and services available at ultimaspark.com and related domains
          (collectively, the &ldquo;Services&rdquo;). This Privacy Policy describes how we
          collect, use, disclose, and safeguard information when you visit our
          site, create an account, enroll in courses, or interact with us. By
          using the Services, you agree to this policy. If you do not agree,
          please do not use the Services.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-3xl space-y-10 text-base leading-relaxed text-text-secondary">
        <section>
          <h2 className="text-xl font-semibold text-text-primary">
            1. Information we collect
          </h2>
          <p className="mt-3">
            We collect information that you provide directly, information
            collected automatically, and information from third-party services
            that help us run the platform.
          </p>
          <ul className="mt-3 list-inside list-disc space-y-2 marker:text-spark">
            <li>
              <span className="font-medium text-text-primary">Account and profile data:</span>{" "}
              name, email address, and authentication identifiers when you sign
              up or sign in (often processed by our authentication provider).
            </li>
            <li>
              <span className="font-medium text-text-primary">Enrollment and learning data:</span>{" "}
              courses you enroll in, progress, quiz results, certificates, and
              related metadata needed to deliver content and support.
            </li>
            <li>
              <span className="font-medium text-text-primary">Communications:</span>{" "}
              messages you send us (e.g. support, testimonial submissions) and
              email interactions where applicable.
            </li>
            <li>
              <span className="font-medium text-text-primary">Technical data:</span>{" "}
              IP address, browser type, device information, general location
              (e.g. region), and usage logs — used for security, analytics, and
              improving the Services.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary">
            2. How we use information
          </h2>
          <p className="mt-3">We use the information we collect to:</p>
          <ul className="mt-3 list-inside list-disc space-y-2 marker:text-spark">
            <li>Provide, operate, and improve the Services and course content;</li>
            <li>Authenticate users and protect accounts from fraud or abuse;</li>
            <li>
              Send transactional emails (e.g. enrollment, certificates,
              important service notices) and, where permitted, marketing or
              newsletter communications you have opted into;
            </li>
            <li>Analyze usage in aggregate to improve UX, performance, and curriculum;</li>
            <li>Comply with legal obligations and enforce our terms.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary">
            3. Legal bases (where applicable)
          </h2>
          <p className="mt-3">
            Depending on your region, we may rely on consent, performance of a
            contract, legitimate interests (e.g. securing our platform,
            analytics), or legal obligation as the basis for processing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary">
            4. Cookies and similar technologies
          </h2>
          <p className="mt-3">
            We use cookies and similar technologies for session management,
            preferences (such as theme), security, and analytics. You can
            control cookies through your browser settings; disabling some
            cookies may limit certain features.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary">
            5. Third-party services
          </h2>
          <p className="mt-3">
            We use trusted providers to operate the Services. Examples may
            include authentication (e.g. Clerk), hosting (e.g. Vercel), email
            delivery (e.g. Resend), databases or storage (e.g. Supabase), and
            analytics. These providers process data under their own privacy
            policies and our instructions where required. We encourage you to
            review their policies for details on how they handle data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary">
            6. Data retention
          </h2>
          <p className="mt-3">
            We retain information for as long as your account is active or as
            needed to provide the Services, comply with law, resolve disputes,
            and enforce agreements. Some data may be retained in backups for a
            limited period. When data is no longer needed, we take reasonable
            steps to delete or anonymize it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary">
            7. Security
          </h2>
          <p className="mt-3">
            We implement appropriate technical and organizational measures to
            protect personal information. No method of transmission over the
            Internet is 100% secure; we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary">
            8. Your rights and choices
          </h2>
          <p className="mt-3">
            Depending on your location, you may have rights to access, correct,
            delete, or export your personal data; object to or restrict certain
            processing; or withdraw consent where processing is consent-based.
            You may also unsubscribe from marketing emails via the link in those
            emails. To exercise rights, contact us using the details below. We
            may need to verify your identity before fulfilling requests.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary">
            9. Children&apos;s privacy
          </h2>
          <p className="mt-3">
            The Services are not directed at children under 13 (or the minimum
            age in your jurisdiction). We do not knowingly collect personal
            information from children. If you believe we have collected such
            information, contact us and we will take steps to delete it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary">
            10. International transfers
          </h2>
          <p className="mt-3">
            If you access the Services from outside the country where we operate,
            your information may be transferred to and processed in countries
            that may have different data protection laws. We take steps designed
            to ensure appropriate safeguards where required.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary">
            11. Changes to this policy
          </h2>
          <p className="mt-3">
            We may update this Privacy Policy from time to time. We will post
            the updated version on this page and revise the &ldquo;Last updated&rdquo; date.
            Continued use of the Services after changes constitutes acceptance of
            the updated policy, except where prohibited by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary">
            12. Contact
          </h2>
          <p className="mt-3">
            For privacy-related questions or requests, contact us at{" "}
            <a
              href="mailto:support@ultimaspark.com"
              className="font-medium text-primary underline-offset-4 hover:text-spark hover:underline"
            >
              support@ultimaspark.com
            </a>
            . We will respond within a reasonable timeframe.
          </p>
        </section>
      </div>

      <div className="mx-auto mt-12 max-w-3xl border-t border-border pt-8 text-sm text-text-secondary">
        <Link
          href="/"
          className="font-medium text-primary hover:text-spark hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    </section>
  );
}
