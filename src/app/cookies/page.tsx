import type { Metadata } from "next";
import { getWebsiteConfig } from "@/config";
import { PrivacyChoices } from "@/components/privacy/privacy-choices";

export const metadata: Metadata = {
  title: "Cookie and local storage policy",
  description: "How this website uses essential browser storage and consent-based analytics.",
  alternates: { canonical: "/cookies" }
};

export default function CookiesPage() {
  const { company, legal } = getWebsiteConfig();
  return <article className="legal container narrow">
    <span className="eyebrow">Legal</span><h1>Cookie and local storage policy</h1>
    <p className="legal-date">Effective and last updated: {legal.effectiveDate}</p>
    <p className="legal-lead">This policy explains the cookies and similar browser technologies used by {company.legalName} on this website, why they are used, and how you can control them.</p>
    <nav className="legal-toc" aria-label="Cookie policy contents"><strong>On this page</strong><ol><li><a href="#meaning">What these technologies are</a></li><li><a href="#list">Technology list</a></li><li><a href="#choices">Your choices</a></li><li><a href="#changes">Changes and contact</a></li></ol></nav>

    <section id="meaning"><h2>1. Cookies and similar technologies</h2>
      <p>Cookies are small text records a website can ask a browser to store. Local storage is a related browser feature that can retain preferences on your device. In this policy, “browser storage” covers both. First-party storage is set for this website; third-party technology may be supplied by a configured service provider.</p>
      <p>We distinguish between essential storage, which supports a service you request or protects the site, and optional analytics, which helps us understand aggregate use. Optional analytics is disabled until you give affirmative permission.</p>
    </section>
    <section id="list"><h2>2. Browser storage used by this website</h2>
      <div className="legal-table-wrap"><table><thead><tr><th>Name</th><th>Category and purpose</th><th>Typical duration</th></tr></thead><tbody>
        <tr><td><code>privacy-consent-v1</code></td><td>Essential preference. Records whether optional analytics was accepted and when the choice was saved.</td><td>Until browser storage is cleared or the key is replaced.</td></tr>
        <tr><td><code>visitor_id</code></td><td>Essential functional identifier. Keeps experiment selection stable and links the experience shown to a voluntarily submitted lead without using your name.</td><td>Until browser storage is cleared.</td></tr>
        <tr><td><code>experiment:*</code></td><td>Essential functional preference. Stores the assigned version of a configured A/B test so pages do not unexpectedly change between visits.</td><td>Until browser storage is cleared or the experiment is retired.</td></tr>
        <tr><td>Configured Umami analytics identifiers</td><td>Optional analytics. Measures aggregate page use and interactions. The script is absent unless you consent and is suppressed when supported Do Not Track is enabled.</td><td>According to the configured Umami deployment, up to {legal.retention.analyticsMonths} months for analytics records.</td></tr>
      </tbody></table></div>
      <p>We do not intentionally use advertising cookies or third-party behavioural profiling. Website owners must update this table before enabling any additional embedded media, chat widget, advertising, analytics, or social plugin.</p>
    </section>
    <section><h2>3. Consent and lawful use</h2>
      <p>Essential storage operates because it is needed to remember your requested privacy settings, maintain a consistent site experience, and protect the service. Where applicable law requires permission for a specific functional item, the deployment owner must reclassify it and obtain consent. Optional analytics relies on your consent and is not a condition of using the site or sending an enquiry.</p>
    </section>
    <section id="choices"><h2>4. Change or withdraw your choice</h2>
      <p>You can reopen the consent controls at any time. Withdrawing permission stops future optional analytics loading; it does not invalidate processing that occurred while permission was active.</p>
      <p><PrivacyChoices /></p>
      <p>You can also delete site data through your browser settings, block browser storage, or use private browsing. Blocking essential storage may cause your preference and A/B assignment to reset. Browser controls vary, so consult the help documentation supplied by your browser.</p>
    </section>
    <section><h2>5. Do Not Track and global signals</h2>
      <p>When the browser exposes a supported Do Not Track setting, this implementation keeps optional analytics disabled even after a previous analytics choice. Other global privacy signals continue to evolve; deployment owners should review applicable local requirements and configured vendors regularly.</p>
    </section>
    <section id="changes"><h2>6. Changes and contact</h2>
      <p>We update this policy when the technologies or providers on the website change. The effective date above identifies the current version. Questions can be sent to <a href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a>, or by post to {company.legalName}, {company.address}. See the <a href="/privacy">privacy notice</a> for broader information about personal data.</p>
    </section>
  </article>;
}
