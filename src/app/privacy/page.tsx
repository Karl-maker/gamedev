import type { Metadata } from "next";
import { getWebsiteConfig } from "@/config";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "How personal information is collected, used, shared, retained, and protected.",
  alternates: { canonical: "/privacy" }
};

export default function PrivacyPage() {
  const { company, legal } = getWebsiteConfig();
  return (
    <article className="legal container narrow">
      <span className="eyebrow">Legal</span>
      <h1>Privacy notice</h1>
      <p className="legal-date">Effective and last updated: {legal.effectiveDate}</p>
      <p className="legal-lead">This notice explains how {company.legalName} collects and uses personal information when you visit {company.name}, read our content, contact us, or otherwise interact with this website.</p>

      <nav className="legal-toc" aria-label="Privacy notice contents">
        <strong>On this page</strong>
        <ol>
          <li><a href="#controller">Who we are</a></li>
          <li><a href="#collection">Information we collect</a></li>
          <li><a href="#purposes">Purposes and legal bases</a></li>
          <li><a href="#sharing">Sharing and processors</a></li>
          <li><a href="#retention">Retention and security</a></li>
          <li><a href="#rights">Your rights</a></li>
          <li><a href="#contact">Contact and complaints</a></li>
        </ol>
      </nav>

      <section id="controller"><h2>1. Who we are and the scope of this notice</h2>
        <p>{company.legalName} is the organisation responsible for the personal information described in this notice. Our address is {company.address}. Our general contact is <a href={`mailto:${company.email}`}>{company.email}</a>, and privacy requests should be sent to <a href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a>.</p>
        {(legal.registrationNumber || legal.taxNumber) && <p>{legal.registrationNumber && <>Company registration number: {legal.registrationNumber}. </>}{legal.taxNumber && <>Tax or VAT number: {legal.taxNumber}.</>}</p>}
        <p>This notice applies to this website and the enquiries it generates. A separate agreement, employee notice, supplier notice, or customer privacy notice may apply where we establish another relationship with you.</p>
      </section>

      <section id="collection"><h2>2. Information we collect</h2>
        <p>We collect information you provide directly, information generated when you use the website, and limited information received from service providers.</p>
        <ul>
          <li><strong>Identity and business details:</strong> name, job title, company, company size, industry, country, and related professional information.</li>
          <li><strong>Contact details:</strong> business email address, telephone number, international calling code, and your preferred way to be contacted.</li>
          <li><strong>Enquiry content:</strong> the products, services, objectives, message, and other information you choose to submit.</li>
          <li><strong>Attribution and experiment details:</strong> landing page, campaign target configuration, referral data where available, and the A/B test variant shown when an enquiry was submitted.</li>
          <li><strong>Technical and security data:</strong> IP-derived request information, user agent, timestamps, rate-limit signals, and evidence needed to identify automated or abusive submissions.</li>
          <li><strong>Consent and preference data:</strong> whether you accepted optional analytics, the time of that choice, a pseudonymous visitor identifier, and experiment assignments stored in your browser.</li>
          <li><strong>Optional analytics:</strong> aggregate page, referrer, device, and interaction measurements collected only after permission, subject to the configured analytics provider.</li>
        </ul>
        <p>Please do not submit passwords, payment-card details, government identifiers, health information, or other sensitive information through the general contact form.</p>
      </section>

      <section id="purposes"><h2>3. How and why we use information</h2>
        <div className="legal-table-wrap"><table>
          <thead><tr><th>Purpose</th><th>Information</th><th>Typical legal basis</th></tr></thead>
          <tbody>
            <tr><td>Respond to an enquiry and discuss requested services</td><td>Identity, business, contact and enquiry details</td><td>Steps requested before a contract; legitimate interests in business communication</td></tr>
            <tr><td>Send an acknowledgement and operational messages</td><td>Name, email and enquiry reference</td><td>Steps requested before a contract; legitimate interests</td></tr>
            <tr><td>Secure the website and prevent spam, fraud, and abuse</td><td>Technical, security and submission data</td><td>Legitimate interests in protecting users and our service; legal obligations where applicable</td></tr>
            <tr><td>Keep A/B experiences consistent and record what a lead saw</td><td>Pseudonymous visitor ID, assignment and target configuration</td><td>Strictly necessary operation and legitimate interests; consent where local law requires it</td></tr>
            <tr><td>Measure and improve the website</td><td>Optional analytics and consent choice</td><td>Consent</td></tr>
            <tr><td>Establish, exercise, or defend legal claims and maintain records</td><td>Relevant enquiry, contract and security records</td><td>Legitimate interests; legal obligations</td></tr>
          </tbody>
        </table></div>
        <p>We do not sell personal information, use it for third-party behavioural advertising, or make decisions that produce legal or similarly significant effects solely through automated processing. If our purposes materially change, we will update this notice and seek fresh permission where required.</p>
      </section>

      <section><h2>4. Cookies, local storage, analytics, and A/B testing</h2>
        <p>The website uses browser storage for essential preferences, consent records, a pseudonymous visitor identifier, and experiment assignments. Optional analytics is not loaded until you choose “Allow analytics,” and it remains disabled when a supported Do Not Track signal is active. You can change your choice at any time using “Privacy choices” in the footer. See our <a href="/cookies">cookie and local storage policy</a> for the current technology list.</p>
      </section>

      <section id="sharing"><h2>5. When we share information</h2>
        <p>We disclose information only where needed to operate the website, deliver requested services, comply with law, protect rights and security, or complete a corporate transaction subject to appropriate safeguards. Configured processors include:</p>
        <div className="legal-table-wrap"><table>
          <thead><tr><th>Provider</th><th>Purpose</th><th>Processing location</th></tr></thead>
          <tbody>{legal.processors.map((processor) => <tr key={`${processor.name}-${processor.purpose}`}><td>{processor.url ? <a href={processor.url} rel="noopener noreferrer">{processor.name}</a> : processor.name}</td><td>{processor.purpose}</td><td>{processor.location}</td></tr>)}</tbody>
        </table></div>
        <p>We may also share information with professional advisers, regulators, courts, law enforcement, or a buyer or successor where lawful and necessary. Providers act under contractual or other obligations appropriate to their role.</p>
      </section>

      <section><h2>6. International transfers</h2>
        <p>Some configured providers may process information outside your country. Where transfer restrictions apply, we use an available lawful mechanism, such as an adequacy decision, approved contractual clauses, or another recognised safeguard, and assess supplementary measures where required. Contact us for information about safeguards relevant to your data.</p>
      </section>

      <section id="retention"><h2>7. Retention and security</h2>
        <p>We retain information only for as long as reasonably needed for the purpose collected, legal and accounting requirements, dispute resolution, and service security. Our configurable baseline schedule is:</p>
        <ul>
          <li>Inactive enquiries: up to {legal.retention.enquiriesMonths} months after the last meaningful interaction.</li>
          <li>Security and abuse-prevention logs: up to {legal.retention.securityLogDays} days unless an incident requires longer preservation.</li>
          <li>Optional analytics records: up to {legal.retention.analyticsMonths} months, subject to provider settings.</li>
        </ul>
        <p>We use proportionate administrative and technical safeguards, including server-side secrets, input validation, origin checking, throttling, bot-detection signals, encrypted transport, and access controls. No internet service is completely secure, so please use appropriate care when sending information online.</p>
      </section>

      <section id="rights"><h2>8. Your privacy rights</h2>
        <p>Depending on your location and the circumstances, you may have rights to access, correct, delete, restrict, or receive a copy of your information; object to certain processing; withdraw consent without affecting earlier lawful processing; and complain to a supervisory authority. Rights may be subject to legal conditions and exemptions.</p>
        <p>To exercise a right, email <a href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a>. Tell us what you are requesting and provide enough information to locate the relevant record. We may verify identity before acting and will respond within the period required by applicable law.</p>
      </section>

      <section><h2>9. Children</h2>
        <p>This business website is not directed to children under {legal.minimumAge}, and we do not knowingly collect their personal information. If you believe a child has submitted information, contact us so we can investigate and delete it where appropriate.</p>
      </section>

      <section><h2>10. Third-party links and changes</h2>
        <p>Links to third-party websites are governed by their own privacy practices. We may update this notice when our services, providers, or legal obligations change. The effective date above identifies the current version; material changes may also be highlighted on the website.</p>
      </section>

      <section id="contact"><h2>11. Contact and complaints</h2>
        <p>Send privacy questions or complaints to <a href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a> or write to {company.legalName}, {company.address}. You may also complain to <a href={legal.supervisoryAuthorityUrl} rel="noopener noreferrer">{legal.supervisoryAuthorityName}</a> or the regulator responsible in your country.</p>
      </section>
    </article>
  );
}
