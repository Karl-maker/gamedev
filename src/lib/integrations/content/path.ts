import type { ContentEntry } from "./types";

const notionIdSuffix = /-([0-9a-f]{32})$/i;

export function compactNotionId(id: string) {
  return id.replaceAll("-", "").toLowerCase();
}

export function notionIdFromRouteKey(routeKey: string) {
  return routeKey.match(notionIdSuffix)?.[1];
}

export function slugFromRouteKey(routeKey: string) {
  return routeKey.replace(notionIdSuffix, "");
}

export function contentRouteKey(entry: Pick<ContentEntry, "id" | "slug">) {
  return `${entry.slug}-${compactNotionId(entry.id)}`;
}

export function contentPath(entry: Pick<ContentEntry, "id" | "slug" | "type">) {
  return `/${entry.type}/${contentRouteKey(entry)}`;
}
