"use client";

import { useState } from "react";

export function UnsubscribeForm({ token, supportEmail }: { token: string; supportEmail: string }) {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit() {
    setState("submitting");
    const response = await fetch("/api/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });
    const body = await response.json().catch(() => null) as { message?: string } | null;
    if (response.ok) {
      setState("success");
      setMessage("Your preference has been recorded.");
    } else {
      setState("error");
      setMessage(body?.message ?? `We couldn’t update your preference. Please email ${supportEmail}.`);
    }
  }

  if (state === "success") {
    return <div className="preference-result" role="status"><h2>You’re unsubscribed</h2><p>{message} You may still receive essential replies to requests you send us.</p></div>;
  }

  return (
    <div className="preference-action">
      <button className="button button-primary" type="button" onClick={submit} disabled={state === "submitting"}>
        {state === "submitting" ? "Updating preference…" : "Unsubscribe"}
      </button>
      {state === "error" && <p className="form-error" role="alert">{message}</p>}
    </div>
  );
}
