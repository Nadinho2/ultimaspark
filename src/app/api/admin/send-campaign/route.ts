import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { userHasAdminRole } from "@/lib/admin-role";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import { Resend } from "resend";

export const runtime = "nodejs";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    if (!userHasAdminRole(user)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!resend) {
      return NextResponse.json(
        { error: "RESEND_API_KEY not configured" },
        { status: 500 },
      );
    }

    const body = await req.json();
    const { brand, subject, from_email, headline, body: emailBody, cta_text, cta_url } = body as {
      brand: string;
      subject: string;
      from_email: string;
      headline?: string;
      body: string;
      cta_text?: string;
      cta_url?: string;
    };

    if (!brand || !subject || !from_email || !emailBody) {
      return NextResponse.json(
        { error: "Missing required fields: brand, subject, from_email, body" },
        { status: 400 },
      );
    }

    const isScheduled = body.status === "scheduled" && body.scheduled_for;
    const supabase = createSupabaseServiceRoleClient();

    const { data: campaign, error: campaignError } = await supabase
      .from("email_campaigns")
      .insert([
        {
          brand,
          subject,
          from_email,
          headline: headline ?? subject,
          body: emailBody,
          cta_text: cta_text ?? null,
          cta_url: cta_url ?? null,
          status: isScheduled ? "scheduled" : "sent",
          scheduled_for: isScheduled ? body.scheduled_for : null,
          sent_at: isScheduled ? null : new Date().toISOString(),
          total_sent: 0,
        },
      ])
      .select("id")
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: campaignError?.message ?? "Failed to create campaign" },
        { status: 500 },
      );
    }

    if (isScheduled) {
      return NextResponse.json({ success: true, campaignId: campaign.id, scheduled: true });
    }

    const { data: leads } = await supabase
      .from("unified_leads")
      .select("id, email, name")
      .eq("brand", brand)
      .eq("subscribed", true);

    const leadList = leads ?? [];
    let sentCount = 0;

    const ctaHtml =
      cta_text && cta_url
        ? `<div style="text-align:center;margin:24px 0"><a href="${cta_url}" style="display:inline-block;background:#1D9E75;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">${cta_text}</a></div>`
        : "";

    const htmlBody = emailBody
      .split("\n")
      .map((line: string) => `<p style="margin:0 0 12px;color:#d1d5db;font-size:14px;line-height:1.6">${line}</p>`)
      .join("");

    const html = `
      <div style="background:#0A1628;padding:40px 20px;font-family:system-ui,sans-serif">
        <div style="max-width:560px;margin:0 auto;background:#0F1F35;border-radius:12px;padding:32px;border:1px solid #1D9E7533">
          <div style="text-align:center;margin-bottom:24px">
            <span style="color:#1D9E75;font-size:20px;font-weight:700">UltimaSpark</span>
          </div>
          ${headline ? `<h2 style="text-align:center;color:#fff;font-size:20px;margin:0 0 20px">${headline}</h2>` : ""}
          ${htmlBody}
          ${ctaHtml}
          <div style="border-top:1px solid #ffffff1a;margin-top:24px;padding-top:16px;text-align:center;color:#6b7280;font-size:12px">
            UltimaSpark Academy · <a href="https://ultimaspark.com" style="color:#1D9E75;text-decoration:none">ultimaspark.com</a>
          </div>
        </div>
      </div>
    `;

    for (const lead of leadList) {
      try {
        const { data: sendResult } = await resend.emails.send({
          from: from_email,
          to: lead.email,
          subject,
          html,
        });

        await supabase.from("email_sends").insert([
          {
            campaign_id: campaign.id,
            lead_id: lead.id,
            email: lead.email,
            resend_id: sendResult?.id ?? null,
          },
        ]);

        sentCount++;
      } catch (sendErr) {
        console.error(`Failed to send to ${lead.email}:`, sendErr);
      }
    }

    await supabase
      .from("email_campaigns")
      .update({ total_sent: sentCount })
      .eq("id", campaign.id);

    return NextResponse.json({
      success: true,
      campaignId: campaign.id,
      totalSent: sentCount,
    });
  } catch (err) {
    console.error("send-campaign error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 },
    );
  }
}
