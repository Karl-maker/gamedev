import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Karl-Johan Bailey — Game Portfolio",
    short_name: "KJB Games",
    description: "Game development and engine programming portfolio for Karl-Johan Bailey.",
    start_url: "/",
    display: "standalone",
    background_color: "#070b10",
    theme_color: "#070b10",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }]
  };
}
