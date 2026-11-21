import type { MetadataRoute } from "next";
import { getWebsiteConfig } from "@/config";
export default function robots(): MetadataRoute.Robots {
  const url = getWebsiteConfig().company.url.replace(/\/$/, "");
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/_next/"] },
    sitemap: `${url}/sitemap.xml`,
    host: url
  };
}
