import "server-only";
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

export function getWebsiteConfig(): WebsiteConfig {
  const configured = parseJson(process.env.CONFIG_WEBSITE, "CONFIG_WEBSITE");
  const hero = parseJson(process.env.HERO_CONFIG, "HERO_CONFIG");
  const about = parseJson(process.env.ABOUT_CONFIG, "ABOUT_CONFIG");
  const achievements = parseJson(process.env.ACHIEVEMENTS_CONFIG, "ACHIEVEMENTS_CONFIG");
  const collaborators = parseJson(process.env.COLLABORATORS_CONFIG, "COLLABORATORS_CONFIG");
  const services = parseJson(process.env.SERVICES_CONFIG, "SERVICES_CONFIG");
  const trustLogos = parseJson(process.env.TRUST_LOGOS_CONFIG, "TRUST_LOGOS_CONFIG");
  const target = parseJson(process.env.TARGET_CONFIG, "TARGET_CONFIG");
  const legal = parseJson(process.env.LEGAL_CONFIG, "LEGAL_CONFIG");
  const socials = parseJson(process.env.SOCIAL_MEDIA_LINKS, "SOCIAL_MEDIA_LINKS");
  const base = configured && typeof configured === "object" ? configured as WebsiteConfig : defaultConfig;
  const candidate = {
    ...base,
    ...(hero && typeof hero === "object" ? { hero: { ...base.hero, ...hero } } : {}),
    ...(about && typeof about === "object" ? { about: { ...base.about, ...about } } : {}),
    ...(achievements && typeof achievements === "object" ? { achievements: { ...base.achievements, ...achievements } } : {}),
    ...(collaborators && typeof collaborators === "object" ? { collaborators: { ...base.collaborators, ...collaborators } } : {}),
    ...(Array.isArray(services) ? { services } : {}),
    ...(Array.isArray(trustLogos) ? { trust: { ...base.trust, logos: trustLogos } } : {}),
    ...(process.env.SITE_URL ? { company: { ...base.company, url: process.env.SITE_URL } } : {}),
    ...(target ? { target } : {}),
    ...(legal ? { legal } : {})
  };
  const parsed = websiteConfigSchema.parse(candidate);
  return socials ? { ...parsed, social: { ...parsed.social, ...(socials as WebsiteConfig["social"]) } } : parsed;
}
