import type { MetadataRoute } from "next";
import { portfolioConfig } from "@/config/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = portfolioConfig.baseUrl.replace(/\/$/, "");
  return [{ url: base, changeFrequency: "monthly", priority: 1 }];
}
