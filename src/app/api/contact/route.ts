import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizePlainText } from "@/lib/sanitize";
import { logger } from "@/lib/logger";

const schema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(8).max(20),
  message: z.string().min(5).max(2000),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const limited = rateLimit(`contact:${ip}`, 5, 60_000);
  if (!limited.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = schema.parse(await request.json());
    await prisma.contactSubmission.create({
      data: {
        name: sanitizePlainText(body.name, 100),
        phone: sanitizePlainText(body.phone, 20),
        message: sanitizePlainText(body.message, 2000),
      },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error("Contact form failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
