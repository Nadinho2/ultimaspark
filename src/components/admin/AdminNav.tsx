"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links: { href: string; label: string; match: (path: string) => boolean }[] =
  [
    {
      href: "/admin",
      label: "Students",
      match: (p) =>
        p === "/admin" ||
        p.startsWith("/admin/testimonials") ||
        p.startsWith("/admin/users"),
    },
    {
      href: "/admin/subscription",
      label: "Subscription videos",
      match: (p) => p === "/admin/subscription" || p.startsWith("/admin/subscription/"),
    },
    {
      href: "/admin/cohort",
      label: "Cohort videos",
      match: (p) => p === "/admin/cohort" || p.startsWith("/admin/cohort/"),
    },
  ];

export function AdminNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav
      className="flex flex-wrap gap-2 border-b border-border pb-4"
      aria-label="Admin sections"
    >
      {links.map(({ href, label, match }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition",
            match(pathname)
              ? "bg-primary text-white shadow-sm"
              : "text-text-secondary hover:bg-surface hover:text-primary",
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
