import type { Metadata } from "next";
import Link from "next/link";
import { UnsubscribeForm } from "@/components/privacy/unsubscribe-form";
import { getWebsiteConfig } from "@/config";
import { maskEmail, readUnsubscribeToken } from "@/lib/unsubscribe/token";

export const metadata: Metadata = {
  title: "Email preferences",
  description: "Manage email preferences.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/unsubscribe" }
};

export default async function UnsubscribePage({
  searchParams
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const config = getWebsiteConfig();
  const token = (await searchParams).token ?? "";
  const email = token ? readUnsubscribeToken(token) : null;

  return (
    <section className="preference-page">
      <div className="preference-card">
        <span className="eyebrow">Email preferences</span>
        <h1>{email ? "Unsubscribe from non-essential email" : "This link isn’t valid"}</h1>
        {email ? (
          <>
            <p>Confirm that you no longer want non-essential email from {config.company.name} at <strong>{maskEmail(email)}</strong>.</p>
            <UnsubscribeForm token={token} supportEmail={config.company.email} />
          </>
        ) : (
          <p>The link may be incomplete or altered. Email <a href={`mailto:${config.company.email}`}>{config.company.email}</a> and we’ll update your preference.</p>
        )}
        <div className="preference-links"><Link href="/">Return home</Link><Link href="/privacy">Privacy notice</Link></div>
      </div>
    </section>
  );
}
