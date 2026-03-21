/**
 * Allow only same-origin path redirects (prevents open redirects).
 */
export function safeRedirectPath(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  try {
    const decoded = decodeURIComponent(raw);
    if (!decoded.startsWith("/")) return undefined;
    if (decoded.startsWith("//")) return undefined;
    if (decoded.includes("://")) return undefined;
    return decoded;
  } catch {
    return undefined;
  }
}
