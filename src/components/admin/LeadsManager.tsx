"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  listLeads,
  updateLeadStatus,
  unsubscribeLead,
  addLeadNote,
  addLead,
  bulkUpdateLeadStatus,
  getLeadFilterOptions,
  type UnifiedLead,
  type ListLeadsParams,
} from "@/app/actions/agency";

type BrandTab = "agency" | "academy";
type StatusFilter = "" | "new" | "contacted" | "nurture" | "converted" | "unsubscribed";

const STATUS_STYLES: Record<string, string> = {
  new: "border-blue-400/40 bg-blue-400/10 text-blue-400",
  contacted: "border-yellow-400/40 bg-yellow-400/10 text-yellow-400",
  nurture: "border-purple-400/40 bg-purple-400/10 text-purple-400",
  converted: "border-growth/40 bg-growth/10 text-growth",
  unsubscribed: "border-border bg-bg text-text-secondary",
};

function StatusBadge({ status }: { status: string }) {
  const s = (status ?? "").toLowerCase();
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[s] ?? STATUS_STYLES.new}`}
    >
      {s || "unknown"}
    </span>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-border/40 ${className}`} />
  );
}

export function LeadsManager() {
  const [brand, setBrand] = useState<BrandTab>("agency");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [leads, setLeads] = useState<UnifiedLead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [notification, setNotification] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [filterOptions, setFilterOptions] = useState<{ sources: string[]; categories: string[] }>({
    sources: [],
    categories: [],
  });

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detailLead, setDetailLead] = useState<UnifiedLead | null>(null);
  const [noteModal, setNoteModal] = useState<UnifiedLead | null>(null);
  const [noteText, setNoteText] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const pageSize = 25;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const params: ListLeadsParams = {
        brand,
        status: statusFilter || undefined,
        source: sourceFilter || undefined,
        productCategory: categoryFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        page,
        pageSize,
      };
      const result = await listLeads(params);
      if (!cancelled) {
        setLeads(result.data);
        setTotal(result.total);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [brand, statusFilter, sourceFilter, categoryFilter, dateFrom, dateTo, page, refreshKey]);

  useEffect(() => {
    let cancelled = false;
    getLeadFilterOptions().then((opts) => {
      if (!cancelled) setFilterOptions(opts);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const resetFilters = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setPage(1);
    setSelected(new Set());
  };

  const resetStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as StatusFilter);
    setPage(1);
    setSelected(new Set());
  };

  const notify = (type: "success" | "error", msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === leads.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(leads.map((l) => l.id)));
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    startTransition(async () => {
      const res = await updateLeadStatus(id, status);
      if (res.success) {
        notify("success", "Status updated");
        setRefreshKey((k) => k + 1);
      } else {
        notify("error", res.error);
      }
    });
  };

  const handleUnsubscribe = (id: string) => {
    startTransition(async () => {
      const res = await unsubscribeLead(id);
      if (res.success) {
        notify("success", "Lead unsubscribed");
        setRefreshKey((k) => k + 1);
      } else {
        notify("error", res.error);
      }
    });
  };

  const handleAddNote = () => {
    if (!noteModal || !noteText.trim()) return;
    startTransition(async () => {
      const res = await addLeadNote(noteModal.id, noteText.trim());
      if (res.success) {
        notify("success", "Note added");
        setNoteModal(null);
        setNoteText("");
        setRefreshKey((k) => k + 1);
      } else {
        notify("error", res.error);
      }
    });
  };

  const handleBulkNurture = () => {
    if (selected.size === 0) return;
    startTransition(async () => {
      const res = await bulkUpdateLeadStatus([...selected], "nurture");
      if (res.success) {
        notify("success", `${selected.size} leads moved to nurture`);
        setSelected(new Set());
        setRefreshKey((k) => k + 1);
      } else {
        notify("error", res.error);
      }
    });
  };

  const handleExportCsv = () => {
    const rows = leads.filter((l) => selected.size === 0 || selected.has(l.id));
    if (rows.length === 0) return;
    const headers = [
      "name",
      "email",
      "whatsapp",
      "business_name",
      "product_category",
      "source",
      "status",
      "created_at",
    ];
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        headers
          .map((h) => {
            const val = String((r as Record<string, unknown>)[h] ?? "");
            return `"${val.replace(/"/g, '""')}"`;
          })
          .join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${brand}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

      <div className="flex flex-wrap items-center gap-2">
        {(["agency", "academy"] as BrandTab[]).map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => {
              setBrand(b);
              setPage(1);
              setSelected(new Set());
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              brand === b
                ? "bg-primary text-white shadow-sm"
                : "border border-border bg-surface text-text-secondary hover:border-spark hover:text-spark"
            }`}
          >
            {b === "agency" ? "Agency Leads" : "Academy Leads"}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-surface p-4">
        <div className="min-w-[120px]">
          <label className="mb-1 block text-xs font-medium text-text-secondary">Status</label>
          <Select
            value={statusFilter}
            onChange={resetStatusFilter}
          >
            <option value="">All</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="nurture">Nurture</option>
            <option value="converted">Converted</option>
            <option value="unsubscribed">Unsubscribed</option>
          </Select>
        </div>
        <div className="min-w-[120px]">
          <label className="mb-1 block text-xs font-medium text-text-secondary">Source</label>
          <Select value={sourceFilter} onChange={resetFilters(setSourceFilter)}>
            <option value="">All</option>
            {filterOptions.sources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
        <div className="min-w-[120px]">
          <label className="mb-1 block text-xs font-medium text-text-secondary">Category</label>
          <Select value={categoryFilter} onChange={resetFilters(setCategoryFilter)}>
            <option value="">All</option>
            {filterOptions.categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text-secondary">From</label>
          <Input
            type="date"
            value={dateFrom}
            onChange={resetFilters(setDateFrom)}
            className="h-9 w-[150px]"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text-secondary">To</label>
          <Input
            type="date"
            value={dateTo}
            onChange={resetFilters(setDateTo)}
            className="h-9 w-[150px]"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-purple-400/60 text-purple-400 hover:bg-purple-400/10"
            disabled={isPending || selected.size === 0}
            onClick={handleBulkNurture}
          >
            Move to Nurture ({selected.size})
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-primary/60 text-primary hover:bg-primary/10"
            onClick={handleExportCsv}
          >
            Export CSV
          </Button>
        </div>
        <Button size="sm" className="bg-growth text-white hover:bg-growth/90" onClick={() => setAddOpen(true)}>
          + Add Lead
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-bg/50 text-xs uppercase tracking-wide text-text-secondary">
            <tr>
              <th className="px-3 py-3">
                <input
                  type="checkbox"
                  checked={leads.length > 0 && selected.size === leads.length}
                  onChange={toggleSelectAll}
                  className="accent-primary"
                />
              </th>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3">WhatsApp</th>
              <th className="px-3 py-3">Product Category</th>
              <th className="px-3 py-3">Source</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Date</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <td key={j} className="px-3 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-text-secondary">
                  No leads found for this filter.
                </td>
              </tr>
            ) : (
              leads.map((l) => (
                <tr key={l.id} className="align-top hover:bg-bg/30">
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(l.id)}
                      onChange={() => toggleSelect(l.id)}
                      className="accent-primary"
                    />
                  </td>
                  <td className="px-3 py-3 font-medium text-text-primary">{l.name}</td>
                  <td className="px-3 py-3 text-text-secondary">{l.email}</td>
                  <td className="px-3 py-3 text-text-secondary">{l.whatsapp ?? "—"}</td>
                  <td className="px-3 py-3 text-text-secondary">{l.product_category ?? "—"}</td>
                  <td className="px-3 py-3 text-text-secondary">{l.source ?? "—"}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={l.status} />
                  </td>
                  <td className="px-3 py-3 text-xs text-text-secondary">
                    {new Date(l.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-col items-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => setDetailLead(l)}
                      >
                        View
                      </Button>
                      <Select
                        value={l.status}
                        onChange={(e) => handleStatusChange(l.id, e.target.value)}
                        className="h-7 max-w-[130px] text-[11px]"
                      >
                        <option value="new">new</option>
                        <option value="contacted">contacted</option>
                        <option value="nurture">nurture</option>
                        <option value="converted">converted</option>
                        <option value="unsubscribed">unsubscribed</option>
                      </Select>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => {
                            setNoteModal(l);
                            setNoteText("");
                          }}
                        >
                          Note
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 border-destructive/60 text-destructive text-xs hover:bg-destructive/10"
                          onClick={() => handleUnsubscribe(l.id)}
                          disabled={isPending}
                        >
                          Unsub
                        </Button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span>
          Showing {leads.length} of {total} leads
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="flex items-center px-2 text-xs">
            Page {page} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>

      {detailLead && (
        <LeadDetailPanel lead={detailLead} onClose={() => setDetailLead(null)} />
      )}

      {noteModal && (
        <Dialog open onOpenChange={() => setNoteModal(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Note — {noteModal.name}</DialogTitle>
            </DialogHeader>
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Type your note here..."
              className="min-h-24"
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setNoteModal(null)}>
                Cancel
              </Button>
              <Button
                className="bg-primary text-white"
                disabled={isPending || !noteText.trim()}
                onClick={handleAddNote}
              >
                Save Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {addOpen && (
        <AddLeadDialog
          brand={brand}
          onClose={() => setAddOpen(false)}
          onAdded={() => {
            setAddOpen(false);
            setRefreshKey((k) => k + 1);
            notify("success", "Lead added");
          }}
        />
      )}
    </div>
  );
}

function LeadDetailPanel({ lead, onClose }: { lead: UnifiedLead; onClose: () => void }) {
  const notes = lead.notes ?? "";
  const noteEntries = notes.split("\n---\n").filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg overflow-y-auto border-l border-border bg-bg p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-primary">Lead Details</h3>
          <Button size="sm" variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </div>
        <div className="space-y-3 text-sm">
          <DetailRow label="Name" value={lead.name} />
          <DetailRow label="Email" value={lead.email} />
          <DetailRow label="WhatsApp" value={lead.whatsapp} />
          <DetailRow label="Brand" value={lead.brand} />
          <DetailRow label="Business Name" value={lead.business_name} />
          <DetailRow label="Product Category" value={lead.product_category} />
          <DetailRow label="Interest" value={lead.interest} />
          <DetailRow label="Source" value={lead.source} />
          <DetailRow label="Status" value={lead.status} />
          <DetailRow label="Subscribed" value={lead.subscribed ? "Yes" : "No"} />
          <DetailRow
            label="Converted At"
            value={lead.converted_at ? new Date(lead.converted_at).toLocaleString() : null}
          />
          <DetailRow
            label="Created At"
            value={new Date(lead.created_at).toLocaleString()}
          />
        </div>

        <div className="mt-6">
          <h4 className="mb-2 text-sm font-semibold text-primary">Notes History</h4>
          {noteEntries.length === 0 ? (
            <p className="text-xs text-text-secondary">No notes yet.</p>
          ) : (
            <div className="space-y-2">
              {noteEntries.map((n, i) => (
                <div key={i} className="rounded-lg border border-border bg-surface p-3 text-xs text-text-secondary whitespace-pre-wrap">
                  {n}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex gap-2">
      <span className="w-36 shrink-0 text-text-secondary">{label}</span>
      <span className="text-text-primary">{value ?? "—"}</span>
    </div>
  );
}

function AddLeadDialog({
  brand,
  onClose,
  onAdded,
}: {
  brand: string;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    business_name: "",
    product_category: "",
    interest: "",
    source: "",
    status: "new",
  });

  const set = (k: string, v: string) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await addLead({
        brand,
        name: form.name.trim(),
        email: form.email.trim(),
        whatsapp: form.whatsapp.trim() || null,
        business_name: form.business_name.trim() || null,
        product_category: form.product_category.trim() || null,
        interest: form.interest.trim() || null,
        source: form.source.trim() || null,
        status: form.status,
        subscribed: true,
        notes: null,
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
          <DialogTitle>Add Lead Manually</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">Name *</label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">Email *</label>
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">WhatsApp</label>
            <Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">Business Name</label>
            <Input value={form.business_name} onChange={(e) => set("business_name", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">Product Category</label>
            <Input value={form.product_category} onChange={(e) => set("product_category", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">Source</label>
            <Input value={form.source} onChange={(e) => set("source", e.target.value)} placeholder="e.g. website, referral" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-text-secondary">Interest</label>
            <Input value={form.interest} onChange={(e) => set("interest", e.target.value)} />
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
            {isPending ? "Adding..." : "Add Lead"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
