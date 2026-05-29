"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  listClients,
  updateClient,
  updateOnboardingStep,
  addUpsellEntry,
  addPaymentEntry,
  addClient,
  type AgencyClient,
} from "@/app/actions/agency";

type DetailTab = "overview" | "onboarding" | "upsell" | "payments";

const TIER_STYLES: Record<string, string> = {
  starter: "border-blue-400/40 bg-blue-400/10 text-blue-400",
  growth: "border-yellow-400/40 bg-yellow-400/10 text-yellow-400",
  full_stack: "border-[#1D9E75]/40 bg-[#1D9E75]/10 text-[#1D9E75]",
};

const STATUS_STYLES: Record<string, string> = {
  onboarding: "border-orange-400/40 bg-orange-400/10 text-orange-400",
  live: "border-growth/40 bg-growth/10 text-growth",
  paused: "border-border bg-bg text-text-secondary",
  churned: "border-red-400/40 bg-red-400/10 text-red-400",
};

const ONBOARDING_LABELS: Record<string, string> = {
  twilio_number: "Twilio Number Set Up",
  dialog360_registered: "Dialog360 Registered",
  n8n_workflow_cloned: "n8n Workflow Cloned",
  claude_prompt_configured: "Claude Prompt Configured",
  test_completed: "Test Completed",
  marked_live: "Marked Live",
};

const DEFAULT_STEPS: Record<string, boolean> = {
  twilio_number: false,
  dialog360_registered: false,
  n8n_workflow_cloned: false,
  claude_prompt_configured: false,
  test_completed: false,
  marked_live: false,
};

function Badge({ value, styles }: { value: string; styles: Record<string, string> }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
        styles[value] ?? "border-border bg-bg text-text-secondary"
      }`}
    >
      {value.replace("_", " ")}
    </span>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-border/40 ${className}`} />;
}

function Naira({ amount }: { amount: number | null }) {
  if (amount == null) return <span>—</span>;
  return <span>₦{amount.toLocaleString()}</span>;
}

export function ClientsManager() {
  const [clients, setClients] = useState<AgencyClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [tierFilter, setTierFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedClient, setSelectedClient] = useState<AgencyClient | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");
  const [addOpen, setAddOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const data = await listClients({
        tier: tierFilter || undefined,
        status: statusFilter || undefined,
      });
      if (!cancelled) {
        setClients(data);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tierFilter, statusFilter, refreshKey]);

  const notify = (type: "success" | "error", msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 3000);
  };

  const refreshAndSelect = () => {
    setSelectedClient(null);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-4">
      {notification && (
        <div
          className={`rounded-lg border p-3 text-sm ${
            notification.type === "success"
              ? "border-growth/30 bg-growth/10 text-growth"
              : "border-spark/30 bg-spark/10 text-text-primary"
          }`}
        >
          {notification.type === "error" && (
            <span className="font-semibold text-spark">Error: </span>
          )}
          {notification.msg}
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <div className="min-w-[120px]">
            <label className="mb-1 block text-xs font-medium text-text-secondary">
              Service Tier
            </label>
            <Select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}>
              <option value="">All</option>
              <option value="starter">Starter</option>
              <option value="growth">Growth</option>
              <option value="full_stack">Full Stack</option>
            </Select>
          </div>
          <div className="min-w-[120px]">
            <label className="mb-1 block text-xs font-medium text-text-secondary">
              Status
            </label>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All</option>
              <option value="onboarding">Onboarding</option>
              <option value="live">Live</option>
              <option value="paused">Paused</option>
              <option value="churned">Churned</option>
            </Select>
          </div>
        </div>
        <Button
          className="bg-growth text-white hover:bg-growth/90"
          onClick={() => setAddOpen(true)}
        >
          + Add New Client
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <div className="rounded-xl border border-spark/30 bg-spark/10 p-4 text-sm text-text-primary">
          No clients found{tierFilter || statusFilter ? " for this filter" : ""}.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setSelectedClient(c);
                setDetailTab("overview");
              }}
              className="rounded-xl border border-border bg-surface p-5 text-left shadow-sm transition hover:border-spark hover:shadow-md"
            >
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-bold text-text-primary">{c.name}</h4>
                <Badge value={c.status} styles={STATUS_STYLES} />
              </div>
              <p className="text-sm text-text-secondary">{c.business_name ?? "—"}</p>
              <div className="mt-3 flex items-center gap-2">
                <Badge value={c.service_tier ?? "starter"} styles={TIER_STYLES} />
                <span className="text-sm font-semibold text-primary">
                  <Naira amount={c.monthly_retainer} />
                  /mo
                </span>
              </div>
              {c.start_date && (
                <p className="mt-2 text-xs text-text-secondary">
                  Since {new Date(c.start_date).toLocaleDateString()}
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      {selectedClient && (
        <ClientDetailPanel
          client={selectedClient}
          tab={detailTab}
          onTabChange={setDetailTab}
          onClose={() => setSelectedClient(null)}
          onNotify={notify}
          isPending={isPending}
          startTransition={startTransition}
          onRefresh={refreshAndSelect}
        />
      )}

      {addOpen && (
        <AddClientDialog
          onClose={() => setAddOpen(false)}
          onAdded={() => {
            setAddOpen(false);
            setRefreshKey((k) => k + 1);
            notify("success", "Client added");
          }}
        />
      )}
    </div>
  );
}

function ClientDetailPanel({
  client,
  tab,
  onTabChange,
  onClose,
  onNotify,
  isPending,
  startTransition,
  onRefresh,
}: {
  client: AgencyClient;
  tab: DetailTab;
  onTabChange: (t: DetailTab) => void;
  onClose: () => void;
  onNotify: (type: "success" | "error", msg: string) => void;
  isPending: boolean;
  startTransition: (fn: () => void) => void;
  onRefresh: () => void;
}) {
  const tabs: { key: DetailTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "onboarding", label: "Onboarding" },
    { key: "upsell", label: "Upsell Tracker" },
    { key: "payments", label: "Payments" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-2xl overflow-y-auto border-l border-border bg-bg p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-primary">{client.name}</h3>
          <Button size="sm" variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </div>

        <div className="mb-4 flex gap-1 border-b border-border pb-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => onTabChange(t.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                tab === t.key
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-surface hover:text-primary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <OverviewTab client={client} onNotify={onNotify} isPending={isPending} startTransition={startTransition} onRefresh={onRefresh} />
        )}
        {tab === "onboarding" && (
          <OnboardingTab client={client} onNotify={onNotify} isPending={isPending} startTransition={startTransition} onRefresh={onRefresh} />
        )}
        {tab === "upsell" && (
          <UpsellTab client={client} onNotify={onNotify} isPending={isPending} startTransition={startTransition} onRefresh={onRefresh} />
        )}
        {tab === "payments" && (
          <PaymentsTab client={client} onNotify={onNotify} isPending={isPending} startTransition={startTransition} onRefresh={onRefresh} />
        )}
      </div>
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2 py-1">
      <span className="w-40 shrink-0 text-xs text-text-secondary">{label}</span>
      <span className="text-sm text-text-primary">{value ?? "—"}</span>
    </div>
  );
}

function OverviewTab({
  client,
  onNotify,
  isPending,
  startTransition,
  onRefresh,
}: {
  client: AgencyClient;
  onNotify: (type: "success" | "error", msg: string) => void;
  isPending: boolean;
  startTransition: (fn: () => void) => void;
  onRefresh: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: client.name,
    business_name: client.business_name ?? "",
    email: client.email ?? "",
    whatsapp: client.whatsapp ?? "",
    whatsapp_number: client.whatsapp_number ?? "",
    catalog_url: client.catalog_url ?? "",
    n8n_workflow_id: client.n8n_workflow_id ?? "",
    claude_prompt_notes: client.claude_prompt_notes ?? "",
    notes: client.notes ?? "",
    service_tier: client.service_tier ?? "starter",
    monthly_retainer: client.monthly_retainer?.toString() ?? "",
    setup_fee: client.setup_fee?.toString() ?? "",
    start_date: client.start_date ?? "",
    status: client.status,
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateClient(client.id, {
        name: form.name,
        business_name: form.business_name || null,
        email: form.email || null,
        whatsapp: form.whatsapp || null,
        whatsapp_number: form.whatsapp_number || null,
        catalog_url: form.catalog_url || null,
        n8n_workflow_id: form.n8n_workflow_id || null,
        claude_prompt_notes: form.claude_prompt_notes || null,
        notes: form.notes || null,
        service_tier: form.service_tier,
        monthly_retainer: form.monthly_retainer ? Number(form.monthly_retainer) : null,
        setup_fee: form.setup_fee ? Number(form.setup_fee) : null,
        start_date: form.start_date || null,
        status: form.status,
      });
      if (res.success) {
        onNotify("success", "Client updated");
        setEditing(false);
        onRefresh();
      } else {
        onNotify("error", res.error);
      }
    });
  };

  if (!editing) {
    return (
      <div className="space-y-3">
        <div className="flex justify-end">
          <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
            Edit
          </Button>
        </div>
        <FieldRow label="Name" value={client.name} />
        <FieldRow label="Business" value={client.business_name} />
        <FieldRow label="Email" value={client.email} />
        <FieldRow label="WhatsApp" value={client.whatsapp} />
        <FieldRow label="WhatsApp Number" value={client.whatsapp_number} />
        <FieldRow label="Service Tier" value={<Badge value={client.service_tier ?? "starter"} styles={TIER_STYLES} />} />
        <FieldRow label="Monthly Retainer" value={<Naira amount={client.monthly_retainer} />} />
        <FieldRow label="Setup Fee" value={<Naira amount={client.setup_fee} />} />
        <FieldRow label="Start Date" value={client.start_date ? new Date(client.start_date).toLocaleDateString() : null} />
        <FieldRow label="Status" value={<Badge value={client.status} styles={STATUS_STYLES} />} />
        <FieldRow label="Catalog URL" value={client.catalog_url} />
        <FieldRow label="n8n Workflow ID" value={client.n8n_workflow_id} />
        <FieldRow label="Claude Prompt Notes" value={client.claude_prompt_notes} />
        <FieldRow label="Notes" value={client.notes} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-text-secondary">Name</label>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text-secondary">Business</label>
          <Input value={form.business_name} onChange={(e) => set("business_name", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text-secondary">Email</label>
          <Input value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text-secondary">WhatsApp</label>
          <Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text-secondary">WhatsApp Number</label>
          <Input value={form.whatsapp_number} onChange={(e) => set("whatsapp_number", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text-secondary">Service Tier</label>
          <Select value={form.service_tier} onChange={(e) => set("service_tier", e.target.value)}>
            <option value="starter">Starter</option>
            <option value="growth">Growth</option>
            <option value="full_stack">Full Stack</option>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text-secondary">Monthly Retainer (₦)</label>
          <Input type="number" value={form.monthly_retainer} onChange={(e) => set("monthly_retainer", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text-secondary">Setup Fee (₦)</label>
          <Input type="number" value={form.setup_fee} onChange={(e) => set("setup_fee", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text-secondary">Start Date</label>
          <Input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text-secondary">Status</label>
          <Select value={form.status} onChange={(e) => set("status", e.target.value)}>
            <option value="onboarding">Onboarding</option>
            <option value="live">Live</option>
            <option value="paused">Paused</option>
            <option value="churned">Churned</option>
          </Select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-text-secondary">Catalog URL</label>
        <Input value={form.catalog_url} onChange={(e) => set("catalog_url", e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-text-secondary">n8n Workflow ID</label>
        <Input value={form.n8n_workflow_id} onChange={(e) => set("n8n_workflow_id", e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-text-secondary">Claude Prompt Notes</label>
        <Textarea value={form.claude_prompt_notes} onChange={(e) => set("claude_prompt_notes", e.target.value)} className="min-h-20" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-text-secondary">Notes</label>
        <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} className="min-h-20" />
      </div>
      <div className="flex gap-2">
        <Button size="sm" className="bg-growth text-white hover:bg-growth/90" disabled={isPending} onClick={handleSave}>
          {isPending ? "Saving..." : "Save"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

function OnboardingTab({
  client,
  onNotify,
  isPending,
  startTransition,
  onRefresh,
}: {
  client: AgencyClient;
  onNotify: (type: "success" | "error", msg: string) => void;
  isPending: boolean;
  startTransition: (fn: () => void) => void;
  onRefresh: () => void;
}) {
  const steps = (client.onboarding_steps ?? DEFAULT_STEPS) as Record<string, boolean>;
  const allDone = Object.values(steps).every(Boolean);

  const handleToggle = (step: string, value: boolean) => {
    startTransition(async () => {
      const res = await updateOnboardingStep(client.id, step, value);
      if (res.success) {
        onNotify("success", value ? "Step completed" : "Step unchecked");
        if (res.allDone) onNotify("success", "All steps done — client moved to live!");
        onRefresh();
      } else {
        onNotify("error", res.error);
      }
    });
  };

  return (
    <div className="space-y-3">
      {allDone && (
        <div className="rounded-lg border border-growth/30 bg-growth/10 p-3 text-sm text-growth font-semibold">
          All onboarding steps completed — client is live!
        </div>
      )}
      {Object.entries(ONBOARDING_LABELS).map(([key, label]) => (
        <label
          key={key}
          className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-surface p-3 transition hover:border-spark"
        >
          <input
            type="checkbox"
            checked={steps[key] ?? false}
            onChange={(e) => handleToggle(key, e.target.checked)}
            disabled={isPending}
            className="accent-primary h-5 w-5"
          />
          <span
            className={`text-sm font-medium ${
              steps[key] ? "text-growth line-through" : "text-text-primary"
            }`}
          >
            {label}
          </span>
        </label>
      ))}
    </div>
  );
}

function UpsellTab({
  client,
  onNotify,
  isPending,
  startTransition,
  onRefresh,
}: {
  client: AgencyClient;
  onNotify: (type: "success" | "error", msg: string) => void;
  isPending: boolean;
  startTransition: (fn: () => void) => void;
  onRefresh: () => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [service, setService] = useState("");
  const [outcome, setOutcome] = useState("pitched");

  const log = (client.upsell_log ?? []) as AgencyClient["upsell_log"];

  const handleAdd = () => {
    if (!service.trim()) return;
    startTransition(async () => {
      const res = await addUpsellEntry(client.id, {
        service: service.trim(),
        pitched_on: new Date().toISOString(),
        outcome,
      });
      if (res.success) {
        onNotify("success", "Upsell entry added");
        setService("");
        setOutcome("pitched");
        setShowAdd(false);
        onRefresh();
      } else {
        onNotify("error", res.error);
      }
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" className="bg-growth text-white hover:bg-growth/90" onClick={() => setShowAdd(!showAdd)}>
          + Add Entry
        </Button>
      </div>

      {showAdd && (
        <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3">
          <div className="flex-1 min-w-[150px]">
            <label className="mb-1 block text-xs font-medium text-text-secondary">Service</label>
            <Input value={service} onChange={(e) => setService(e.target.value)} placeholder="e.g. Advanced Chatbot" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">Outcome</label>
            <Select value={outcome} onChange={(e) => setOutcome(e.target.value)}>
              <option value="pitched">Pitched</option>
              <option value="interested">Interested</option>
              <option value="converted">Converted</option>
              <option value="rejected">Rejected</option>
            </Select>
          </div>
          <Button size="sm" className="bg-primary text-white" disabled={isPending} onClick={handleAdd}>
            Save
          </Button>
        </div>
      )}

      {log.length === 0 ? (
        <p className="text-sm text-text-secondary">No upsell entries yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-bg/50 text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="px-3 py-2">Service</th>
                <th className="px-3 py-2">Pitched On</th>
                <th className="px-3 py-2">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {log.map((entry, i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-text-primary">{entry.service}</td>
                  <td className="px-3 py-2 text-xs text-text-secondary">
                    {new Date(entry.pitched_on).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                        entry.outcome === "converted"
                          ? "border-growth/40 bg-growth/10 text-growth"
                          : entry.outcome === "interested"
                            ? "border-yellow-400/40 bg-yellow-400/10 text-yellow-400"
                            : entry.outcome === "rejected"
                              ? "border-red-400/40 bg-red-400/10 text-red-400"
                              : "border-border bg-bg text-text-secondary"
                      }`}
                    >
                      {entry.outcome}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PaymentsTab({
  client,
  onNotify,
  isPending,
  startTransition,
  onRefresh,
}: {
  client: AgencyClient;
  onNotify: (type: "success" | "error", msg: string) => void;
  isPending: boolean;
  startTransition: (fn: () => void) => void;
  onRefresh: () => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [paidOn, setPaidOn] = useState("");
  const [payStatus, setPayStatus] = useState("paid");

  const log = (client.payment_log ?? []) as AgencyClient["payment_log"];

  const handleAdd = () => {
    if (!month || !amount) return;
    startTransition(async () => {
      const res = await addPaymentEntry(client.id, {
        month,
        amount: Number(amount),
        paid_on: paidOn || new Date().toISOString(),
        status: payStatus,
      });
      if (res.success) {
        onNotify("success", "Payment entry added");
        setMonth("");
        setAmount("");
        setPaidOn("");
        setPayStatus("paid");
        setShowAdd(false);
        onRefresh();
      } else {
        onNotify("error", res.error);
      }
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" className="bg-growth text-white hover:bg-growth/90" onClick={() => setShowAdd(!showAdd)}>
          + Add Payment
        </Button>
      </div>

      {showAdd && (
        <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">Month</label>
            <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="w-[160px]" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">Amount (₦)</label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-[120px]" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">Paid On</label>
            <Input type="date" value={paidOn} onChange={(e) => setPaidOn(e.target.value)} className="w-[150px]" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">Status</label>
            <Select value={payStatus} onChange={(e) => setPayStatus(e.target.value)}>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="pending">Pending</option>
            </Select>
          </div>
          <Button size="sm" className="bg-primary text-white" disabled={isPending} onClick={handleAdd}>
            Save
          </Button>
        </div>
      )}

      {log.length === 0 ? (
        <p className="text-sm text-text-secondary">No payment entries yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-bg/50 text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="px-3 py-2">Month</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Paid On</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {log.map((entry, i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-text-primary">{entry.month}</td>
                  <td className="px-3 py-2 text-text-primary">
                    <Naira amount={entry.amount} />
                  </td>
                  <td className="px-3 py-2 text-xs text-text-secondary">
                    {entry.paid_on ? new Date(entry.paid_on).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                        entry.status === "paid"
                          ? "border-growth/40 bg-growth/10 text-growth"
                          : entry.status === "overdue"
                            ? "border-red-400/40 bg-red-400/10 text-red-400"
                            : "border-yellow-400/40 bg-yellow-400/10 text-yellow-400"
                      }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AddClientDialog({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    business_name: "",
    email: "",
    whatsapp: "",
    service_tier: "starter",
    monthly_retainer: "",
    setup_fee: "",
    start_date: "",
    whatsapp_number: "",
    catalog_url: "",
    n8n_workflow_id: "",
    claude_prompt_notes: "",
    notes: "",
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setError("Client name is required");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await addClient({
        name: form.name.trim(),
        business_name: form.business_name.trim() || null,
        email: form.email.trim() || null,
        whatsapp: form.whatsapp.trim() || null,
        whatsapp_number: form.whatsapp_number.trim() || null,
        catalog_url: form.catalog_url.trim() || null,
        n8n_workflow_id: form.n8n_workflow_id.trim() || null,
        claude_prompt_notes: form.claude_prompt_notes.trim() || null,
        notes: form.notes.trim() || null,
        service_tier: form.service_tier,
        monthly_retainer: form.monthly_retainer ? Number(form.monthly_retainer) : null,
        setup_fee: form.setup_fee ? Number(form.setup_fee) : null,
        start_date: form.start_date || null,
        status: "onboarding",
        onboarding_steps: { ...DEFAULT_STEPS },
        upsell_log: [],
        payment_log: [],
      });
      if (res.success) {
        onAdded();
      } else {
        setError(res.error);
      }
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">Name *</label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">Business</label>
            <Input value={form.business_name} onChange={(e) => set("business_name", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">Email</label>
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">WhatsApp</label>
            <Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">Service Tier</label>
            <Select value={form.service_tier} onChange={(e) => set("service_tier", e.target.value)}>
              <option value="starter">Starter</option>
              <option value="growth">Growth</option>
              <option value="full_stack">Full Stack</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">Monthly Retainer (₦)</label>
            <Input type="number" value={form.monthly_retainer} onChange={(e) => set("monthly_retainer", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">Setup Fee (₦)</label>
            <Input type="number" value={form.setup_fee} onChange={(e) => set("setup_fee", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">Start Date</label>
            <Input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} />
          </div>
        </div>
        {error && (
          <p className="text-xs text-spark">
            <span className="font-semibold">Error:</span> {error}
          </p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-growth text-white hover:bg-growth/90" disabled={isPending} onClick={handleSubmit}>
            {isPending ? "Adding..." : "Add Client"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
