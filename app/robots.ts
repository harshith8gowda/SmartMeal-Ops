import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/chat", "/onboarding", "/pantry", "/api/"]
    },
    sitemap: "https://smart-meal-ops.vercel.app/sitemap.xml"
  };
}
