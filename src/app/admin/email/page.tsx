/*
  Supabase tables:

  CREATE TABLE IF NOT EXISTS public.email_campaigns (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    brand text NOT NULL DEFAULT 'agency',
    subject text NOT NULL,
    from_email text NOT NULL,
    headline text,
    body text NOT NULL,
    cta_text text,
    cta_url text,
    status text NOT NULL DEFAULT 'draft',
    scheduled_for timestamptz,
    sent_at timestamptz,
    total_sent integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS public.email_sends (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id uuid NOT NULL REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
    lead_id uuid REFERENCES public.unified_leads(id) ON DELETE SET NULL,
    email text NOT NULL,
    resend_id text,
    opened_at timestamptz,
    clicked_at timestamptz
  );

  ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.email_sends ENABLE ROW LEVEL SECURITY;

  GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_campaigns TO service_role;
  GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_sends TO service_role;

  CREATE POLICY "email_campaigns_service_role_all" ON public.email_campaigns
    FOR ALL TO service_role USING (true) WITH CHECK (true);
  CREATE POLICY "email_sends_service_role_all" ON public.email_sends
    FOR ALL TO service_role USING (true) WITH CHECK (true);
*/

import { EmailManager } from "@/components/admin/EmailManager";

export const metadata = {
  title: "Email Campaigns Admin",
};

export const dynamic = "force-dynamic";

export default function AdminEmailPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold text-primary">Email Campaigns</h2>
        <p className="text-sm text-text-secondary sm:text-base">
          Compose, preview, and send email campaigns to your leads. Track opens, clicks, and engagement.
        </p>
      </header>
      <EmailManager />
    </div>
  );
}
