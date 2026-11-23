export function PageJsonLd({
  baseUrl,
  path,
  title,
  description,
  type = "WebPage",
  additional
}: {
  baseUrl: string;
  path: string;
  title: string;
  description: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  additional?: Record<string, unknown>;
}) {
  const base = baseUrl.replace(/\/$/, "");
  const url = `${base}${path}`;
  const page = {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: { "@id": `${base}/#website` },
    about: { "@id": `${base}/#organization` }
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      { "@type": "ListItem", position: 2, name: title, item: url }
    ]
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(page).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }} />
      {additional && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(additional).replace(/</g, "\\u003c") }} />}
    </>
  );
}
