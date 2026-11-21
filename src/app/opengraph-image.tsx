import { ImageResponse } from "next/og";
import { getWebsiteConfig } from "@/config";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  const config = getWebsiteConfig();
  return new ImageResponse(<div style={{ background: "#133d34", color: "#fff", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, fontFamily: "sans-serif" }}><div style={{ color: "#f4a680", fontSize: 28, textTransform: "uppercase", letterSpacing: 3 }}>{config.company.name}</div><div style={{ fontSize: 68, lineHeight: 1.08, fontWeight: 700, maxWidth: 980, marginTop: 24 }}>{config.hero.title}</div><div style={{ fontSize: 27, color: "#cfe0da", marginTop: 28 }}>{config.company.description}</div></div>, size);
}
