import type { Metadata } from "next";
import { BarChart3, FileText, Layers3 } from "lucide-react";
import { ContactCta } from "@/components/sections/contact-cta";
import { getWebsiteConfig } from "@/config";

export const metadata: Metadata = { title: "Services", description: "Explore custom systems, workflow automation, integrations, management tools and reporting.", alternates: { canonical: "/services" } };
const icons = { chart: BarChart3, layers: Layers3, file: FileText };

export default function ServicesPage() {
  const config = getWebsiteConfig();
  return <><section className="page-hero"><div className="container narrow"><span className="eyebrow">Services</span><h1>Custom systems, built around your operation</h1><p>From one costly bottleneck to a complete digital platform, each engagement is shaped around your users, workflows and commercial goals.</p></div></section><section className="section container service-list">{config.services.map((service, index) => { const Icon = icons[service.icon]; return <article id={service.slug} key={service.slug}><div className="service-number">0{index + 1}</div><div className="icon-box"><Icon /></div><div><h2>{service.title}</h2><p>{service.description}</p><p>We define the outcome with your team, integrate the right tools and deliver a system your operation can confidently manage.</p></div></article>; })}</section><ContactCta config={config} /></>;
}
