import { NextResponse } from "next/server";
import { getContent } from "@/lib/integrations/notion/content-repository";

export const revalidate = 3600;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string; slug: string }> }
) {
  const { type, slug } = await params;
  if (type !== "blog" && type !== "news") return new Response("Not found", { status: 404 });
  const entry = await getContent(type, slug).catch(() => null);
  if (!entry?.cover) return NextResponse.redirect(new URL("/opengraph-image", request.url));

  const imageUrl = new URL(entry.cover);
  if (imageUrl.protocol !== "https:" && imageUrl.protocol !== "http:") {
    return NextResponse.redirect(new URL("/opengraph-image", request.url));
  }

  const response = await fetch(imageUrl, { next: { revalidate: 3600 } }).catch(() => null);
  if (!response?.ok || !response.body) {
    return NextResponse.redirect(new URL("/opengraph-image", request.url));
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": response.headers.get("content-type") || "image/jpeg",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
