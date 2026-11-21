# Configuration

## Brand and page content

Copy `.env.example` to `.env.local`. `CONFIG_WEBSITE` is a JSON object validated at startup. Invalid or incomplete configuration fails fast rather than silently publishing broken content.

The major sections are:

| Key | Purpose |
| --- | --- |
| `target` | Deployment, campaign, intended audience, catalog, market and reporting tags |
| `company` | Legal/display name, URL, description, email, phone, address, logo and favicon |
| `legal` | Policy date, privacy contact, jurisdiction, registration details, retention and processors |
| `hero` | Eyebrow, heading, description, two calls to action and image with required alt text |
| `about` | About copy, image and proof points |
| `services` | Service page and home cards |
| `trust.logos` | Repeating customer-logo carousel/strip |
| `credentials` | Footer badges with accessible names and destination URLs |
| `contact` | Contact-page and CTA copy |
| `navigation` | Main navigation links |
| `experiments` | Weighted A/B variants |

Use one-line JSON in Vercel or other hosting dashboards. For complex installations, generate the JSON in deployment tooling rather than hand-editing it.

`SITE_URL` overrides `company.url` and should be the exact public origin, including the local port where relevant. Focused JSON overrides are available when you do not want to duplicate the full website object:

- `HERO_CONFIG` merges into the hero.
- `COMPANY_CONFIG` merges into company identity and positioning.
- `ABOUT_CONFIG` merges into the About content.
- `SERVICES_CONFIG` replaces the services array.
- `ACHIEVEMENTS_CONFIG` controls the orange immersive-training showcase on the home page.
- `COLLABORATORS_CONFIG` controls the technology provider and collaborator logo section.
- `TRUST_CONFIG` merges into the client proof section.
- `CONTACT_CONFIG` merges into contact-page positioning.
- `EXPERIMENTS_CONFIG` replaces the A/B-test definitions.
- `TRUST_LOGOS_CONFIG` replaces the customer logo array.

## Verified credentials

This Syncpoly deployment renders three linked Credly badge images in the footer. Their image URLs and public verification links live in `src/components/layout/footer.tsx`. Replace those values there when the verified credentials change. No Credly embed script or iframe is loaded. The older `credentials` array remains part of the reusable schema but is not rendered by this customised footer.

## Legal and company policy configuration

`LEGAL_CONFIG` overrides the legal section independently, so deployments do not need to duplicate the whole website configuration:

```dotenv
LEGAL_CONFIG={"effectiveDate":"21 November 2026","privacyEmail":"privacy@example.com","governingLaw":"the laws of Trinidad and Tobago","courts":"the courts of Trinidad and Tobago","registrationNumber":"C-12345","taxNumber":"","minimumAge":16,"supervisoryAuthorityName":"Office of the Information Commissioner","supervisoryAuthorityUrl":"https://example.com/regulator","retention":{"enquiriesMonths":24,"securityLogDays":90,"analyticsMonths":24},"processors":[{"name":"Notion","purpose":"Lead and content management","location":"United States and other configured regions","url":"https://www.notion.so/privacy"}]}
```

The privacy notice, cookie policy, terms, and accessibility statement read these values on the server. Before every deployment:

1. Set the real legal entity, registered address, public URL, email and phone in `company`.
2. Identify the correct governing law, courts, privacy contact and regulator.
3. List every actual hosting, email, analytics, CRM, embedded-media and content processor.
4. Confirm processing locations, contracts, international-transfer mechanisms and deletion settings.
5. Have qualified counsel review the generated policies for the markets and services involved.

The included policies are substantial operational templates, not legal advice or an automatic compliance guarantee.

## Target and campaign attribution

`TARGET_CONFIG` can override the `target` section independently:

```dotenv
TARGET_CONFIG={"id":"catalog-q1-enterprise","campaign":"q1-shadow-test","audience":"enterprise procurement","productCatalog":"workplace technology","market":"Caribbean","tags":["paid-search","enterprise"]}
```

This configuration is read on the server and attached to every lead as both a filterable `Target` value and a complete `Target Config` JSON snapshot. It is not accepted from the browser, preventing a visitor from changing campaign attribution.

## Social media

Set `SOCIAL_MEDIA_LINKS`, for example:

```dotenv
SOCIAL_MEDIA_LINKS={"linkedin":"https://www.linkedin.com/company/example","facebook":"","instagram":"https://www.instagram.com/example","x":"","reddit":""}
```

Empty links are not rendered. Never put API tokens inside this variable.

## A/B tests

An experiment has an immutable `id`, `enabled`, and weighted `variants`. The default hero experiment changes the heading and CTA. A stable visitor ID selects a deterministic variant. The selected IDs are submitted in the `A/B Assignments` Notion field and attached to the `lead_submitted` analytics event.

Do not rename IDs mid-test. Create a new experiment ID so old and new results cannot be mixed. Ensure every variant tells the truth and gives equal access to privacy information.

## Analytics

Umami was selected because it is open source and free to self-host. Set:

```dotenv
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-site-id
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://analytics.example.com/script.js
```

The script is absent until the visitor explicitly allows analytics and remains absent when Do Not Track is enabled. Cloud Umami may have paid tiers; “free” here refers to self-hosting the open-source project.

## Search discovery

The site builds canonical metadata from `company.url`. It exposes `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, and `/feed.xml`. The sitemap queries every published Notion blog and news page using cursor pagination, so newly published articles appear after the five-minute content cache expires or a successful revalidation webhook call.

Set `company.url` to the final HTTPS origin without a path. Never leave the localhost demo URL in production.

## Email

Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, and `LEAD_NOTIFICATION_EMAIL`. Use a transactional email provider and authenticate the sending domain with SPF, DKIM, and DMARC. Secrets are read only in the Node.js route and are never included in the client bundle.

## Images

The example uses Pexels CDN URLs with meaningful alt text and Next.js responsive image optimization. Confirm every production image’s licence and keep a source record. Configure any additional image host in `next.config.ts`; do not use unbounded remote patterns.

## Worldwide country and phone data

The contact form contains 250 countries and territories with flag emoji and 246 international/regional calling prefixes. Selecting a country automatically selects its primary calling prefix while still allowing a different prefix to be chosen.

The compact browser dataset is generated from the ODbL-licensed `world-countries` project and the MIT-licensed `libphonenumber-js` metadata:

```bash
npm run countries:generate
```

This avoids a live API dependency and keeps the client payload limited to the fields the form needs. Regenerate and review the committed JSON when either source package is upgraded.
