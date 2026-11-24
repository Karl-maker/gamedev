"use client";

import { useRef, useState, type CSSProperties } from "react";
import { Check, Copy, Mail, Share2, X as CloseIcon } from "lucide-react";
import { siFacebook, siReddit, siWhatsapp, siX } from "simple-icons";

type BrandIcon = {
  title: string;
  path: string;
  hex: string;
};

function BrandMark({ icon }: { icon: BrandIcon }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon.path} /></svg>;
}

const linkedIn: BrandIcon = {
  title: "LinkedIn",
  hex: "0A66C2",
  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"
};

export function ArticleShare({
  title,
  summary,
  url
}: {
  title: string;
  summary: string;
  url: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedMessage = encodeURIComponent(`${title}\n\n${summary}\n\n${url}`);
  const brandLinks = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, icon: linkedIn },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: siFacebook },
    { label: "X", href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, icon: siX },
    { label: "WhatsApp", href: `https://wa.me/?text=${encodedMessage}`, icon: siWhatsapp },
    { label: "Reddit", href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`, icon: siReddit }
  ];

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
      <span>Enjoyed this article?</span>
      <button type="button" className="share-trigger" onClick={() => dialog.current?.showModal()}>
        <Share2 aria-hidden="true" /> Share article
      </button>

      <dialog
        ref={dialog}
        className="share-dialog"
        aria-labelledby="share-dialog-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <div className="share-dialog-card">
          <header>
            <div>
              <span>Share this article</span>
              <h2 id="share-dialog-title">{title}</h2>
            </div>
            <form method="dialog">
              <button type="submit" className="share-dialog-close" aria-label="Close sharing options">
                <CloseIcon aria-hidden="true" />
              </button>
            </form>
          </header>

          <div className="share-platforms">
            {brandLinks.map(({ label, href, icon }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => dialog.current?.close()}
                style={{ "--share-brand": `#${icon.hex}` } as CSSProperties}
                key={label}
              >
                <BrandMark icon={icon} />
                <span>{label}</span>
              </a>
            ))}
            <a href={`mailto:?subject=${encodedTitle}&body=${encodedMessage}`} onClick={() => dialog.current?.close()}>
              <Mail aria-hidden="true" />
              <span>Email</span>
            </a>
          </div>

          <div className="share-copy">
            <span className="share-copy-url">{url}</span>
            <button type="button" onClick={copy} aria-live="polite">
              {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
        </div>
      </dialog>
    </aside>
  );
}
