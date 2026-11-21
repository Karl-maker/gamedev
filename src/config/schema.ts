import { z } from "zod";

const imageSchema = z.object({ src: z.string(), alt: z.string().min(8) });
const linkSchema = z.object({ label: z.string(), href: z.string() });
const legalDefaults = {
  effectiveDate: "21 November 2026",
  privacyEmail: "privacy@northstarlabs.example",
  governingLaw: "the laws of Trinidad and Tobago",
  courts: "the courts of Trinidad and Tobago",
  registrationNumber: "",
  taxNumber: "",
  minimumAge: 16,
  supervisoryAuthorityName: "your local data protection supervisory authority",
  supervisoryAuthorityUrl: "https://commission.europa.eu/law/law-topic/data-protection/data-protection-eu_en",
  retention: {
    enquiriesMonths: 24,
    securityLogDays: 90,
    analyticsMonths: 24
  },
  processors: [
    { name: "Notion", purpose: "Lead and content management", location: "United States and other configured regions", url: "https://www.notion.so/privacy" },
    { name: "Configured hosting provider", purpose: "Website hosting and security", location: "Configured deployment region", url: "" },
    { name: "Configured email provider", purpose: "Transactional email delivery", location: "Configured provider region", url: "" }
  ]
};

export const websiteConfigSchema = z.object({
  target: z.object({
    id: z.string().min(1),
    campaign: z.string().min(1),
    audience: z.string().min(1),
    productCatalog: z.string().min(1),
    market: z.string().min(1),
    tags: z.array(z.string()).default([])
  }).default({
    id: "northstar-general",
    campaign: "direct-website",
    audience: "product and procurement teams",
    productCatalog: "general",
    market: "Caribbean and international",
    tags: ["demo"]
  }),
  company: z.object({
    name: z.string(),
    legalName: z.string(),
    description: z.string(),
    url: z.string().url(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
    logoUrl: z.string(),
    faviconUrl: z.string()
  }),
  legal: z.object({
    effectiveDate: z.string().min(1),
    privacyEmail: z.string().email(),
    governingLaw: z.string().min(1),
    courts: z.string().min(1),
    registrationNumber: z.string(),
    taxNumber: z.string(),
    minimumAge: z.number().int().min(13),
    supervisoryAuthorityName: z.string().min(1),
    supervisoryAuthorityUrl: z.string().url(),
    retention: z.object({
      enquiriesMonths: z.number().int().positive(),
      securityLogDays: z.number().int().positive(),
      analyticsMonths: z.number().int().positive()
    }),
    processors: z.array(z.object({
      name: z.string().min(1),
      purpose: z.string().min(1),
      location: z.string().min(1),
      url: z.union([z.string().url(), z.literal("")])
    }))
  }).default(legalDefaults),
  hero: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    primaryCta: linkSchema,
    secondaryCta: linkSchema,
    image: imageSchema,
    proofPoints: z.array(z.string()).min(1).default(["Independent testing", "Actionable results"]),
    metric: z.object({
      value: z.string(),
      label: z.string()
    }).default({ value: "3.2×", label: "faster shortlist decisions" })
  }),
  about: z.object({
    title: z.string(),
    description: z.string(),
    image: imageSchema,
    points: z.array(z.string())
  }),
  achievements: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    metrics: z.array(z.object({
      value: z.string(),
      label: z.string()
    })).min(3).max(4),
    capabilities: z.array(z.object({
      title: z.string(),
      description: z.string()
    })).min(3).max(4),
    cta: linkSchema
  }).default({
    eyebrow: "Measurable immersive learning",
    title: "Practise critical moments without real-world consequences.",
    description: "Custom virtual environments make complex work repeatable, observable and safer to learn.",
    metrics: [
      { value: "Custom", label: "virtual training worlds" },
      { value: "Live", label: "actions and decisions tracked" },
      { value: "Clear", label: "evidence for every learner" }
    ],
    capabilities: [
      { title: "Built around the work", description: "Scenarios reflect the equipment, environments and decisions your people actually face." },
      { title: "Safe to repeat", description: "Learners can pause, retry and build confidence before the real moment arrives." },
      { title: "Designed to improve", description: "Track choices, timing and outcomes to reveal where guidance or practice is needed." }
    ],
    cta: { label: "Design a training simulation", href: "/contact" }
  }),
  collaborators: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    note: z.string(),
    items: z.array(z.object({
      name: z.string(),
      role: z.string(),
      icon: z.enum(["blender", "autodesk", "unity", "unreal", "aws"]),
      href: z.string().url()
    })).min(1)
  }).default({
    eyebrow: "Technology providers & collaborators",
    title: "Built with a world-class creative technology stack",
    description: "The platforms and tools behind our custom virtual environments, real-time experiences and secure delivery.",
    note: "All product names and marks belong to their respective owners. Inclusion indicates technologies we use, not necessarily a formal partnership.",
    items: [
      { name: "Blender", role: "3D creation", icon: "blender", href: "https://www.blender.org/" },
      { name: "Autodesk", role: "Design and engineering", icon: "autodesk", href: "https://www.autodesk.com/" },
      { name: "Unity", role: "Real-time 3D", icon: "unity", href: "https://unity.com/" },
      { name: "Unreal Engine", role: "Immersive worlds", icon: "unreal", href: "https://www.unrealengine.com/" },
      { name: "AWS", role: "Cloud delivery", icon: "aws", href: "https://aws.amazon.com/" }
    ]
  }),
  services: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
      description: z.string(),
      icon: z.enum(["chart", "layers", "file"])
    })
  ),
  trust: z.object({
    title: z.string(),
    logos: z.array(z.object({ name: z.string(), src: z.string() }))
  }),
  credentials: z.array(
    z.object({ name: z.string(), imageUrl: z.string(), url: z.string().url() })
  ),
  contact: z.object({ title: z.string(), description: z.string() }),
  social: z
    .object({
      linkedin: z.string(),
      facebook: z.string(),
      instagram: z.string(),
      x: z.string(),
      reddit: z.string()
    })
    .partial(),
  navigation: z.array(linkSchema),
  experiments: z
    .array(
      z.object({
        id: z.string(),
        enabled: z.boolean(),
        variants: z
          .array(
            z.object({
              id: z.string(),
              weight: z.number().positive(),
              overrides: z.object({
                heroTitle: z.string().optional(),
                heroCta: z.string().optional()
              })
            })
          )
          .min(2)
      })
    )
    .default([])
});

export type WebsiteConfig = z.infer<typeof websiteConfigSchema>;
export type Experiment = WebsiteConfig["experiments"][number];
