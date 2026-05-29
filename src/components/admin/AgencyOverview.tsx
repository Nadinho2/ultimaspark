"use client";

import { useEffect, useState } from "react";
import {
  getAgencyDashboardStats,
  getRecentLeads,
} from "@/app/actions/agency";
import { Card, CardContent } from "@/components/ui/card";

type Stats = {
  totalLeads: number;
  activeClients: number;
  emailsThisMonth: number;
  newThisWeek: number;
};

type RecentLead = {
  id: string;
  name: string;
  business_name: string | null;
  status: string;
  created_at: string;
};

function StatusBadge({ status }: { status: string }) {
  const s = (status ?? "").toLowerCase();
  const base =
    "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold";
  const styles: Record<string, string> = {
    new: "border-blue-400/40 bg-blue-400/10 text-blue-400",
    contacted: "border-yellow-400/40 bg-yellow-400/10 text-yellow-400",
    nurture: "border-purple-400/40 bg-purple-400/10 text-purple-400",
    converted: "border-growth/40 bg-growth/10 text-growth",
    unsubscribed: "border-border bg-bg text-text-secondary",
  };
  return (
    <span className={`${base} ${styles[s] ?? styles.new}`}>
      {s || "unknown"}
    </span>
  );
}

export function AgencyStatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAgencyDashboardStats().then((s) => {
      if (!cancelled) setStats(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    { label: "Total Agency Leads", value: stats?.totalLeads },
    { label: "Active Clients", value: stats?.activeClients },
    { label: "Emails Sent This Month", value: stats?.emailsThisMonth },
    { label: "New This Week", value: stats?.newThisWeek },
  ];

  return (
    <>
      {cards.map((c) => (
        <Card key={c.label} className="border border-border bg-surface shadow-sm">
          <CardContent className="pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
              {c.label}
            </p>
            <p className="mt-2 text-3xl font-bold text-primary">
              {stats === null ? (
                <span className="inline-block h-8 w-16 animate-pulse rounded bg-border" />
              ) : (
                c.value
              )}
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export function RecentLeadsTable() {
  const [leads, setLeads] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getRecentLeads(10).then((data) => {
      if (!cancelled) {
        setLeads(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-full animate-pulse rounded bg-border/40"
          />
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <p className="text-sm text-text-secondary">
        No leads yet. Leads will appear here once captured.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm text-text-secondary">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-text-secondary">
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Business Type</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id} className="border-b border-white/5 last:border-0">
              <td className="px-3 py-2 text-text-primary">{l.name}</td>
              <td className="px-3 py-2">{l.business_name ?? "—"}</td>
              <td className="px-3 py-2">
                <StatusBadge status={l.status} />
              </td>
              <td className="px-3 py-2 text-right">
                <a
                  href="/admin/leads"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
