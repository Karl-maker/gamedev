# SEO and professional website audit

## What was already strong

- Semantic headings, descriptive page copy, accessible forms and a keyboard skip link.
- Canonical URLs, XML sitemap, robots file, RSS feed and article-specific metadata.
- Organization, website, article and breadcrumb structured data.
- Responsive images, mobile layouts and reduced-motion support.
- Clear privacy, cookie, terms and accessibility pages.

## Highest-impact gaps addressed

### Make the buying process concrete

Professional-service visitors need to understand how an engagement moves from
first conversation to delivery. The configurable `PROCESS_CONFIG` section adds
that missing sequence without changing any existing homepage section.

### Add useful question-led content

The configurable `FAQ_CONFIG` section answers common pre-contact questions in
visible HTML. It also emits matching `FAQPage` structured data. The answers
must remain visible on the page and should be updated whenever the service
changes.

### Prepare honest social proof

`TESTIMONIAL_CONFIG` supports verified quotes, attribution and a concrete result.
It is disabled by default because fabricated testimonials would reduce trust
and create legal and reputational risk.

### Strengthen metadata and entity signals

- Static pages now have their own Open Graph and Twitter metadata instead of
  relying on homepage sharing data.
- Article sharing metadata has a reliable fallback image and broader topical
  keywords.
- `SEO_CONFIG` controls locale, topics, service areas, contact type and optional
  Google verification.
- Organization markup now includes contact, service-area and expertise data.
- About, contact, collection and services pages now publish page and breadcrumb
  structured data. Services also publish an `ItemList` of `Service` entities.

### Let crawlers render the site

The robots file no longer blocks `/_next/`. Search crawlers need access to
important JavaScript, CSS and image resources to render modern pages correctly.
The API routes remain excluded.

## Important work that still needs real business input

1. Add verified testimonials or short case studies with the client’s permission,
   the original problem, what changed and a measurable result.
2. Configure `SEO_CONFIG` for each deployed industry site rather than reusing
   generic keywords across legal, auction, training or product-testing variants.
3. Verify every production property in Google Search Console and submit its
   sitemap. Add the verification token through `SEO_CONFIG`.
4. Track Core Web Vitals from real users, especially LCP, INP and CLS, after
   deployment. A local build cannot substitute for field data.
5. Build original topic clusters around actual customer questions. Each article
   should link to the relevant service page and related articles.
6. Earn relevant mentions and links through partnerships, professional
   directories, associations, original research and useful industry resources.
7. If the business serves customers at a physical location, maintain consistent
   name, address and phone details and complete the appropriate business profile.

## Configuration

- `PROCESS_CONFIG`: engagement steps and CTA.
- `FAQ_CONFIG`: visible questions and answers.
- `TESTIMONIAL_CONFIG`: verified client quotes; disabled until populated.
- `SEO_CONFIG`: locale, keywords, areas served, expertise, contact type and
  search-console verification.

All variables accept one-line JSON, following the existing configuration
pattern.

## Research references

- Google Search Central, SEO Starter Guide:
  `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
- Google Search Central, JavaScript SEO basics:
  `https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics`
- Google Search Central, Organization structured data:
  `https://developers.google.com/search/docs/appearance/structured-data/organization`
- Google Search Central, Article structured data:
  `https://developers.google.com/search/docs/appearance/structured-data/article`
- Google Search Central, Breadcrumb structured data:
  `https://developers.google.com/search/docs/appearance/structured-data/breadcrumb`
- Google Search Central, FAQ structured data:
  `https://developers.google.com/search/docs/appearance/structured-data/faqpage`
- web.dev, Core Web Vitals:
  `https://web.dev/articles/vitals`
- W3C WAI, disclosure/accordion pattern:
  `https://www.w3.org/WAI/ARIA/apg/patterns/accordion/`
