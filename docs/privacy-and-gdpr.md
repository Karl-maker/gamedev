# Privacy and GDPR launch checklist

This project provides technical controls, not a legal compliance guarantee. GDPR compliance depends on the deployed organisation, purposes, vendors, contracts, countries, retention, and operating practices. Obtain qualified review before launch.

## Technical controls included

- No analytics script before affirmative consent
- Essential-only choice equal in prominence to allow
- Do Not Track respected
- Consent and A/B state documented
- Data-minimised contact fields with explicit form consent
- Privacy, cookie, and terms pages
- Server-only credentials
- Schema validation and output escaping in email
- Origin checks, body-size limit, honeypot, minimum completion time, and rate limiting
- CSP, frame denial, MIME sniffing protection, restricted browser permissions, and referrer policy
- Authenticated content-cache revalidation
- Automated tests that prevent analytics from loading before consent

## Must be completed by the deployer

- Replace all demo legal/company details.
- Record the lawful basis for every purpose; do not rely on consent where it is not appropriate.
- Execute DPAs with hosting, Notion, email, and analytics providers.
- Document international transfer mechanisms.
- Create and enforce a Notion lead deletion schedule.
- Establish access, deletion, correction, objection, and breach-response procedures.
- Keep a record of processing activities where required.
- Decide whether a Data Protection Officer or representative is required.
- Validate consent wording and cookie classification for every target country.
- Add a “Privacy choices” link if local rules or your implementation require easy withdrawal without clearing storage.
- Replace the in-memory limiter with a distributed store (for example managed Redis) on horizontally scaled/serverless production.
- Add WAF/bot-management rules at the hosting edge for sustained abuse.

Primary references:

- European Commission data protection: `https://commission.europa.eu/law/law-topic/data-protection_en`
- EDPB guidelines and recommendations: `https://www.edpb.europa.eu/our-work-tools/general-guidance/guidelines-recommendations-best-practices_en`
- UK ICO cookies guidance: `https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/online-tracking/`
- OWASP automated threats: `https://owasp.org/www-project-automated-threats-to-web-applications/`

## Tests

`src/test/privacy.test.tsx` verifies that analytics is absent without consent, present only after consent, and suppressed by Do Not Track. `src/test/security.test.ts` covers throttling and deterministic experiment assignment. These tests verify implemented behavior, not the legal conclusions of a jurisdiction.
