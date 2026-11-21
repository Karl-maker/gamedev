import type { Metadata } from "next";
import { BarChart3, FileText, Layers3 } from "lucide-react";
import { ContactCta } from "@/components/sections/contact-cta";
import { getWebsiteConfig } from "@/config";

export const metadata: Metadata = { title: "Services", description: "Explore custom virtual training simulations, white-label delivery, course conversion and learning analytics.", alternates: { canonical: "/services" } };
const icons = { chart: BarChart3, layers: Layers3, file: FileText };

export default function ServicesPage() {
  const config = getWebsiteConfig();
  return <><section className="page-hero"><div className="container narrow"><span className="eyebrow">Services</span><h1>Custom training simulations, built around your world</h1><p>From a single critical procedure to a complete white-label training library, each experience is shaped around your people, environment and learning goals.</p></div></section><section className="section container service-list">{config.services.map((service, index) => { const Icon = icons[service.icon]; return <article id={service.slug} key={service.slug}><div className="service-number">0{index + 1}</div><div className="icon-box"><Icon /></div><div><h2>{service.title}</h2><p>{service.description}</p><p>We define the decisions and behaviours that matter, build them into the scenario, and provide clear evidence of how each learner performed.</p></div></article>; })}</section><ContactCta config={config} /></>;
}
