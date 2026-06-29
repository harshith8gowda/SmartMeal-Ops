import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.clerk.accounts.dev https://*.clerk.com https://clerk.com https://challenges.cloudflare.com; script-src-elem 'self' 'unsafe-eval' 'unsafe-inline' https://*.clerk.accounts.dev https://*.clerk.com https://clerk.com https://challenges.cloudflare.com; worker-src 'self' blob: https://*.clerk.accounts.dev https://*.clerk.com https://clerk.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https: data:; frame-src 'self' https://challenges.cloudflare.com; connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://clerk.com https://api.clerk.com https://clerk-telemetry.com https://api.openai.com https://mcp.swiggy.com https://challenges.cloudflare.com https://raw.githack.com;"
  }
];

const nextConfig: NextConfig = {
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  },
  turbopack: {
    root: process.cwd()
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders
      }
    ];
  }
};

export default nextConfig;
