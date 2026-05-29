/*
  Supabase table: unified_leads

  CREATE TABLE IF NOT EXISTS public.unified_leads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    brand text NOT NULL DEFAULT 'agency',
    name text NOT NULL,
    email text NOT NULL,
    whatsapp text,
    business_name text,
    product_category text,
    interest text,
    source text,
    status text NOT NULL DEFAULT 'new',
    subscribed boolean NOT NULL DEFAULT true,
    notes text,
    converted_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
  );

  ALTER TABLE public.unified_leads ENABLE ROW LEVEL SECURITY;

  GRANT SELECT, INSERT, UPDATE, DELETE ON public.unified_leads TO service_role;
  CREATE POLICY "unified_leads_service_role_all" ON public.unified_leads
    FOR ALL TO service_role USING (true) WITH CHECK (true);
*/

import { LeadsManager } from "@/components/admin/LeadsManager";

export const metadata = {
  title: "Leads Admin",
};

export const dynamic = "force-dynamic";

export default function AdminLeadsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold text-primary">Manage Leads</h2>
        <p className="text-sm text-text-secondary sm:text-base">
          View, filter, and manage all agency and academy leads in one place.
        </p>
      </header>
      <LeadsManager />
    </div>
  );
}
