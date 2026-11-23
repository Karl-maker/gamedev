import { defaultConfig } from "./default";
import { websiteConfigSchema, type WebsiteConfig } from "./schema";

function parseJson(value: string | undefined, label: string): unknown {
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    throw new Error(`${label} must be valid JSON.`);
  }
}

export function getRuntimeWebsiteConfig(): WebsiteConfig {
  const configured = parseJson(process.env.CONFIG_WEBSITE, "CONFIG_WEBSITE");
  const company = parseJson(process.env.COMPANY_CONFIG, "COMPANY_CONFIG");
  const hero = parseJson(process.env.HERO_CONFIG, "HERO_CONFIG");
  const about = parseJson(process.env.ABOUT_CONFIG, "ABOUT_CONFIG");
  const achievements = parseJson(process.env.ACHIEVEMENTS_CONFIG, "ACHIEVEMENTS_CONFIG");
  const collaborators = parseJson(process.env.COLLABORATORS_CONFIG, "COLLABORATORS_CONFIG");
  const services = parseJson(process.env.SERVICES_CONFIG, "SERVICES_CONFIG");
  const trustLogos = parseJson(process.env.TRUST_LOGOS_CONFIG, "TRUST_LOGOS_CONFIG");
  const trust = parseJson(process.env.TRUST_CONFIG, "TRUST_CONFIG");
  const contact = parseJson(process.env.CONTACT_CONFIG, "CONTACT_CONFIG");
  const processConfig = parseJson(process.env.PROCESS_CONFIG, "PROCESS_CONFIG");
  const faq = parseJson(process.env.FAQ_CONFIG, "FAQ_CONFIG");
  const testimonials = parseJson(process.env.TESTIMONIAL_CONFIG, "TESTIMONIAL_CONFIG");
  const seo = parseJson(process.env.SEO_CONFIG, "SEO_CONFIG");
  const experiments = parseJson(process.env.EXPERIMENTS_CONFIG, "EXPERIMENTS_CONFIG");
  const target = parseJson(process.env.TARGET_CONFIG, "TARGET_CONFIG");
  const legal = parseJson(process.env.LEGAL_CONFIG, "LEGAL_CONFIG");
  const socials = parseJson(process.env.SOCIAL_MEDIA_LINKS, "SOCIAL_MEDIA_LINKS");
  const base = configured && typeof configured === "object" ? configured as WebsiteConfig : defaultConfig;
  const publicBaseUrl = process.env.BASE_URL || process.env.SITE_URL;
  const candidate = {
    ...base,
    ...((company && typeof company === "object") || publicBaseUrl ? {
      company: {
        ...base.company,
        ...(company && typeof company === "object" ? company : {}),
        ...(publicBaseUrl ? { url: publicBaseUrl } : {})
      }
    } : {}),
    ...(hero && typeof hero === "object" ? { hero: { ...base.hero, ...hero } } : {}),
    ...(about && typeof about === "object" ? { about: { ...base.about, ...about } } : {}),
    ...(achievements && typeof achievements === "object" ? { achievements: { ...base.achievements, ...achievements } } : {}),
    ...(collaborators && typeof collaborators === "object" ? { collaborators: { ...base.collaborators, ...collaborators } } : {}),
    ...(Array.isArray(services) ? { services } : {}),
    ...((trust && typeof trust === "object") || Array.isArray(trustLogos) ? {
      trust: {
        ...base.trust,
        ...(trust && typeof trust === "object" ? trust : {}),
        ...(Array.isArray(trustLogos) ? { logos: trustLogos } : {})
      }
    } : {}),
    ...(contact && typeof contact === "object" ? { contact: { ...base.contact, ...contact } } : {}),
    ...(processConfig && typeof processConfig === "object" ? { process: { ...base.process, ...processConfig } } : {}),
    ...(faq && typeof faq === "object" ? { faq: { ...base.faq, ...faq } } : {}),
    ...(testimonials && typeof testimonials === "object" ? { testimonials: { ...base.testimonials, ...testimonials } } : {}),
    ...(seo && typeof seo === "object" ? { seo: { ...base.seo, ...seo } } : {}),
    ...(Array.isArray(experiments) ? { experiments } : {}),
    ...(target ? { target } : {}),
    ...(legal ? { legal } : {})
  };
  const parsed = websiteConfigSchema.parse(candidate);
  return socials ? { ...parsed, social: { ...parsed.social, ...(socials as WebsiteConfig["social"]) } } : parsed;
}
