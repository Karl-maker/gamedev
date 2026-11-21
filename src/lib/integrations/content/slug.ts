export function normalizeContentSlug(value: string, fallback = "") {
  let candidate = value.trim() || fallback.trim();

  try {
    if (/^https?:\/\//i.test(candidate)) candidate = new URL(candidate).pathname;
    candidate = decodeURIComponent(candidate);
  } catch {
    // Keep the original value when it is not a valid URL or encoded path.
  }

  const pathSegments = candidate
    .split(/[/?#\\]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  candidate = pathSegments.at(-1) ?? candidate;

  return candidate
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/&/g, " and ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
