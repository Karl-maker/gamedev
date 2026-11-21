import type { NextConfig } from "next";

const analyticsOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? "https://cloud.umami.is/script.js").origin;
  } catch {
    return "https://cloud.umami.is";
  }
})();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "eddiesoonandco.syncpoly.com" },
      { protocol: "https", hostname: "eislettechnologies.com" },
      { protocol: "https", hostname: "eisletteducation.com" },
      { protocol: "https", hostname: "novickedelstein.com" },
      { protocol: "https", hostname: "media.licdn.com" },
      { protocol: "https", hostname: "images.squarespace-cdn.com" },
      { protocol: "https", hostname: "images.credly.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "flagcdn.com" }
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Content-Security-Policy",
            value:
              `default-src 'self'; script-src 'self' 'unsafe-inline' ${analyticsOrigin}; connect-src 'self' ${analyticsOrigin}; img-src 'self' data: blob: https://images.pexels.com https://images.unsplash.com https://*.notion.so https://*.amazonaws.com https://images.credly.com https://upload.wikimedia.org https://flagcdn.com https://media.licdn.com https://eddiesoonandco.syncpoly.com https://eislettechnologies.com https://eisletteducation.com https://novickedelstein.com https://images.squarespace-cdn.com; style-src 'self' 'unsafe-inline'; font-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests`
          }
        ]
      }
    ];
  }
};

export default nextConfig;
