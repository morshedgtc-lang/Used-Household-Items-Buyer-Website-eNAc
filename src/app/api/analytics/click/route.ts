import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { trackClick } from "@/services/content";
import { logger } from "@/lib/logger";

const schema = z.object({
  type: z.enum(["WHATSAPP", "CALL", "PAGE_VIEW"]),
  itemId: z.string().optional(),
  path: z.string().optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const limited = rateLimit(`click:${ip}`, 120, 60_000);
  if (!limited.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = schema.parse(await request.json());
    await trackClick(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error("Click tracking failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
