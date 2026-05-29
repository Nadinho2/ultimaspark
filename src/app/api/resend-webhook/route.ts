import { NextResponse } from "next/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

export const runtime = "nodejs";

type WebhookEvent = {
  type: string;
  created_at?: string;
  data?: {
    email_id?: string;
    from?: string;
    to?: string[];
    subject?: string;
  };
};

export async function POST(req: Request) {
  try {
    const event = (await req.json()) as WebhookEvent;

    const resendId = event.data?.email_id;
    if (!resendId) {
      return NextResponse.json({ ok: true });
    }

    const supabase = createSupabaseServiceRoleClient();

    if (event.type === "email.opened") {
      await supabase
        .from("email_sends")
        .update({ opened_at: event.created_at ?? new Date().toISOString() })
        .eq("resend_id", resendId)
        .is("opened_at", null);
    }

    if (event.type === "email.clicked") {
      await supabase
        .from("email_sends")
        .update({ clicked_at: event.created_at ?? new Date().toISOString() })
        .eq("resend_id", resendId)
        .is("clicked_at", null);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("resend-webhook error:", err);
    return NextResponse.json({ ok: true });
  }
}
