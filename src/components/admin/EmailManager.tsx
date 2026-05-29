"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  getSubscribedLeadCount,
  listCampaigns,
  getCampaignStats,
  getCampaignSends,
  type EmailCampaign,
} from "@/app/actions/agency";

type BrandTab = "agency" | "academy";

const FROM_EMAILS: Record<BrandTab, string> = {
  agency: "agency@ultimaspark.com",
  academy: "mail@ultimaspark.com",
};

type CampaignStats = {
  totalSent: number;
  opens: number;
  clicks: number;
};

type SendRow = {
  id: string;
  email: string;
  resend_id: string | null;
  opened_at: string | null;
  clicked_at: string | null;
};

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-border/40 ${className}`} />;
}

export function EmailManager() {
  const [brand, setBrand] = useState<BrandTab>("agency");
  const [audienceCount, setAudienceCount] = useState(0);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [campaignStats, setCampaignStats] = useState<Record<string, CampaignStats>>({});
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);
  const [expandedSends, setExpandedSends] = useState<SendRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [notification, setNotification] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [subject, setSubject] = useState("");
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const resetForm = () => {
    setSubject("");
    setHeadline("");
    setBody("");
    setCtaText("");
    setCtaUrl("");
    setShowSchedule(false);
    setScheduleDate("");
    setScheduleTime("");
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [count, camps] = await Promise.all([
        getSubscribedLeadCount(brand),
        listCampaigns(brand),
      ]);

      const statsEntries: Record<string, CampaignStats> = {};
      await Promise.all(
        camps.map(async (c) => {
          const s = await getCampaignStats(c.id);
          statsEntries[c.id] = s;
        }),
      );

      if (!cancelled) {
        setAudienceCount(count);
        setCampaigns(camps);
        setCampaignStats(statsEntries);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [brand, refreshKey]);

  const notify = (type: "success" | "error", msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSend = async (mode: "now" | "schedule") => {
    if (!subject.trim() || !body.trim()) {
      notify("error", "Subject and body are required");
      return;
    }

    const payload: Record<string, unknown> = {
      brand,
      subject: subject.trim(),
      from_email: FROM_EMAILS[brand],
      headline: headline.trim() || subject.trim(),
      body: body.trim(),
      cta_text: ctaText.trim() || null,
      cta_url: ctaUrl.trim() || null,
    };

    if (mode === "schedule") {
      if (!scheduleDate || !scheduleTime) {
        notify("error", "Schedule date and time are required");
        return;
      }
      payload.scheduled_for = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
      payload.status = "scheduled";
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/send-campaign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        if (res.ok && result.success) {
          notify("success", mode === "now" ? "Campaign sent!" : "Campaign scheduled!");
          resetForm();
          setRefreshKey((k) => k + 1);
        } else {
          notify("error", result.error || "Failed to send campaign");
        }
      } catch {
        notify("error", "Network error sending campaign");
      }
    });
  };

  const toggleExpand = async (campaignId: string) => {
    if (expandedCampaign === campaignId) {
      setExpandedCampaign(null);
      setExpandedSends([]);
      return;
    }
    setExpandedCampaign(campaignId);
    const sends = await getCampaignSends(campaignId);
    setExpandedSends(
      sends.map((s) => ({
        id: s.id,
        email: s.email,
        resend_id: s.resend_id,
        opened_at: s.opened_at,
        clicked_at: s.clicked_at,
      })),
    );
  };

  return (
    <div className="space-y-6">
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
              resetForm();
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              brand === b
                ? "bg-primary text-white shadow-sm"
                : "border border-border bg-surface text-text-secondary hover:border-spark hover:text-spark"
            }`}
          >
            {b === "agency" ? "Agency Campaigns" : "Academy Campaigns"}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
          <h3 className="text-lg font-bold text-primary">Compose</h3>
          <p className="text-xs text-text-secondary">
            From: <span className="font-mono">{FROM_EMAILS[brand]}</span>
          </p>

          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">Subject</label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email subject line" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">Headline</label>
            <Input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Main headline in email body" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">Body</label>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Email body content..." className="min-h-32" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary">CTA Text</label>
              <Input value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="e.g. Get Started" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary">CTA URL</label>
              <Input value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="https://..." />
            </div>
          </div>

          <p className="text-xs text-text-secondary">
            Sending to <span className="font-semibold text-primary">{audienceCount}</span> subscribed leads
          </p>

          <div className="flex flex-wrap gap-2">
            <Button
              className="bg-growth text-white hover:bg-growth/90"
              disabled={isPending}
              onClick={() => handleSend("now")}
            >
              {isPending ? "Sending..." : "Send Now"}
            </Button>
            <Button variant="outline" onClick={() => setShowSchedule(!showSchedule)}>
              Schedule
            </Button>
          </div>

          {showSchedule && (
            <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-bg/50 p-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-text-secondary">Date</label>
                <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="h-9 w-[160px]" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-secondary">Time</label>
                <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="h-9 w-[120px]" />
              </div>
              <Button
                className="bg-primary text-white"
                disabled={isPending}
                onClick={() => handleSend("schedule")}
              >
                Confirm Schedule
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-3 rounded-xl border border-border bg-surface p-6">
          <h3 className="text-lg font-bold text-primary">Live Preview</h3>
          <div className="rounded-lg border border-border bg-[#0A1628] p-6">
            <div className="mb-4 text-center">
              <span className="text-lg font-bold text-[#1D9E75]">UltimaSpark</span>
            </div>
            {headline || subject ? (
              <h4 className="mb-3 text-center text-xl font-bold text-white">
                {headline || subject}
              </h4>
            ) : (
              <div className="mb-3 h-6 rounded bg-white/10" />
            )}
            {body ? (
              <p className="mb-4 whitespace-pre-wrap text-sm leading-relaxed text-gray-300">
                {body}
              </p>
            ) : (
              <div className="mb-4 space-y-2">
                <div className="h-3 w-full rounded bg-white/10" />
                <div className="h-3 w-4/5 rounded bg-white/10" />
                <div className="h-3 w-3/5 rounded bg-white/10" />
              </div>
            )}
            {ctaText && (
              <div className="text-center">
                <span className="inline-block rounded-lg bg-[#1D9E75] px-6 py-2.5 text-sm font-semibold text-white">
                  {ctaText}
                </span>
              </div>
            )}
            <div className="mt-6 border-t border-white/10 pt-4 text-center text-xs text-gray-500">
              UltimaSpark Academy · ultimaspark.com
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-primary">Campaign History</h3>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="rounded-xl border border-spark/30 bg-spark/10 p-4 text-sm text-text-primary">
            No campaigns yet for this brand.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-bg/50 text-xs uppercase tracking-wide text-text-secondary">
                <tr>
                  <th className="px-3 py-3">Subject</th>
                  <th className="px-3 py-3">Brand</th>
                  <th className="px-3 py-3">Sent Date</th>
                  <th className="px-3 py-3">Total Sent</th>
                  <th className="px-3 py-3">Opens</th>
                  <th className="px-3 py-3">Clicks</th>
                  <th className="px-3 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {campaigns.map((c) => {
                  const stats = campaignStats[c.id] ?? { totalSent: 0, opens: 0, clicks: 0 };
                  const isExpanded = expandedCampaign === c.id;
                  return (
                    <>
                      <tr
                        key={c.id}
                        className="cursor-pointer hover:bg-bg/30"
                        onClick={() => toggleExpand(c.id)}
                      >
                        <td className="px-3 py-3 font-medium text-text-primary">{c.subject}</td>
                        <td className="px-3 py-3 text-text-secondary">{c.brand}</td>
                        <td className="px-3 py-3 text-xs text-text-secondary">
                          {c.sent_at ? new Date(c.sent_at).toLocaleString() : c.scheduled_for ? `Scheduled: ${new Date(c.scheduled_for).toLocaleString()}` : "—"}
                        </td>
                        <td className="px-3 py-3 text-text-secondary">{c.total_sent ?? stats.totalSent}</td>
                        <td className="px-3 py-3 text-text-secondary">{stats.opens}</td>
                        <td className="px-3 py-3 text-text-secondary">{stats.clicks}</td>
                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                              c.status === "sent"
                                ? "border-growth/40 bg-growth/10 text-growth"
                                : c.status === "scheduled"
                                  ? "border-yellow-400/40 bg-yellow-400/10 text-yellow-400"
                                  : "border-border bg-bg text-text-secondary"
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${c.id}-expanded`}>
                          <td colSpan={7} className="bg-bg/30 px-6 py-4">
                            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                              Per-Recipient Status
                            </h4>
                            {expandedSends.length === 0 ? (
                              <p className="text-xs text-text-secondary">No send records found.</p>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-xs">
                                  <thead>
                                    <tr className="border-b border-white/10 text-text-secondary">
                                      <th className="px-2 py-1">Email</th>
                                      <th className="px-2 py-1">Opened</th>
                                      <th className="px-2 py-1">Clicked</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {expandedSends.map((s) => (
                                      <tr key={s.id} className="border-b border-white/5 last:border-0">
                                        <td className="px-2 py-1 text-text-primary">{s.email}</td>
                                        <td className="px-2 py-1">
                                          {s.opened_at ? (
                                            <span className="text-growth">✓ {new Date(s.opened_at).toLocaleString()}</span>
                                          ) : (
                                            <span className="text-text-secondary">—</span>
                                          )}
                                        </td>
                                        <td className="px-2 py-1">
                                          {s.clicked_at ? (
                                            <span className="text-growth">✓ {new Date(s.clicked_at).toLocaleString()}</span>
                                          ) : (
                                            <span className="text-text-secondary">—</span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
