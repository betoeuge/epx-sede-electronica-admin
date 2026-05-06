/**
 * Returns the base URL of the citizen portal.
 * - In Coder workspaces the admin runs on port 3000 and the portal on 3001.
 *   We auto-derive the portal origin by swapping the port prefix in the hostname.
 * - Falls back to NEXT_PUBLIC_PORTAL_URL env var if set.
 * - Falls back to http://localhost:3001 for plain local dev.
 */
export function getPortalOrigin(): string {
  if (typeof window === "undefined") return "http://localhost:3001";

  const envUrl = process.env.NEXT_PUBLIC_PORTAL_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");

  const { protocol, hostname, port } = window.location;

  // Coder workspace pattern: 3000--<workspace>.pit-1.try.coder.app
  if (hostname.startsWith("3000--")) {
    return `${protocol}//${hostname.replace(/^3000--/, "3001--")}`;
  }

  // Plain localhost
  return `${protocol}//${hostname}:3001`;
}

export function getPortalUrl(siteSlug: string, pagePath = ""): string {
  const base = getPortalOrigin();
  const path = pagePath ? `/${pagePath.replace(/^\//, "")}` : "";
  return `${base}/${siteSlug}${path}`;
}
