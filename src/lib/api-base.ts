/**
 * API base URL for fetch() calls.
 *
 * Production site (www): browser uses `/api-proxy` (Next rewrite → real API) so guests never
 * hit cross-origin CORS. This applies even when the build still has NEXT_PUBLIC_API_URL pointing
 * at api.bluetopvilla.com — a common deploy mistake.
 */
function isBluetopSiteHost(hostname: string) {
  return (
    hostname === "bluetopvilla.com" ||
    hostname === "www.bluetopvilla.com" ||
    hostname.endsWith(".bluetopvilla.com")
  );
}

export function getPublicApiBase(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "");

  if (typeof window === "undefined") {
    const serverTarget = process.env.API_PROXY_TARGET?.trim().replace(/\/$/, "");
    if (serverTarget) return serverTarget;
    if (configured?.startsWith("/")) {
      const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
      return `${site}${configured}`;
    }
    return configured ?? "http://localhost:4000/api";
  }

  const host = window.location.hostname;
  if (isBluetopSiteHost(host)) {
    if (!configured || configured.includes("api.bluetopvilla.com")) {
      return "/api-proxy";
    }
    if (configured.startsWith("/")) {
      return configured;
    }
  }

  return configured ?? "http://localhost:4000/api";
}
