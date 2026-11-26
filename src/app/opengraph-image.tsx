import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ background: "#070b10", color: "#fff", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, fontFamily: "sans-serif" }}>
      <div style={{ color: "#6fffe9", fontSize: 25, textTransform: "uppercase", letterSpacing: 4 }}>Karl-Johan Bailey</div>
      <div style={{ fontSize: 76, lineHeight: 1.02, fontWeight: 750, maxWidth: 1000, marginTop: 28 }}>I build worlds worth playing.</div>
      <div style={{ fontSize: 26, color: "#a8b5c2", marginTop: 32 }}>Unreal Engine · Unity · C++ · Multiplayer · 3D</div>
    </div>,
    size,
  );
}
