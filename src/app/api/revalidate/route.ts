import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = process.env.NOTION_WEBHOOK_SECRET;
  const signature = request.headers.get("x-webhook-signature");
  const rawBody = await request.text();
  if (!secret || !signature) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const valid =
    signature.length === expected.length &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  revalidateTag("notion-content", "max");
  return NextResponse.json({ revalidated: true });
}
