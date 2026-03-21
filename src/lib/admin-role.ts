/**
 * Clerk admin checks — keep in sync everywhere (pages + server actions).
 *
 * In Clerk Dashboard → Users → [you] → **Public metadata** (recommended):
 *   { "role": "admin" }
 *
 * Also supported: `roles` array containing "admin", same keys on unsafe/private metadata
 * (private metadata is only visible to the Backend API with your Clerk secret key).
 */

export const ADMIN_ROLE_HELP =
  'In Clerk Dashboard → Users → select your user → Public metadata, set JSON: { "role": "admin" } (save). Use Production instance keys on Vercel.';

type MetadataRecord = Record<string, unknown> | null | undefined;

function normalizeAdminFromValue(value: unknown): boolean {
  if (value == null) return false;
  if (Array.isArray(value)) {
    return value.some(
      (v) => String(v).toLowerCase().trim() === "admin",
    );
  }
  return String(value).toLowerCase().trim() === "admin";
}

function checkMetadata(meta: MetadataRecord): boolean {
  if (!meta || typeof meta !== "object") return false;
  const m = meta as Record<string, unknown>;
  if (normalizeAdminFromValue(m.role)) return true;
  if (normalizeAdminFromValue(m.roles)) return true;
  return false;
}

/** User object from `clerkClient().users.getUser()` (or any Clerk user with metadata). */
export function userHasAdminRole(user: {
  publicMetadata?: MetadataRecord;
  unsafeMetadata?: MetadataRecord;
  privateMetadata?: MetadataRecord;
}): boolean {
  return (
    checkMetadata(user.publicMetadata) ||
    checkMetadata(user.unsafeMetadata) ||
    checkMetadata(user.privateMetadata)
  );
}
