import type { Metadata } from "next";
import { BarChart3, FileText, Layers3 } from "lucide-react";
import { ContactCta } from "@/components/sections/contact-cta";
import { PageJsonLd } from "@/components/seo/page-json-ld";
import { getWebsiteConfig } from "@/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

const description = "Explore custom systems, workflow automation, integrations, management tools and reporting.";
export const metadata: Metadata = buildPageMetadata({ title: "Services", description, path: "/services", keywords: ["custom software services", "workflow automation services", "systems integration"] });
const icons = { chart: BarChart3, layers: Layers3, file: FileText };

export default function ServicesPage() {
  const config = getWebsiteConfig();
  const base = config.company.url.replace(/\/$/, "");
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${config.company.name} services`,
    itemListElement: config.services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.description,
        url: `${base}/services#${service.slug}`,
        provider: { "@id": `${base}/#organization` },
        areaServed: config.seo.areaServed
      }
    }))
  };
  return <><section className="page-hero"><div className="container narrow"><span className="eyebrow">Services</span><h1>Custom systems, built around your operation</h1><p>From one costly bottleneck to a complete digital platform, each engagement is shaped around your users, workflows and commercial goals.</p></div></section><section className="section container service-list">{config.services.map((service, index) => { const Icon = icons[service.icon]; return <article id={service.slug} key={service.slug}><div className="service-number">0{index + 1}</div><div className="icon-box"><Icon /></div><div><h2>{service.title}</h2><p>{service.description}</p><p>We define the outcome with your team, integrate the right tools and deliver a system your operation can confidently manage.</p></div></article>; })}</section><ContactCta config={config} /><PageJsonLd baseUrl={config.company.url} path="/services" title="Services" description={description} additional={servicesSchema} /></>;
}
