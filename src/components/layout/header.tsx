import Image from "next/image";
import Link from "next/link";
import type { WebsiteConfig } from "@/config/schema";
import { MobileNav } from "./mobile-nav";

export function Header({ config }: { config: WebsiteConfig }) {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link className="brand" href="/" aria-label={`${config.company.name} home`}>
          <Image src={config.company.logoUrl} alt="" width={38} height={38} priority />
          <span>{config.company.name}</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {config.navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <Link className="button button-primary nav-cta" href={config.hero.primaryCta.href}>{config.hero.primaryCta.label}</Link>
        <MobileNav config={config} />
      </div>
    </header>
  );
}
