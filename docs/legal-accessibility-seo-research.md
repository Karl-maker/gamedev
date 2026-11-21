# Legal, accessibility, and SEO implementation research

Reviewed 21 November 2026. This document records the primary guidance used for the reusable website baseline. It is an engineering summary, not legal advice.

## Privacy and consent

- The [European Commission data-protection overview](https://commission.europa.eu/law/law-topic/data-protection/data-protection-eu_en) describes the EU framework, individual rights, supervisory authorities, and the GDPR’s role.
- The [EDPB Guidelines 05/2020 on consent](https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_202005_consent_en.pdf) explain that valid consent must be freely given, specific, informed, unambiguous, demonstrable, and as easy to withdraw as to give.
- The [UK ICO guidance on cookies and similar technologies](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/) distinguishes strictly necessary technologies from technologies that ordinarily need prior consent.

Implementation consequences:

- Optional analytics is not requested or loaded before an affirmative choice.
- “Essential only” and “Allow analytics” are presented with comparable clarity.
- A persistent footer control reopens privacy choices.
- The policy discloses local-storage keys, A/B attribution, purposes, providers, transfers, retention, rights, and contact routes.
- Each deployment must configure its actual entity, vendors, jurisdictions, and retention schedule and obtain market-specific review.

## Mobile and accessibility

- [WCAG 2.2 Reflow (1.4.10)](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) supports content reflow at narrow equivalent widths without requiring two-dimensional scrolling, except where a two-dimensional layout is essential.
- [WCAG 2.2 Target Size (Minimum) (2.5.8)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) defines a 24 by 24 CSS pixel minimum or sufficient spacing, with stated exceptions.
- [WCAG 2.2 Focus Appearance (2.4.11)](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html) addresses visible keyboard-focus indicators.
- [WAI disclosure navigation guidance](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) demonstrates an expandable navigation approach with keyboard support and clear expanded state.

Implementation consequences:

- Mobile navigation is no longer removed; it has an accessible toggle, expanded state, Escape handling, focus movement, and a full-width touch layout.
- Interactive mobile controls are at least 44 CSS pixels in this design, exceeding the WCAG minimum.
- Legal tables retain their relationships with horizontal scrolling where a narrow stacked layout would distort the data.
- The consent prompt is a non-modal live region, avoiding a false modal announcement and keyboard trap.

## Search discovery

- Google’s [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) recommends absolute canonical URLs and accurate `lastmod` values for changed content.
- Google’s [canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) recommends consistent canonical signals, including canonical links and sitemap URLs.
- Google’s [article structured-data guidance](https://developers.google.com/search/docs/appearance/structured-data/article) documents recommended article properties such as headline, image, author, dates, and publisher.
- Next.js [metadata file conventions](https://nextjs.org/docs/app/api-reference/file-conventions/metadata) support generated robots, sitemap, manifest, and metadata resources.

Implementation consequences:

- Canonicals derive from the configured production origin.
- The sitemap cursor-paginates all published Notion blog and news records and uses their edit time as article `lastmod`.
- Article pages emit `BlogPosting` or `NewsArticle` plus `BreadcrumbList` structured data.
- The root emits `Organization` and `WebSite` structured data and advertises the RSS feed.
- Private API paths are excluded from crawling; legal, accessibility, article, and index pages remain discoverable.

## Required launch checks

- Replace all demo company and legal values.
- Confirm the production origin uses HTTPS and matches the indexed host.
- Validate structured data with Google’s Rich Results Test and inspect the sitemap in Search Console.
- Test at 320 CSS pixels, 200% zoom, keyboard-only operation, and at least one representative screen reader.
- Review every Notion article for headings, descriptive links, image text alternatives, and accurate publication dates.
- Review policies whenever providers, embedded technology, forms, purposes, regions, or retention practices change.
