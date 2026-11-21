import Image from "next/image";
import Link from "next/link";
import { Activity, BarChart3, Box, Check, FileText, Layers3, Radar, Route, ShieldCheck } from "lucide-react";
import { ContentCard } from "@/components/content/content-card";
import { HeroCta, HeroHeading } from "@/components/experiments/hero-copy";
import { ContactCta } from "@/components/sections/contact-cta";
import { Collaborators } from "@/components/sections/collaborators";
import { getWebsiteConfig } from "@/config";
import { listContent } from "@/lib/integrations/notion/content-repository";

export const revalidate = 300;

const icons = { chart: BarChart3, layers: Layers3, file: FileText };

export default async function Home() {
  const config = getWebsiteConfig();
  const latest = await listContent("blog", 3).catch(() => []);
  const experiment = config.experiments.find((item) => item.id === "home-hero-message");
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">{config.hero.eyebrow}</span>
            <HeroHeading experiment={experiment}>{config.hero.title}</HeroHeading>
            <p>{config.hero.description}</p>
            <div className="button-row">
              <Link className="button button-primary button-large" href={config.hero.primaryCta.href}><HeroCta experiment={experiment}>{config.hero.primaryCta.label}</HeroCta></Link>
              <Link className="button button-secondary button-large" href={config.hero.secondaryCta.href}>{config.hero.secondaryCta.label}</Link>
            </div>
            <div className="hero-proof">{config.hero.proofPoints.map((point) => <span key={point}><Check size={17} /> {point}</span>)}</div>
          </div>
          <div className="hero-media">
            <div className="hero-shape" />
            <Image src={config.hero.image.src} alt={config.hero.image.alt} fill priority sizes="(max-width: 900px) 100vw, 48vw" />
            <div className="floating-card"><strong>{config.hero.metric.value}</strong><span>{config.hero.metric.label}</span></div>
          </div>
        </div>
      </section>
      <section className="trust-strip">
        <div className="container"><p>{config.trust.title}</p><div className="logo-track">{config.trust.logos.map((logo) => <span className={`trust-logo${logo.name.toLowerCase().includes("eislett technologies") ? " trust-logo-circle" : ""}`} key={logo.name}><Image src={logo.src} alt={`${logo.name} logo`} fill sizes="145px" /></span>)}</div></div>
      </section>
      <section className="section container">
        <div className="section-heading"><span className="eyebrow">What we do</span><h2>Services built around your operation</h2><p>{config.company.description}</p></div>
        <div className="service-grid">{config.services.map((service) => { const Icon = icons[service.icon]; return <article className="service-card" key={service.slug}><div className="icon-box"><Icon /></div><h3>{service.title}</h3><p>{service.description}</p><Link className="text-link" href={`/services#${service.slug}`}>Learn more →</Link></article>; })}</div>
      </section>
      <section className="section about-split">
        <div className="container split-grid">
          <div className="split-media"><Image src={config.about.image.src} alt={config.about.image.alt} fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
          <div><span className="eyebrow">Why {config.company.name}</span><h2>{config.about.title}</h2><p>{config.about.description}</p><ul className="check-list">{config.about.points.map((point) => <li key={point}><Check /> {point}</li>)}</ul><Link className="button button-secondary" href="/about">Meet the approach</Link></div>
        </div>
      </section>
      <section className="achievement-section">
        <div className="container achievement-shell">
          <div className="achievement-copy">
            <span className="achievement-eyebrow"><Radar size={16} /> {config.achievements.eyebrow}</span>
            <h2>{config.achievements.title}</h2>
            <p>{config.achievements.description}</p>
            <div className="achievement-metrics">
              {config.achievements.metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
            </div>
            <Link className="button achievement-button" href={config.achievements.cta.href}>{config.achievements.cta.label} <span aria-hidden="true">→</span></Link>
          </div>
          <div className="world-visual" aria-label="Illustration of an automated legal intake workflow">
            <div className="world-grid" />
            <div className="world-orbit world-orbit-one" />
            <div className="world-orbit world-orbit-two" />
            <div className="world-core"><Box /><span>{config.achievements.visual.coreLabel}</span><strong>{config.achievements.visual.coreValue}</strong></div>
            <div className="telemetry-card telemetry-one"><Activity /><span>{config.achievements.visual.signals[0].label}</span><strong>{config.achievements.visual.signals[0].value}</strong></div>
            <div className="telemetry-card telemetry-two"><Route /><span>{config.achievements.visual.signals[1].label}</span><strong>{config.achievements.visual.signals[1].value}</strong></div>
            <div className="telemetry-card telemetry-three"><ShieldCheck /><span>{config.achievements.visual.signals[2].label}</span><strong>{config.achievements.visual.signals[2].value}</strong></div>
            <div className="world-signal signal-one" />
            <div className="world-signal signal-two" />
            <div className="world-signal signal-three" />
          </div>
          <div className="achievement-capabilities">
            {config.achievements.capabilities.map((capability, index) => <article key={capability.title}><span>0{index + 1}</span><div><h3>{capability.title}</h3><p>{capability.description}</p></div></article>)}
          </div>
        </div>
      </section>
      <Collaborators config={config.collaborators} />
      {latest.length > 0 && <section className="section container"><div className="section-heading row-heading"><div><span className="eyebrow">Latest thinking</span><h2>Evidence for better decisions</h2></div><Link className="text-link" href="/blog">View all insights →</Link></div><div className="content-grid">{latest.map((entry) => <ContentCard key={entry.id} entry={entry} />)}</div></section>}
      <ContactCta config={config} />
    </>
  );
}
