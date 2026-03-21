"use client";

import Link from "next/link";
import Image from "next/image";
import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function Header() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/95 text-text-primary backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-1 md:gap-2">
          <Image
            src="/ultimaspark-logo.png"
            alt="UltimaSpark Academy"
            width={180}
            height={52}
            className="h-9 w-auto md:h-10"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-text-secondary md:flex">
          <Link href="/" className="transition-colors hover:text-spark">
            Home
          </Link>
          <Link href="/courses" className="transition-colors hover:text-spark">
            Courses
          </Link>
          <Link href="/about" className="transition-colors hover:text-spark">
            About Us
          </Link>
          <Link
            href="/our-goals"
            className="transition-colors hover:text-spark"
          >
            Our Goals
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="transition-colors hover:text-spark"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const current = theme ?? "system";
              const next =
                current === "light" ? "dark" : current === "dark" ? "system" : "light";
              setTheme(next);
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg text-text-primary transition hover:bg-surface hover:text-spark"
            aria-label="Toggle theme"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {user ? (
            <UserButton
              appearance={{
                elements: {
                  userButtonPopoverCard:
                    "bg-surface border border-primary/20 text-text-primary",
                },
              }}
            />
          ) : (
            <>
              <Link
                href="/sign-in"
                className="hidden rounded-full border border-border bg-bg px-4 py-1.5 text-sm font-medium text-text-primary shadow-sm transition hover:border-spark hover:text-spark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spark focus-visible:ring-offset-2 focus-visible:ring-offset-bg md:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="hidden rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-spark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spark focus-visible:ring-offset-2 focus-visible:ring-offset-bg md:inline-flex"
              >
                Sign up
              </Link>
            </>
          )}

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-primary/15 bg-bg text-text-secondary transition hover:bg-surface hover:text-spark md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <span className="block h-0.5 w-4 bg-current" />
            <span className="mt-1 block h-0.5 w-4 bg-current" />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-surface/95 px-4 pb-4 pt-2 text-sm text-text-secondary md:hidden">
          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              className="py-1 transition-colors hover:text-spark"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/courses"
              className="py-1 transition-colors hover:text-spark"
              onClick={() => setOpen(false)}
            >
              Courses
            </Link>
            <Link
              href="/about"
              className="py-1 transition-colors hover:text-spark"
              onClick={() => setOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/our-goals"
              className="py-1 transition-colors hover:text-spark"
              onClick={() => setOpen(false)}
            >
              Our Goals
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="py-1 transition-colors hover:text-spark"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {!user && (
            <div className="mt-3 flex gap-2">
              <Link
                href="/sign-in"
                className="flex-1 rounded-full border border-primary/30 bg-bg px-4 py-1.5 text-center text-sm font-medium text-text-primary shadow-sm transition hover:border-spark hover:text-spark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spark focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="flex-1 rounded-full bg-primary px-4 py-1.5 text-center text-sm font-medium text-white shadow-sm transition hover:bg-spark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spark focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                onClick={() => setOpen(false)}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

