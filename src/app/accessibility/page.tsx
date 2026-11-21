import type { Metadata } from "next";
import { getWebsiteConfig } from "@/config";

export const metadata: Metadata = { title: "Accessibility statement", description: "Our approach to an accessible and inclusive website.", alternates: { canonical: "/accessibility" } };

export default function AccessibilityPage() {
  const { company, legal } = getWebsiteConfig();
  return <article className="legal container narrow">
    <span className="eyebrow">Information</span><h1>Accessibility statement</h1>
    <p className="legal-date">Last reviewed: {legal.effectiveDate}</p>
    <p className="legal-lead">{company.legalName} wants this website to be usable by as many people as reasonably possible, including people who use keyboards, screen readers, zoom, voice control, or reduced-motion settings.</p>
    <h2>Our target</h2><p>We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA. The shared site includes semantic landmarks, a skip link, visible keyboard focus, responsive reflow, labelled form controls, descriptive validation, reduced-motion support, and mobile controls designed for comfortable touch interaction.</p>
    <h2>Using this website</h2><p>You should be able to navigate the main menu and forms by keyboard, zoom without losing core content, use the site in portrait or landscape orientation, and change optional analytics without being forced to accept it. Article images require alternative text or a descriptive title from the content source.</p>
    <h2>Known limitations</h2><p>Content imported from Notion and third-party links may vary in accessibility. Editors must provide meaningful headings, link text, captions, and image descriptions. Embedded third-party material should be tested before publication. Very long data tables may require horizontal scrolling on narrow screens so their relationships remain intact.</p>
    <h2>Feedback and alternative formats</h2><p>If you encounter a barrier or need information in another format, email <a href={`mailto:${company.email}`}>{company.email}</a> or call <a href={`tel:${company.phone}`}>{company.phone}</a>. Please identify the page, the problem, your browser or assistive technology if comfortable sharing it, and the format you need. We will review the request and respond as reasonably practicable.</p>
    <h2>Ongoing review</h2><p>Accessibility is part of design, content, and release review rather than a one-time claim. Automated checks can identify some issues, but deployments should also be tested with keyboard navigation, zoom, representative mobile viewports, and assistive technology.</p>
  </article>;
}
