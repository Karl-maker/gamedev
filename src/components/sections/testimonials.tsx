import { Quote } from "lucide-react";
import type { WebsiteConfig } from "@/config/schema";

export function TestimonialsSection({ config }: { config: WebsiteConfig["testimonials"] }) {
  if (!config.enabled || !config.items.length) return null;
  return (
    <section className="section testimonial-section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">{config.eyebrow}</span>
          <h2>{config.title}</h2>
          <p>{config.description}</p>
        </div>
        <div className="testimonial-grid">
          {config.items.map((item) => (
            <figure key={`${item.name}-${item.company}`}>
              <Quote aria-hidden="true" />
              {item.result && <strong className="testimonial-result">{item.result}</strong>}
              <blockquote>{item.quote}</blockquote>
              <figcaption>
                <strong>{item.name}</strong>
                <span>{item.role}, {item.company}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
