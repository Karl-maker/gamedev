import type { MetadataRoute } from "next";
import { getWebsiteConfig } from "@/config";

export default function manifest(): MetadataRoute.Manifest {
  const { company } = getWebsiteConfig();
  return {
    name: company.name,
    short_name: company.name,
    description: company.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#103b32",
    icons: [{ src: company.faviconUrl, sizes: "any", type: "image/svg+xml" }]
  };
}
