import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { searchContent } from "@/services/content";

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const limited = rateLimit(`search:${ip}`, 60, 60_000);
  if (!limited.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const data = await searchContent(q);
  return NextResponse.json(data);
}
