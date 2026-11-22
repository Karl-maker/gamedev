export function personalizePublicContent(value: string) {
  return value.replace(/\{\{\s*first_name\s*\}\}/gi, "Reader");
}
