"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";

import { subscribeNewsletter } from "@/app/actions/newsletter";

type NewsletterState = {
  success: boolean;
  message?: string;
  error?: string;
};

const initialState: NewsletterState = { success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="h-10 rounded-lg bg-spark px-4 text-sm font-semibold text-text-primary transition hover:bg-spark/90 disabled:opacity-70"
      disabled={pending}
    >
      {pending ? "Subscribing..." : "Subscribe"}
    </button>
  );
}

export function FooterNewsletterForm() {
  const [state, formAction] = useFormState(subscribeNewsletter, initialState);

  return (
    <div className="space-y-2">
      <form action={formAction}>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            name="email"
            type="email"
            placeholder="Email address"
            className="h-10 w-full rounded-lg border border-primary/20 bg-bg px-3 text-sm text-text-primary placeholder:text-text-secondary/70 outline-none focus:border-spark"
            required
          />
          <SubmitButton />
        </div>
      </form>

      {state.success && (
        <p className="text-xs text-growth">{state.message}</p>
      )}
      {state.error && (
        <p className="text-xs text-spark">{state.error}</p>
      )}
    </div>
  );
}

