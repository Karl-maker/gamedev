# SEO and content architecture

## Implemented foundation

- Server-rendered App Router pages with one crawlable URL per topic
- Page-specific titles/descriptions, canonical URLs, article Open Graph metadata, and a generated social image
- `robots.txt` and a sitemap containing static and published Notion URLs
- `Organization`, `BlogPosting`, and `NewsArticle` JSON-LD
- Semantic heading order, descriptive links, alt text, keyboard focus, skip navigation, and reduced-motion support
- Next.js responsive AVIF/WebP image negotiation for configured assets
- Five-minute content revalidation, avoiding a Notion request for every visitor
- Clean `/blog/[slug]` and `/news/[slug]` URLs

Primary references used for the implementation:

- Next.js metadata: `https://nextjs.org/docs/app/getting-started/metadata-and-og-images`
- Next.js image optimization: `https://nextjs.org/docs/app/api-reference/components/image`
- Google Search essentials: `https://developers.google.com/search/docs/essentials`
- Google article structured data: `https://developers.google.com/search/docs/appearance/structured-data/article`
- Schema.org Article: `https://schema.org/Article`

## Publishing checklist

Every entry should have a unique search-focused title, slug, useful excerpt, publication date, relevant tags, and a landscape cover image. Use one descriptive H1 (provided by the template), meaningful H2/H3 headings, first-hand evidence, explicit authorship when added to the schema, and internal links to related services and articles.

After launch:

1. Set the production company URL before building.
2. Verify the site in Google Search Console and Bing Webmaster Tools.
3. Submit `/sitemap.xml`.
4. Validate representative pages with Rich Results Test.
5. Monitor Core Web Vitals, indexing, 404s, and canonical selection.
6. Add author properties and author profile pages if multiple experts publish.

## Design review

The layout uses established B2B patterns visible on high-performing sites such as HubSpot: an outcome-first split hero, paired primary/secondary CTAs, trust logos, scannable service cards, editorial content, and a strong final CTA. It deliberately does not copy HubSpot’s protected text, imagery, or exact visual identity.

The live browser review requested during implementation could not be completed because the browser/network research host was unavailable. Recheck HubSpot and the primary references above during design QA, since live sites and framework recommendations change.
