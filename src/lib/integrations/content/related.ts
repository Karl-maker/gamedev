import type { ContentEntry } from "./types";

export function relatedContent(entry: ContentEntry, candidates: ContentEntry[], limit = 3) {
  const entryTags = new Set(entry.tags.map((tag) => tag.toLowerCase()));
  return candidates
    .filter((candidate) => candidate.id !== entry.id)
    .map((candidate) => ({
      candidate,
      score: candidate.tags.reduce(
        (total, tag) => total + (entryTags.has(tag.toLowerCase()) ? 10 : 0),
        0
      )
    }))
    .sort((a, b) => b.score - a.score || Date.parse(b.candidate.publishedAt) - Date.parse(a.candidate.publishedAt))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
