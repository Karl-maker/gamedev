import Link from "next/link";
import type { WebsiteConfig } from "@/config/schema";

export function ContactCta({ config }: { config: WebsiteConfig }) {
  return <section className="container cta-band"><div><span className="eyebrow">Ready when you are</span><h2>{config.contact.title}</h2><p>{config.contact.description}</p></div><Link className="button button-light button-large" href="/contact">Talk to our team</Link></section>;
}
