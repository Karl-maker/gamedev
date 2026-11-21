import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, MessageCircle, Twitter } from "lucide-react";
import type { WebsiteConfig } from "@/config/schema";
import { PrivacyChoices } from "@/components/privacy/privacy-choices";

const socialIcons = { linkedin: Linkedin, facebook: Facebook, instagram: Instagram, x: Twitter, reddit: MessageCircle };
const verifiedCredentials = [
  {
    name: "AWS Partner: Sales Accreditation",
    image: "https://images.credly.com/size/680x680/images/46ea4542-72a8-46a1-8d68-b72c4ca50820/blob",
    url: "https://www.credly.com/badges/6a737ee9-822e-4008-bd29-9193d1bec105"
  },
  {
    name: "AWS Partner: Technical Accreditation",
    image: "https://images.credly.com/size/680x680/images/8f006312-3154-45bf-a845-4a043641e83c/blob",
    url: "https://www.credly.com/badges/47298faa-4c30-4988-b00e-9379c434bcdc"
  },
  {
    name: "AWS Partner: Cloud Economics Essentials",
    image: "https://images.credly.com/size/680x680/images/1ba189ae-4afb-4c3b-ae89-f3da3c054f05/blob",
    url: "https://www.credly.com/badges/11ca3d0c-09a7-4d4c-86a3-8ed9e9b2a9e1"
  }
];

export function Footer({ config }: { config: WebsiteConfig }) {
  const socials = Object.entries(config.social).filter((entry): entry is [keyof typeof socialIcons, string] =>
    Boolean(entry[1]) && entry[0] in socialIcons
  );
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link className="brand brand-footer" href="/">
            <Image src={config.company.logoUrl} alt="" width={40} height={40} />
            <span>{config.company.name}</span>
          </Link>
          <p>{config.company.description}</p>
          {socials.length > 0 && <div className="socials" aria-label="Social media">
            {socials.map(([name, href]) => {
              const Icon = socialIcons[name];
              return <a key={name} href={href} aria-label={name} rel="noopener noreferrer"><Icon size={19} /></a>;
            })}
          </div>}
        </div>
        <div><h2>Explore</h2><Link href="/services">Services</Link><Link href="/about">About us</Link><Link href="/blog">Blog</Link><Link href="/news">News</Link></div>
        <div><h2>Information</h2><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/cookies">Cookie policy</Link><Link href="/terms">Terms</Link><Link href="/accessibility">Accessibility</Link><PrivacyChoices /></div>
        <div><h2>Contact</h2><a href={`mailto:${config.company.email}`}>{config.company.email}</a><a href={`tel:${config.company.phone}`}>{config.company.phone}</a><p>{config.company.address}</p></div>
      </div>
      <div className="container credentials">
        <span>Credentials & partnerships</span>
        <div className="credential-badges">
          {verifiedCredentials.map((credential) => (
            <a key={credential.url} href={credential.url} target="_blank" rel="noopener noreferrer" aria-label={`${credential.name} — verify on Credly`}>
              <Image src={credential.image} alt={credential.name} width={82} height={82} />
            </a>
          ))}
        </div>
      </div>
      <div className="container footer-bottom">© {new Date().getFullYear()} {config.company.legalName}. All rights reserved.</div>
    </footer>
  );
}
