"use client";

import { useState } from "react";
import { Check, Copy, Facebook, Linkedin, Mail, MessageCircle, MessagesSquare, Send, Share2 } from "lucide-react";

export function ArticleShare({
  title,
  summary,
  url
}: {
  title: string;
  summary: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedMessage = encodeURIComponent(`${title}\n\n${summary}\n\n${url}`);
  const links = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, icon: Linkedin },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: Facebook },
    { label: "X", href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, icon: Send },
    { label: "WhatsApp", href: `https://wa.me/?text=${encodedMessage}`, icon: MessageCircle },
    { label: "Reddit", href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`, icon: MessagesSquare },
    { label: "Email", href: `mailto:?subject=${encodedTitle}&body=${encodedMessage}`, icon: Mail }
  ];

  async function share() {
    if (navigator.share) {
      await navigator.share({ title, text: summary, url }).catch(() => undefined);
      return;
    }
    await copy();
  }

  async function copy() {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
    } else {
      const input = document.createElement("textarea");
      input.value = url;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <aside className="article-share" aria-label="Share this article">
      <div>
        <span>Worth sharing?</span>
        <strong>Pass this article along</strong>
      </div>
      <nav aria-label="Social sharing options">
        <button type="button" className="share-button share-button-primary" onClick={share}>
          <Share2 aria-hidden="true" /> Share
        </button>
        {links.map(({ label, href, icon: Icon }) => (
          <a href={href} target={label === "Email" ? undefined : "_blank"} rel="noopener noreferrer" aria-label={`Share on ${label}`} key={label}>
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </a>
        ))}
        <button type="button" className="share-button" onClick={copy} aria-live="polite">
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          <span>{copied ? "Copied" : "Copy link"}</span>
        </button>
      </nav>
    </aside>
  );
}
