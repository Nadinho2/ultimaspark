"use server";

import { Resend } from "resend";

type NewsletterState = {
  success: boolean;
  message?: string;
  error?: string;
};

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

function normalizeEmail(email: string | null): string | null {
  const e = email?.trim().toLowerCase() ?? null;
  if (!e) return null;
  // Lightweight validation (Resend will also validate)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return null;
  return e;
}

function newsletterHtml({ email }: { email: string }) {
  const primary = "#7C3AED";
  const spark = "#F59E0B";
  const bg = "#F9FAFB";
  const text = "#111827";

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${bg};color:${text};font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
    <div style="max-width:600px;margin:0 auto;padding:24px">
      <h1 style="margin:0 0 12px;font-size:20px;letter-spacing:0.01em;color:${primary}">
        Welcome to UltimaSpark Academy
      </h1>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#4B5563">
        Thanks for subscribing${email ? `, ${email}` : ""}! We will send you updates about new cohorts, templates, and recordings.
      </p>
      <div style="padding:12px 16px;border-radius:12px;border:1px solid rgba(124,58,237,0.2);background:rgba(124,58,237,0.06)">
        <p style="margin:0;font-size:14px;line-height:1.6;color:${text}">
          Next up: your inbox gets a weekly spark.
        </p>
        <p style="margin:10px 0 0;font-size:12px;color:#6B7280">
          If you didn’t subscribe, you can ignore this email.
        </p>
      </div>
      <p style="margin:18px 0 0;font-size:12px;color:#6B7280">
        © ${new Date().getFullYear()} UltimaSpark Academy
      </p>
      <p style="margin:6px 0 0;font-size:12px;color:#6B7280">
        Dashboard:
        <a href="https://ultimaspark.com/dashboard" style="color:${spark};text-decoration:underline">https://ultimaspark.com/dashboard</a>
      </p>
    </div>
  </body>
</html>`;
}

export async function subscribeNewsletter(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  try {
    if (!resend) {
      return { success: false, error: "Resend not configured." };
    }

    const email = normalizeEmail(formData.get("email") as string | null);
    if (!email) {
      return { success: false, error: "Please enter a valid email address." };
    }

    // Best-effort welcome email to the subscriber.
    await resend.emails.send({
      from: "UltimaSpark Academy <noreply@ultimaspark.com>",
      to: email,
      subject: "You’re in! UltimaSpark Academy updates are coming",
      html: newsletterHtml({ email }),
    });

    return {
      success: true,
      message: "Subscribed! Check your inbox for a welcome email.",
    };
  } catch (err) {
    console.error("subscribeNewsletter error:", err);
    return { success: false, error: "Failed to subscribe. Please try again." };
  }
}

