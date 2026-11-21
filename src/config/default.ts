import type { WebsiteConfig } from "./schema";

export const defaultConfig: WebsiteConfig = {
  target: {
    id: "auction",
    campaign: "direct-website",
    audience: "product and procurement teams",
    productCatalog: "general",
    market: "Caribbean and international",
    tags: ["demo", "organic"]
  },
  company: {
    name: "Northstar Labs",
    legalName: "Northstar Labs Ltd.",
    description: "Independent product intelligence for confident buying decisions.",
    url: "http://localhost:3000",
    email: "hello@northstarlabs.example",
    phone: "+1 868 555 0142",
    address: "Port of Spain, Trinidad and Tobago",
    logoUrl: "/logo.svg",
    faviconUrl: "/favicon.svg"
  },
  legal: {
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
  },
  hero: {
    eyebrow: "Clarity before commitment",
    title: "Choose products with evidence, not guesswork.",
    description:
      "We run independent shadow tests across your catalog so your team can compare real-world performance before committing.",
    primaryCta: { label: "Plan a product test", href: "/contact" },
    secondaryCta: { label: "Explore services", href: "/services" },
    image: {
      src: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600",
      alt: "A diverse business team comparing product research in a bright office"
    },
    proofPoints: ["Independent testing", "Actionable results"],
    metric: { value: "3.2×", label: "faster shortlist decisions" }
  },
  about: {
    title: "An independent lens on every product decision",
    description:
      "We pair structured testing with practical recommendations your commercial and operations teams can use immediately.",
    image: {
      src: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Colleagues reviewing a product testing plan together"
    },
    points: ["Repeatable test plans", "Decision-ready scorecards", "Clear stakeholder reporting"]
  },
  achievements: {
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
    visual: {
      coreLabel: "Virtual world",
      coreValue: "Scenario active",
      signals: [
        { label: "Actions", value: "Captured live" },
        { label: "Decisions", value: "Mapped in context" },
        { label: "Practice", value: "Safe to repeat" }
      ]
    },
    cta: { label: "Design a training simulation", href: "/contact" }
  },
  collaborators: {
    enabled: true,
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
  },
  services: [
    {
      slug: "catalog-benchmarking",
      title: "Catalog benchmarking",
      description: "Compare products against a consistent, real-world test framework.",
      icon: "chart"
    },
    {
      slug: "shadow-testing",
      title: "Shadow testing",
      description: "Evaluate products alongside current workflows without disrupting operations.",
      icon: "layers"
    },
    {
      slug: "decision-briefs",
      title: "Decision briefs",
      description: "Turn evidence into clear recommendations for buyers and leadership.",
      icon: "file"
    }
  ],
  trust: {
    title: "Built for teams that value proof",
    logos: [
      { name: "Aster & Co.", src: "/logos/aster.svg" },
      { name: "Meridian", src: "/logos/meridian.svg" },
      { name: "Cedar Works", src: "/logos/cedar.svg" },
      { name: "Orbital", src: "/logos/orbital.svg" }
    ]
  },
  credentials: [
    { name: "AWS Partner Network", imageUrl: "/credentials/aws.svg", url: "https://aws.amazon.com/partners/" },
    { name: "HubSpot Inbound", imageUrl: "/credentials/hubspot.svg", url: "https://academy.hubspot.com/" }
  ],
  contact: {
    title: "Let’s make the next product decision easier",
    description: "Tell us what you are comparing. We’ll reply with a practical next step within two business days."
  },
  social: {},
  navigation: [
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Insights", href: "/blog" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "/contact" }
  ],
  experiments: [
    {
      id: "home-hero-message",
      enabled: true,
      variants: [
        {
          id: "evidence",
          weight: 50,
          overrides: {
            heroTitle: "Choose products with evidence, not guesswork.",
            heroCta: "Plan a product test"
          }
        },
        {
          id: "confidence",
          weight: 50,
          overrides: {
            heroTitle: "Turn product uncertainty into a confident decision.",
            heroCta: "Start comparing"
          }
        }
      ]
    }
  ]
};
