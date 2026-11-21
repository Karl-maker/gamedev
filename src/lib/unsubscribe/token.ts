import { createHmac, timingSafeEqual } from "node:crypto";

function secret() {
  const value = process.env.UNSUBSCRIBE_SECRET || process.env.NOTION_TOKEN;
  if (!value) throw new Error("UNSUBSCRIBE_SECRET is not configured.");
  return value;
}

function signature(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createUnsubscribeToken(email: string) {
  const payload = Buffer.from(email.trim().toLowerCase(), "utf8").toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function readUnsubscribeToken(token: string): string | null {
  const [payload, suppliedSignature, extra] = token.split(".");
  if (!payload || !suppliedSignature || extra || payload.length > 320 || suppliedSignature.length > 64) return null;

  const expectedSignature = signature(payload);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;

  try {
    const email = Buffer.from(payload, "base64url").toString("utf8").trim().toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254 ? email : null;
  } catch {
    return null;
  }
}

export function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  return `${local.slice(0, 2)}${local.length > 2 ? "•••" : ""}@${domain}`;
}
