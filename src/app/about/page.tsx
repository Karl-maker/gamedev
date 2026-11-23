import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { ContactCta } from "@/components/sections/contact-cta";
import { PageJsonLd } from "@/components/seo/page-json-ld";
import { getWebsiteConfig } from "@/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

const description = "Learn how Syncpoly designs custom digital systems around real operational workflows.";
export const metadata: Metadata = buildPageMetadata({ title: "About us", description, path: "/about", keywords: ["custom software company", "digital transformation partner"] });

export default function AboutPage() {
  const config = getWebsiteConfig();
  return <><section className="page-hero"><div className="container narrow"><span className="eyebrow">About {config.company.name}</span><h1>{config.about.title}</h1><p>{config.about.description}</p></div></section><section className="section container split-grid"><div><span className="eyebrow">Our approach</span><h2>Technology shaped around the way your operation works</h2><p>We begin with the real process: the people involved, the decisions they make, the information they need and the work that slows them down. We then design a focused system that makes that operation clearer, faster and easier to manage.</p><ul className="check-list">{config.about.points.map((point) => <li key={point}><Check /> {point}</li>)}</ul></div><div className="split-media"><Image src={config.about.image.src} alt={config.about.image.alt} fill sizes="(max-width: 800px) 100vw, 50vw" /></div></section><section className="section about-principles"><div className="container"><div className="section-heading"><span className="eyebrow">What guides us</span><h2>Useful technology, grounded in real workflows</h2><p>Features only matter when they remove friction or improve visibility. We focus each build on practical outcomes, responsible access and information teams can act on.</p></div><div className="principle-grid"><article><strong>01</strong><h3>Specific to your operation</h3><p>Your workflows, users, rules and commercial goals shape the system.</p></article><article><strong>02</strong><h3>Clear by design</h3><p>Every role gets a focused experience with the information and controls it needs.</p></article><article><strong>03</strong><h3>Measurable from the start</h3><p>Tracking and reporting are designed into the workflow, not added as an afterthought.</p></article></div></div></section><ContactCta config={config} /><PageJsonLd baseUrl={config.company.url} path="/about" title="About us" description={description} type="AboutPage" /></>;
}
