import Link from "next/link";
import { FooterNewsletterForm } from "./FooterNewsletterForm";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface/60">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-primary">
                Ultima
              </span>
              <span className="bg-gradient-to-r from-primary to-spark bg-clip-text text-lg font-bold tracking-tight text-transparent">
                Spark
              </span>
              <span className="text-sm font-medium text-text-secondary">
                Academy
              </span>
            </Link>
            <p className="max-w-sm text-sm text-text-secondary">
              Builder-first cohorts for AI automation, vibe coding, and modern creation.
              Learn by shipping real projects.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Learn
              </p>
              <ul className="space-y-1 text-sm text-text-secondary">
                <li>
                  <Link href="/courses" className="transition-colors hover:text-spark">
                    Courses
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Company
              </p>
              <ul className="space-y-1 text-sm text-text-secondary">
                <li>
                  <Link href="/about" className="transition-colors hover:text-spark">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/our-goals"
                    className="transition-colors hover:text-spark"
                  >
                    Our Goals
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="transition-colors hover:text-spark"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/testimonials/submit"
                    className="transition-colors hover:text-spark"
                  >
                    Submit Testimonial
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="transition-colors hover:text-spark"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings"
                    className="transition-colors hover:text-spark"
                  >
                    Settings
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Stay in the loop
            </p>
            <p className="text-sm text-text-secondary">
              New cohorts, templates, and recordings — shipped regularly.
            </p>
            <FooterNewsletterForm />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-text-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} UltimaSpark Academy. All rights reserved.
          </p>
          <p className="text-text-secondary sm:text-right">
            Warm minimal • soft spark accents
          </p>
        </div>
      </div>
    </footer>
  );
}

