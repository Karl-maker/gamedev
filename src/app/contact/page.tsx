import type { Metadata } from "next";
import { Clock3, Mail, MapPin } from "lucide-react";
import { LeadForm } from "@/components/contact/lead-form";
import { getWebsiteConfig } from "@/config";

export const metadata: Metadata = { title: "Contact", description: "Tell us which products you need to compare and plan an independent shadow test.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  const config = getWebsiteConfig();
  return <section className="contact-page"><div className="container contact-grid"><div className="contact-intro"><span className="eyebrow">Contact</span><h1>{config.contact.title}</h1><p>{config.contact.description}</p><div className="contact-detail"><Mail /><div><strong>Email</strong><a href={`mailto:${config.company.email}`}>{config.company.email}</a></div></div><div className="contact-detail"><MapPin /><div><strong>Based in</strong><span>{config.company.address}</span></div></div><div className="contact-detail"><Clock3 /><div><strong>Response time</strong><span>Within two business days</span></div></div></div><LeadForm /></div></section>;
}
