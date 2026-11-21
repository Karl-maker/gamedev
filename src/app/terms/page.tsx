import type { Metadata } from "next";
import { getWebsiteConfig } from "@/config";

export const metadata: Metadata = { title: "Website terms of use", description: "Terms governing access to and use of this website.", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  const { company, legal } = getWebsiteConfig();
  return <article className="legal container narrow">
    <span className="eyebrow">Legal</span><h1>Website terms of use</h1>
    <p className="legal-date">Effective and last updated: {legal.effectiveDate}</p>
    <p className="legal-lead">These terms govern access to and use of the {company.name} website operated by {company.legalName}. By using the website, you agree to these terms. If you do not agree, do not use the website.</p>
    <nav className="legal-toc" aria-label="Terms contents"><strong>On this page</strong><ol><li><a href="#about">About the website</a></li><li><a href="#acceptable-use">Acceptable use</a></li><li><a href="#content">Content and intellectual property</a></li><li><a href="#liability">Disclaimers and liability</a></li><li><a href="#law">Governing law</a></li></ol></nav>

    <section id="about"><h2>1. About us and these terms</h2>
      <p>{company.legalName} operates this website from {company.address}. You can contact us at <a href={`mailto:${company.email}`}>{company.email}</a>{legal.registrationNumber ? `; company registration number ${legal.registrationNumber}` : ""}.</p>
      <p>These terms apply only to public website use. Product testing, consulting, subscriptions, purchases, or other engagements are governed by a separate written agreement. If a separate agreement conflicts with these terms concerning the contracted service, that agreement controls.</p>
    </section>
    <section><h2>2. Eligibility and access</h2>
      <p>You must be legally able to accept these terms and, when acting for an organisation, authorised to bind or communicate for it. The website is not directed to children under {legal.minimumAge}. We may modify, suspend, restrict, or discontinue all or part of the website where reasonably necessary, including for maintenance, security, legal compliance, or business changes.</p>
    </section>
    <section><h2>3. Information and enquiries</h2>
      <p>Website content is general information. It is not legal, financial, medical, engineering, procurement, or other professional advice and should not be the sole basis for a significant decision. An enquiry, automated acknowledgement, proposal discussion, or website statement does not create a contract, fiduciary duty, exclusivity arrangement, or guarantee of availability. A binding engagement exists only when authorised parties agree separate terms.</p>
      <p>You are responsible for ensuring information you submit is accurate, lawful, and appropriate to share. Do not send trade secrets, passwords, payment-card data, regulated personal information, or other confidential material unless we have expressly agreed a secure process.</p>
    </section>
    <section id="acceptable-use"><h2>4. Acceptable use</h2>
      <p>You may use the website for lawful informational and business-enquiry purposes. You must not:</p>
      <ul>
        <li>violate law, another person’s rights, or contractual confidentiality obligations;</li>
        <li>attempt unauthorised access, probe security, bypass rate limits, or interfere with operation;</li>
        <li>introduce malware, destructive code, or automated traffic that burdens the service;</li>
        <li>scrape, reproduce, train a model on, or commercially exploit substantial website content where permission is legally required;</li>
        <li>impersonate another person, misrepresent affiliation, or submit false or abusive enquiries;</li>
        <li>remove ownership notices or use the website to distribute unlawful, deceptive, or harmful material.</li>
      </ul>
      <p>We may block requests or preserve and report relevant records where reasonably necessary to protect the service, users, or third parties.</p>
    </section>
    <section id="content"><h2>5. Intellectual property</h2>
      <p>Unless stated otherwise, website software, layout, branding, original text, graphics, reports, and other content are owned by or licensed to {company.legalName} and protected by applicable intellectual-property law. Third-party marks remain the property of their owners. Photography may be licensed from Pexels or another identified provider under its applicable licence.</p>
      <p>You may view pages, share ordinary links, and make a reasonable personal or internal-business copy for evaluating our services. No other licence is granted. Written permission is required for republication, resale, systematic extraction, removal of attribution, creation of misleading derivatives, or use of our marks in a way that suggests endorsement.</p>
    </section>
    <section><h2>6. User submissions and feedback</h2>
      <p>You retain ownership of information you submit. You give us a limited permission to host, copy, transmit, review, and otherwise use it to respond to the enquiry, protect the service, and provide any requested next step. If you voluntarily provide product or service feedback without a confidentiality restriction, we may use the underlying ideas to improve our business without payment, while continuing to handle personal information under the privacy notice.</p>
    </section>
    <section><h2>7. Third-party websites and services</h2>
      <p>The website may link to third-party sites or display third-party content. Links are provided for convenience and do not necessarily imply endorsement. We do not control third-party availability, security, terms, accuracy, or privacy practices. Your use of those services is governed by their own terms.</p>
    </section>
    <section id="liability"><h2>8. Availability, warranties, and liability</h2>
      <p>We use reasonable care in operating the website, but it is provided on an “as available” basis. To the maximum extent permitted by law, we do not guarantee uninterrupted access, complete security, error-free content, or that information will remain current or suitable for a particular purpose.</p>
      <p>Nothing in these terms excludes or limits liability that cannot lawfully be excluded, including liability for fraud or fraudulent misrepresentation. Subject to that rule, {company.legalName} and its officers, employees, and suppliers are not liable for indirect, incidental, special, consequential, or punitive loss arising from public website use, or for loss of profits, revenue, opportunity, goodwill, anticipated savings, or data. Any limitation will be applied only to the extent permitted by applicable law.</p>
    </section>
    <section><h2>9. Privacy</h2>
      <p>Our <a href="/privacy">privacy notice</a> explains how we handle personal information, and our <a href="/cookies">cookie policy</a> explains browser storage and analytics choices. These documents form part of the information governing website use but do not reduce rights provided by applicable law.</p>
    </section>
    <section><h2>10. Suspension and termination</h2>
      <p>We may suspend or terminate access where we reasonably believe these terms have been materially breached, the website or another person is at risk, or law requires it. Provisions intended by their nature to survive—including ownership, disclaimers, liability, and governing-law provisions—continue after access ends.</p>
    </section>
    <section><h2>11. Changes to these terms</h2>
      <p>We may revise these terms to reflect changes in the website, our business, or law. The effective date identifies the current version. Continued use after updated terms take effect means the updated terms govern later use, subject to any notice or consent requirements under applicable law.</p>
    </section>
    <section id="law"><h2>12. General legal terms</h2>
      <p>These terms and non-contractual disputes arising from them are governed by {legal.governingLaw}, without overriding any mandatory consumer protection that applies to you. Subject to mandatory law, the parties submit to {legal.courts}.</p>
      <p>If a provision is unenforceable, it will be limited or removed only to the minimum extent necessary and the remainder continues. A delay in enforcing a right is not a waiver. You may not assign rights under these terms without our consent; we may transfer them as part of a lawful reorganisation or business transfer. These terms do not create a partnership, agency, employment, or third-party beneficiary relationship.</p>
    </section>
    <section><h2>13. Contact</h2><p>Questions about these terms can be sent to <a href={`mailto:${company.email}`}>{company.email}</a> or by post to {company.legalName}, {company.address}.</p></section>
  </article>;
}
