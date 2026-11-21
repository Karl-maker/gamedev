"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { WebsiteConfig } from "@/config/schema";

export function MobileNav({ config }: { config: WebsiteConfig }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
      if (event.key === "Tab") {
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function close() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  return (
    <div className="mobile-nav">
      <button
        ref={buttonRef}
        className="mobile-nav-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      {open && (
        <>
          <button className="mobile-nav-backdrop" type="button" onClick={close} aria-label="Dismiss navigation overlay" />
          <nav ref={panelRef} id="mobile-navigation" className="mobile-nav-panel" aria-label="Mobile navigation">
            {config.navigation.map((item, index) => (
              <Link ref={index === 0 ? firstLinkRef : undefined} key={item.href} href={item.href} onClick={close}>
                {item.label}
              </Link>
            ))}
            <Link className="button button-primary" href={config.hero.primaryCta.href} onClick={close}>
              {config.hero.primaryCta.label}
            </Link>
          </nav>
        </>
      )}
    </div>
  );
}
