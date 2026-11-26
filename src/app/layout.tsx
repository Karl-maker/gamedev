import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/sora";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: { default: "Karl-Johan Bailey | Game Developer & Engine Programmer", template: "%s | Karl-Johan Bailey" },
  description: "Game developer and engine programmer building polished experiences with Unreal Engine, Unity, C++, multiplayer systems, Blender and Maya.",
  keywords: ["game developer", "Unreal Engine developer", "Unity developer", "C++ engine programmer", "multiplayer game developer", "Blender", "Maya"],
  applicationName: "Karl-Johan Bailey — Game Portfolio",
  authors: [{ name: "Karl-Johan Bailey" }],
  creator: "Karl-Johan Bailey",
  category: "portfolio",
  classification: "Game development portfolio",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "Karl-Johan Bailey — Game Developer",
    title: "Karl-Johan Bailey | Game Developer & Engine Programmer",
    description: "Unreal Engine, Unity, multiplayer and custom C++ engine development.",
    url: "/",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Karl-Johan Bailey game development portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Karl-Johan Bailey | Game Developer",
    description: "Unreal Engine, Unity, multiplayer and custom C++ engine development.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#070b10", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Karl-Johan Bailey",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    sameAs: ["https://github.com/Karl-maker"],
    jobTitle: "Game Developer and Engine Programmer",
    knowsAbout: ["Unreal Engine", "Unity", "C++", "Multiplayer game development", "OpenGL", "Blender", "Autodesk Maya"],
  };

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
