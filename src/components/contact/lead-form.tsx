"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/components/analytics/analytics";
import { useExperiments } from "@/components/experiments/experiment-provider";
import { callingCodes, companySizes, countryOptions, industries } from "@/data/options";
import { FlagSelect, type FlagSelectOption } from "./flag-select";

type FormErrors = Record<string, string[] | undefined>;

export function LeadForm() {
  const assignments = useExperiments();
  const [startedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [countryName, setCountryName] = useState("");
  const [callingCodeId, setCallingCodeId] = useState("TT:+1868");
  const selectedCallingCode = callingCodes.find((option) => option.id === callingCodeId) ?? callingCodes[0];
  const callingCodeOptions: FlagSelectOption[] = callingCodes.map((option) => ({
    id: option.id,
    value: option.id,
    countryCode: option.countryCode,
    label: option.countryName,
    secondary: option.displayCode,
    search: option.value
  }));
  const countrySelectOptions: FlagSelectOption[] = countryOptions.map((option) => ({
    id: option.name,
    value: option.name,
    countryCode: option.code,
    label: option.name,
    secondary: option.code
  }));

  function updateCountry(name: string) {
    setCountryName(name);
    const country = countryOptions.find((option) => option.name === name);
    const primaryCode = callingCodes.find(
      (option) => option.countryCode === country?.code && option.primary
    );
    if (primaryCode) setCallingCodeId(primaryCode.id);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    setErrors({});
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        consent: form.get("consent") === "on",
        startedAt,
        experimentAssignments: assignments
      })
    });
    const result = await response.json();
    if (!response.ok) {
      setStatus("idle");
      setErrors(result.fields ?? {});
      setMessage(result.message ?? "Something went wrong. Please try again.");
      return;
    }
    setStatus("success");
    trackEvent("lead_submitted", assignments);
  }

  if (status === "success") return (
    <div className="form-success" role="status">
      <CheckCircle2 size={44} />
      <h2>Thanks — your request is with us.</h2>
      <p>Check your inbox for confirmation. We’ll be in touch within two business days.</p>
    </div>
  );

  const error = (name: string) => errors[name]?.[0] && <span className="field-error">{errors[name]?.[0]}</span>;
  return (
    <form className="lead-form" onSubmit={submit} noValidate>
      <div className="form-row">
        <label>First name<input name="firstName" autoComplete="given-name" required aria-invalid={Boolean(errors.firstName)} />{error("firstName")}</label>
        <label>Last name<input name="lastName" autoComplete="family-name" required aria-invalid={Boolean(errors.lastName)} />{error("lastName")}</label>
      </div>
      <div className="form-row">
        <label>Company<input name="company" autoComplete="organization" required aria-invalid={Boolean(errors.company)} />{error("company")}</label>
        <label>Work email<input name="workEmail" type="email" autoComplete="email" required aria-invalid={Boolean(errors.workEmail)} />{error("workEmail")}</label>
      </div>
      <div className="form-row phone-row">
        <div className="field-group"><span className="field-label">Country/region code</span>
          <FlagSelect options={callingCodeOptions} value={callingCodeId} onChange={setCallingCodeId} placeholder="Select calling code" ariaLabel="International calling code" />
          <input type="hidden" name="callingCode" value={selectedCallingCode.value} />
        </div>
        <label>Phone number<input name="phone" inputMode="tel" autoComplete="tel-national" required aria-invalid={Boolean(errors.phone)} />{error("phone")}</label>
      </div>
      <label>How should we contact you?<select name="preferredContactMethod" defaultValue="Email" required><option>Email</option><option>Phone</option><option>Either</option></select>{error("preferredContactMethod")}</label>
      <div className="form-row">
        <label>Company size<select name="companySize" defaultValue="" required><option value="" disabled>Select size</option>{companySizes.map((item) => <option key={item}>{item}</option>)}</select>{error("companySize")}</label>
        <label>Industry<select name="industry" defaultValue="" required><option value="" disabled>Select industry</option>{industries.map((item) => <option key={item}>{item}</option>)}</select>{error("industry")}</label>
      </div>
      <div className="field-group"><span className="field-label">Country or territory</span>
        <FlagSelect name="country" options={countrySelectOptions} value={countryName} onChange={updateCountry} placeholder="Select country or territory" ariaLabel="Country or territory" invalid={Boolean(errors.country)} />
        <span className="field-hint">Open the list and search by country name or ISO code.</span>
        {error("country")}
      </div>
      <label>How can we help?<textarea name="message" rows={5} required aria-invalid={Boolean(errors.message)} />{error("message")}</label>
      <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className="check-field"><input name="consent" type="checkbox" required /> <span>I agree that my information may be used to respond to this request. See our <a href="/privacy">privacy notice</a>.</span></label>
      {error("consent")}
      {message && <p className="form-error" role="alert">{message}</p>}
      <button className="button button-primary button-large" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send request"}</button>
      <p className="form-note">Protected by validation, rate limiting, and automated abuse checks.</p>
    </form>
  );
}
