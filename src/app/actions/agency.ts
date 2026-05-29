"use server";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function supabase() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    return createSupabaseServiceRoleClient();
  }
  return createSupabaseServerClient();
}

export type UnifiedLead = {
  id: string;
  brand: string;
  name: string;
  email: string;
  whatsapp: string | null;
  business_name: string | null;
  product_category: string | null;
  interest: string | null;
  source: string | null;
  status: string;
  subscribed: boolean;
  notes: string | null;
  converted_at: string | null;
  created_at: string;
};

export type EmailCampaign = {
  id: string;
  brand: string;
  subject: string;
  from_email: string;
  headline: string | null;
  body: string;
  cta_text: string | null;
  cta_url: string | null;
  status: string;
  scheduled_for: string | null;
  sent_at: string | null;
  total_sent: number;
  created_at: string;
};

export type EmailSend = {
  id: string;
  campaign_id: string;
  lead_id: string | null;
  email: string;
  resend_id: string | null;
  opened_at: string | null;
  clicked_at: string | null;
};

export type AgencyClient = {
  id: string;
  name: string;
  business_name: string | null;
  whatsapp: string | null;
  email: string | null;
  service_tier: string | null;
  monthly_retainer: number | null;
  setup_fee: number | null;
  start_date: string | null;
  status: string;
  whatsapp_number: string | null;
  catalog_url: string | null;
  n8n_workflow_id: string | null;
  claude_prompt_notes: string | null;
  onboarding_steps: Record<string, boolean>;
  upsell_log: Array<{
    service: string;
    pitched_on: string;
    outcome: string;
  }>;
  payment_log: Array<{
    month: string;
    amount: number;
    paid_on: string;
    status: string;
  }>;
  notes: string | null;
  created_at: string;
};

export async function getAgencyDashboardStats() {
  try {
    const db = await supabase();

    const [leadsRes, clientsRes, campaignsRes, weekLeadsRes] = await Promise.all([
      db.from("unified_leads").select("id", { count: "exact", head: true }),
      db
        .from("agency_clients")
        .select("id", { count: "exact", head: true })
        .in("status", ["onboarding", "live"]),
      db
        .from("email_campaigns")
        .select("id", { count: "exact", head: true })
        .gte(
          "sent_at",
          new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
        ),
      db
        .from("unified_leads")
        .select("id", { count: "exact", head: true })
        .gte(
          "created_at",
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        ),
    ]);

    return {
      totalLeads: leadsRes.count ?? 0,
      activeClients: clientsRes.count ?? 0,
      emailsThisMonth: campaignsRes.count ?? 0,
      newThisWeek: weekLeadsRes.count ?? 0,
    };
  } catch {
    return { totalLeads: 0, activeClients: 0, emailsThisMonth: 0, newThisWeek: 0 };
  }
}

export async function getRecentLeads(limit = 10) {
  try {
    const db = await supabase();
    const { data } = await db
      .from("unified_leads")
      .select("id, name, business_name, status, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data ?? []) as Pick<
      UnifiedLead,
      "id" | "name" | "business_name" | "status" | "created_at"
    >[];
  } catch {
    return [];
  }
}

export type ListLeadsParams = {
  brand?: string;
  status?: string;
  source?: string;
  productCategory?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
};

export async function listLeads(params: ListLeadsParams) {
  try {
    const db = await supabase();
    const pageSize = params.pageSize ?? 25;
    const page = params.page ?? 1;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = db
      .from("unified_leads")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (params.brand) query = query.eq("brand", params.brand);
    if (params.status) query = query.eq("status", params.status);
    if (params.source) query = query.eq("source", params.source);
    if (params.productCategory)
      query = query.eq("product_category", params.productCategory);
    if (params.dateFrom) query = query.gte("created_at", params.dateFrom);
    if (params.dateTo)
      query = query.lte(
        "created_at",
        new Date(new Date(params.dateTo).getTime() + 86400000).toISOString(),
      );

    const { data, error, count } = await query;
    if (error) return { data: [] as UnifiedLead[], total: 0 };
    return { data: (data ?? []) as UnifiedLead[], total: count ?? 0 };
  } catch {
    return { data: [] as UnifiedLead[], total: 0 };
  }
}

export async function getLead(id: string) {
  try {
    const db = await supabase();
    const { data, error } = await db
      .from("unified_leads")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data as UnifiedLead;
  } catch {
    return null;
  }
}

export async function updateLeadStatus(id: string, status: string) {
  try {
    const db = await supabase();
    const update: Record<string, unknown> = { status };
    if (status === "converted") update.converted_at = new Date().toISOString();
    const { error } = await db
      .from("unified_leads")
      .update(update)
      .eq("id", id);
    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  } catch (err) {
    return {
      success: false as const,
      error: err instanceof Error ? err.message : "Failed to update status",
    };
  }
}

export async function unsubscribeLead(id: string) {
  try {
    const db = await supabase();
    const { error } = await db
      .from("unified_leads")
      .update({ subscribed: false, status: "unsubscribed" })
      .eq("id", id);
    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  } catch (err) {
    return {
      success: false as const,
      error: err instanceof Error ? err.message : "Failed to unsubscribe",
    };
  }
}

export async function addLeadNote(id: string, note: string) {
  try {
    const db = await supabase();
    const { data: existing } = await db
      .from("unified_leads")
      .select("notes")
      .eq("id", id)
      .single();
    const prev = (existing?.notes as string) ?? "";
    const timestamp = new Date().toISOString();
    const newNotes = prev
      ? `${prev}\n---\n[${timestamp}] ${note}`
      : `[${timestamp}] ${note}`;
    const { error } = await db
      .from("unified_leads")
      .update({ notes: newNotes })
      .eq("id", id);
    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  } catch (err) {
    return {
      success: false as const,
      error: err instanceof Error ? err.message : "Failed to add note",
    };
  }
}

export async function addLead(
  lead: Omit<UnifiedLead, "id" | "created_at" | "converted_at">,
) {
  try {
    const db = await supabase();
    const { error } = await db.from("unified_leads").insert([lead]);
    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  } catch (err) {
    return {
      success: false as const,
      error: err instanceof Error ? err.message : "Failed to add lead",
    };
  }
}

export async function bulkUpdateLeadStatus(ids: string[], status: string) {
  try {
    const db = await supabase();
    const update: Record<string, unknown> = { status };
    if (status === "converted") update.converted_at = new Date().toISOString();
    const { error } = await db
      .from("unified_leads")
      .update(update)
      .in("id", ids);
    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  } catch (err) {
    return {
      success: false as const,
      error: err instanceof Error ? err.message : "Failed to bulk update",
    };
  }
}

export async function getLeadFilterOptions() {
  try {
    const db = await supabase();
    const { data } = await db
      .from("unified_leads")
      .select("source, product_category");
    const rows = (data ?? []) as { source: string | null; product_category: string | null }[];
    const sources = [...new Set(rows.map((r) => r.source).filter(Boolean))] as string[];
    const categories = [
      ...new Set(rows.map((r) => r.product_category).filter(Boolean)),
    ] as string[];
    return { sources, categories };
  } catch {
    return { sources: [] as string[], categories: [] as string[] };
  }
}

export async function getSubscribedLeadCount(brand: string) {
  try {
    const db = await supabase();
    const { count } = await db
      .from("unified_leads")
      .select("id", { count: "exact", head: true })
      .eq("brand", brand)
      .eq("subscribed", true);
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function listCampaigns(brand?: string) {
  try {
    const db = await supabase();
    let query = db
      .from("email_campaigns")
      .select("*")
      .order("created_at", { ascending: false });
    if (brand) query = query.eq("brand", brand);
    const { data, error } = await query;
    if (error) return [] as EmailCampaign[];
    return (data ?? []) as EmailCampaign[];
  } catch {
    return [] as EmailCampaign[];
  }
}

export async function getCampaignStats(campaignId: string) {
  try {
    const db = await supabase();
    const [sendsRes, openedRes, clickedRes] = await Promise.all([
      db
        .from("email_sends")
        .select("id", { count: "exact", head: true })
        .eq("campaign_id", campaignId),
      db
        .from("email_sends")
        .select("id", { count: "exact", head: true })
        .eq("campaign_id", campaignId)
        .not("opened_at", "is", null),
      db
        .from("email_sends")
        .select("id", { count: "exact", head: true })
        .eq("campaign_id", campaignId)
        .not("clicked_at", "is", null),
    ]);
    return {
      totalSent: sendsRes.count ?? 0,
      opens: openedRes.count ?? 0,
      clicks: clickedRes.count ?? 0,
    };
  } catch {
    return { totalSent: 0, opens: 0, clicks: 0 };
  }
}

export async function getCampaignSends(campaignId: string) {
  try {
    const db = await supabase();
    const { data } = await db
      .from("email_sends")
      .select("id, email, resend_id, opened_at, clicked_at")
      .eq("campaign_id", campaignId)
      .order("opened_at", { ascending: false });
    return (data ?? []) as Pick<
      EmailSend,
      "id" | "email" | "resend_id" | "opened_at" | "clicked_at"
    >[];
  } catch {
    return [];
  }
}

export async function listClients(filters?: { tier?: string; status?: string }) {
  try {
    const db = await supabase();
    let query = db
      .from("agency_clients")
      .select("*")
      .order("created_at", { ascending: false });
    if (filters?.tier) query = query.eq("service_tier", filters.tier);
    if (filters?.status) query = query.eq("status", filters.status);
    const { data, error } = await query;
    if (error) return [] as AgencyClient[];
    return (data ?? []) as AgencyClient[];
  } catch {
    return [] as AgencyClient[];
  }
}

export async function getClient(id: string) {
  try {
    const db = await supabase();
    const { data, error } = await db
      .from("agency_clients")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data as AgencyClient;
  } catch {
    return null;
  }
}

export async function updateClient(
  id: string,
  updates: Partial<
    Omit<AgencyClient, "id" | "created_at" | "onboarding_steps" | "upsell_log" | "payment_log">
  >,
) {
  try {
    const db = await supabase();
    const { error } = await db
      .from("agency_clients")
      .update(updates)
      .eq("id", id);
    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  } catch (err) {
    return {
      success: false as const,
      error: err instanceof Error ? err.message : "Failed to update client",
    };
  }
}

export async function updateOnboardingStep(id: string, step: string, value: boolean) {
  try {
    const db = await supabase();
    const { data: existing } = await db
      .from("agency_clients")
      .select("onboarding_steps")
      .eq("id", id)
      .single();
    const steps = (existing?.onboarding_steps ?? {}) as Record<string, boolean>;
    steps[step] = value;
    const allDone = Object.values(steps).every(Boolean);
    const updates: Record<string, unknown> = { onboarding_steps: steps };
    if (allDone) updates.status = "live";
    const { error } = await db
      .from("agency_clients")
      .update(updates)
      .eq("id", id);
    if (error) return { success: false as const, error: error.message };
    return { success: true as const, allDone };
  } catch (err) {
    return {
      success: false as const,
      error: err instanceof Error ? err.message : "Failed to update onboarding",
    };
  }
}

export async function addUpsellEntry(
  id: string,
  entry: { service: string; pitched_on: string; outcome: string },
) {
  try {
    const db = await supabase();
    const { data: existing } = await db
      .from("agency_clients")
      .select("upsell_log")
      .eq("id", id)
      .single();
    const log = (existing?.upsell_log ?? []) as AgencyClient["upsell_log"];
    log.push(entry);
    const { error } = await db
      .from("agency_clients")
      .update({ upsell_log: log })
      .eq("id", id);
    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  } catch (err) {
    return {
      success: false as const,
      error: err instanceof Error ? err.message : "Failed to add upsell entry",
    };
  }
}

export async function addPaymentEntry(
  id: string,
  entry: { month: string; amount: number; paid_on: string; status: string },
) {
  try {
    const db = await supabase();
    const { data: existing } = await db
      .from("agency_clients")
      .select("payment_log")
      .eq("id", id)
      .single();
    const log = (existing?.payment_log ?? []) as AgencyClient["payment_log"];
    log.push(entry);
    const { error } = await db
      .from("agency_clients")
      .update({ payment_log: log })
      .eq("id", id);
    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  } catch (err) {
    return {
      success: false as const,
      error: err instanceof Error ? err.message : "Failed to add payment entry",
    };
  }
}

export async function addClient(
  client: Omit<AgencyClient, "id" | "created_at">,
) {
  try {
    const db = await supabase();
    const { error } = await db.from("agency_clients").insert([client]);
    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  } catch (err) {
    return {
      success: false as const,
      error: err instanceof Error ? err.message : "Failed to add client",
    };
  }
}
