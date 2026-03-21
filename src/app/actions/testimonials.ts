"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { ADMIN_ROLE_HELP, userHasAdminRole } from "@/lib/admin-role";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const TESTIMONIALS_TABLE = "UltimaSparkAcademyTestimonial";

type ActionResult = { success: true } | { success: false; error: string };

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const client = await clerkClient();
  const me = await client.users.getUser(userId);
  if (!userHasAdminRole(me)) {
    throw new Error(`Not authorized. ${ADMIN_ROLE_HELP}`);
  }
}

export async function approveTestimonial(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const id = (formData.get("id") as string | null)?.trim();
    const clerkUserId = (formData.get("clerk_user_id") as string | null)?.trim();
    const createdAt = (formData.get("created_at") as string | null)?.trim();
    const content = (formData.get("content") as string | null) ?? null;

    const supabase = await createSupabaseServerClient();

    let data: any = null;
    let error: any = null;

    // Primary path: update by id
    if (id && id !== "undefined") {
      ({ data, error } = await supabase
        .from(TESTIMONIALS_TABLE)
        .update({ status: "approved" })
        .eq("id", id)
        .select("id, status")
        .maybeSingle());
    }

    if (error) return { success: false, error: error.message };

    // Fallback path: update by stable content + user id
    if (!data && clerkUserId && content) {
      ({ data, error } = await supabase
        .from(TESTIMONIALS_TABLE)
        .update({ status: "approved" })
        .eq("clerk_user_id", clerkUserId)
        .eq("content", content)
        .select("id, status")
        .maybeSingle());
      if (error) return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: "No testimonial updated." };
    }
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to approve",
    };
  }
}

export async function rejectTestimonial(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const id = (formData.get("id") as string | null)?.trim();
    const clerkUserId = (formData.get("clerk_user_id") as string | null)?.trim();
    const createdAt = (formData.get("created_at") as string | null)?.trim();
    const content = (formData.get("content") as string | null) ?? null;

    const supabase = await createSupabaseServerClient();

    let data: any = null;
    let error: any = null;

    if (id && id !== "undefined") {
      ({ data, error } = await supabase
        .from(TESTIMONIALS_TABLE)
        .update({ status: "rejected" })
        .eq("id", id)
        .select("id, status")
        .maybeSingle());
    }

    if (error) return { success: false, error: error.message };

    if (!data && clerkUserId && content) {
      ({ data, error } = await supabase
        .from(TESTIMONIALS_TABLE)
        .update({ status: "rejected" })
        .eq("clerk_user_id", clerkUserId)
        .eq("content", content)
        .select("id, status")
        .maybeSingle());
      if (error) return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: "No testimonial updated." };
    }
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to reject",
    };
  }
}

export async function deleteTestimonial(
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const id = (formData.get("id") as string | null)?.trim();
    if (!id) return { success: false, error: "Missing testimonial id" };

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from(TESTIMONIALS_TABLE)
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) return { success: false, error: error.message };
    if (!data) return { success: false, error: "No testimonial deleted." };

    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete",
    };
  }
}

