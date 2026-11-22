# Configurable catalog testing website

A production-oriented Next.js base for independent product-testing and catalog intelligence businesses. One codebase can power separate brands using environment configuration.

## Start locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

The default Northstar Labs demo works without Notion or SMTP. Publishing lists remain empty and the contact endpoint returns a friendly service-unavailable response until credentials are configured.

## Send a Notion email campaign

Campaign recipients come from a CSV file with required `email`, `industry`, and
`skip` columns. `first_name`, `last_name`, and `last_sent` are supported, and
any additional column can be used as a `{{placeholder}}` in the Notion page or
subject. A `TRUE`/`YES`/`1` skip value prevents delivery. Industry matching is
trimmed and case-insensitive.

The Notion page title is the default subject. Its blocks become the body inside
the same branded header and footer used by website email, including rich text,
links, lists, images, tables, callouts, code, embeds, and nested blocks.

```bash
npm run email:campaign -- \
  --csv ./recipients.csv \
  --id YOUR_NOTION_PAGE_ID \
  --industry Developer \
  --base-url https://example.com \
  --subject "Hello {{first_name}}" \
  --dry-run
```

Remove `--dry-run` to deliver. The command uses `NOTION_TOKEN`, the existing
`SMTP_*` variables, `SMTP_NEWSLETTER_FROM`, and `UNSUBSCRIBE_SECRET`.
`--subject` is optional; `--eyebrow` and `--preheader` can also contain CSV
placeholders.

## What is included

- Typed `CONFIG_WEBSITE` JSON for brand, hero, about, services, customers, credentials, navigation, social links, and A/B tests
- Server-only Notion lead capture behind a repository interface
- Notion blog/news publishing with five-minute server cache and webhook revalidation
- Nodemailer acknowledgement and internal lead notification templates
- Deterministic A/B assignments stored in the browser and recorded with the Notion lead
- Server-derived target/campaign attribution and an exact contact-details snapshot on every lead
- Consent-gated Umami analytics (free when self-hosted)
- SEO metadata, canonical URLs, dynamic sitemap, robots rules, Open Graph image, and JSON-LD
- Privacy/cookie/terms templates, abuse controls, security headers, and privacy tests
- Responsive, accessible business design using optimized Pexels images

## Documentation

- [Configuration](docs/configuration.md)
- [Notion setup](docs/notion-setup.md)
- [SEO and publishing](docs/seo-and-content.md)
- [Privacy and GDPR launch checklist](docs/privacy-and-gdpr.md)
- [Architecture](docs/architecture.md)

Run `npm run check` before deployment.
