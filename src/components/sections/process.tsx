import Link from "next/link";
import { ArrowRight, Compass, DraftingCompass, Rocket, ScanSearch } from "lucide-react";
import type { WebsiteConfig } from "@/config/schema";

const icons = [ScanSearch, Compass, DraftingCompass, Rocket];

export function ProcessSection({ config }: { config: WebsiteConfig["process"] }) {
  if (!config.enabled) return null;
  return (
    <section className="section process-section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">{config.eyebrow}</span>
          <h2>{config.title}</h2>
          <p>{config.description}</p>
        </div>
        <ol className="process-grid">
          {config.steps.map((step, index) => {
            const Icon = icons[index % icons.length];
            return (
              <li key={step.title}>
                <div className="process-card">
                  <div className="process-card-top">
                    <span className="process-icon"><Icon aria-hidden="true" /></span>
                    <span className="process-number">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="process-action">
          <Link className="button button-secondary" href={config.cta.href}>
            {config.cta.label} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
