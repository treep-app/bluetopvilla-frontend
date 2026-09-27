import type { NextConfig } from "next";

/** Room photos uploaded from the dashboard are served by the API (or MEDIA host), so allow those origins. */
function mediaPatterns() {
  const sources = [process.env.NEXT_PUBLIC_MEDIA_URL, process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"];
  return sources
    .filter((value): value is string => Boolean(value))
    .map((value) => {
      const url = new URL(value);
      return {
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        port: url.port,
        pathname: "/uploads/**",
      };
    });
}

const nextConfig: NextConfig = {
  // Lets a second dev server (e.g. a test instance) build into its own folder instead of sharing .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: mediaPatterns(),
  },
  async redirects() {
    return [
      {
        source: "/dining",
        destination: "/stay",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
