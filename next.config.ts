import type { NextConfig } from "next";

/**
 * Origins next/image is allowed to optimize.
 * - API host + optional MEDIA host: dashboard uploads served from /uploads/...
 * - Direct S3 bucket URLs: uploads live in S3 in production, and MEDIA_PUBLIC_URL
 *   may be unset or point elsewhere, so always allow the bucket form too.
 */
function mediaPatterns() {
  const sources = [
    process.env.NEXT_PUBLIC_MEDIA_URL,
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api",
  ].filter((value): value is string => Boolean(value));

  const patterns = sources.map((value) => {
    const url = new URL(value);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port,
      pathname: "/uploads/**",
    };
  });

  // The S3 bucket that stores dashboard uploads (region fixed in the URL below).
  patterns.push({
    protocol: "https",
    hostname: "s3.us-east-1.amazonaws.com",
    port: "",
    pathname: "/bluetop-villa-media-prod/uploads/**",
  });
  patterns.push({
    protocol: "https",
    hostname: "bluetop-villa-media-prod.s3.us-east-1.amazonaws.com",
    port: "",
    pathname: "/uploads/**",
  });

  return patterns;
}

const nextConfig: NextConfig = {
  // Lets a second dev server (e.g. a test instance) build into its own folder instead of sharing .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: mediaPatterns(),
  },
  async rewrites() {
    const proxyTarget = process.env.API_PROXY_TARGET?.replace(/\/$/, "");
    if (!proxyTarget) return [];
    return [
      {
        source: "/api-proxy/:path*",
        destination: `${proxyTarget}/:path*`,
      },
    ];
  },
  async redirects() {
    // Short Golden Ticket links (e.g. /t/8H4K2Q in SMS) resolve via the API,
    // which 302s to the scratch page with the full token.
    const apiUrl = (
      process.env.API_PROXY_TARGET ??
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:4000/api"
    ).replace(/\/$/, "");
    return [
      {
        source: "/dining",
        destination: "/stay",
        permanent: true,
      },
      {
        source: "/t/:code",
        destination: `${apiUrl}/golden-tickets/t/:code`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
