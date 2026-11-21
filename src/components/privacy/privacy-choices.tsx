"use client";

export function PrivacyChoices() {
  return (
    <button
      className="footer-link-button"
      type="button"
      onClick={() => window.dispatchEvent(new Event("privacy-choices-open"))}
    >
      Privacy choices
    </button>
  );
}
