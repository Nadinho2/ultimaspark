/*
  Supabase table: agency_clients

  CREATE TABLE IF NOT EXISTS public.agency_clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    business_name text,
    whatsapp text,
    email text,
    service_tier text,
    monthly_retainer numeric,
    setup_fee numeric,
    start_date date,
    status text NOT NULL DEFAULT 'onboarding',
    whatsapp_number text,
    catalog_url text,
    n8n_workflow_id text,
    claude_prompt_notes text,
    onboarding_steps jsonb NOT NULL DEFAULT '{
      "twilio_number": false,
      "dialog360_registered": false,
      "n8n_workflow_cloned": false,
      "claude_prompt_configured": false,
      "test_completed": false,
      "marked_live": false
    }'::jsonb,
    upsell_log jsonb NOT NULL DEFAULT '[]'::jsonb,
    payment_log jsonb NOT NULL DEFAULT '[]'::jsonb,
    notes text,
    created_at timestamptz NOT NULL DEFAULT now()
  );

  ALTER TABLE public.agency_clients ENABLE ROW LEVEL SECURITY;

  GRANT SELECT, INSERT, UPDATE, DELETE ON public.agency_clients TO service_role;
  CREATE POLICY "agency_clients_service_role_all" ON public.agency_clients
    FOR ALL TO service_role USING (true) WITH CHECK (true);
*/

import { ClientsManager } from "@/components/admin/ClientsManager";

export const metadata = {
  title: "Agency Clients Admin",
};

export const dynamic = "force-dynamic";

export default function AdminClientsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold text-primary">Agency Clients</h2>
        <p className="text-sm text-text-secondary sm:text-base">
          Manage client onboarding, track upsells, and log payments for your agency services.
        </p>
      </header>
      <ClientsManager />
    </div>
  );
}
