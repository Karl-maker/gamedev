import type { RichText } from "./types";

const firstNamePattern = /\{\{\s*first_name\s*\}\}/gi;

export function personalizePublicContent(value: string) {
  return value.replace(firstNamePattern, "Reader");
}

export function personalizePublicRichText(items: RichText[]) {
  const source = items.map((item) => item.plain_text).join("");
  const matches = [...source.matchAll(firstNamePattern)];
  if (!matches.length) return items;

  const offsets: number[] = [];
  let total = 0;
  for (const item of items) {
    offsets.push(total);
    total += item.plain_text.length;
  }
  const output = items.map(() => "");

  function appendRange(start: number, end: number) {
    for (let index = 0; index < items.length; index++) {
      const itemStart = offsets[index];
      const itemEnd = itemStart + items[index].plain_text.length;
      const overlapStart = Math.max(start, itemStart);
      const overlapEnd = Math.min(end, itemEnd);
      if (overlapStart < overlapEnd) {
        output[index] += source.slice(overlapStart, overlapEnd);
      }
    }
  }

  let cursor = 0;
  for (const match of matches) {
    const start = match.index;
    const end = start + match[0].length;
    appendRange(cursor, start);
    const owner = offsets.findLastIndex((offset) => offset <= start);
    output[Math.max(0, owner)] += "Reader";
    cursor = end;
  }
  appendRange(cursor, source.length);

  return items.map((item, index) => ({ ...item, plain_text: output[index] }));
}
