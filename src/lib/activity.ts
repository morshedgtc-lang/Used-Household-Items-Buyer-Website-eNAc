import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function logActivity(input: {
  adminId?: string | null;
  action: string;
  entity?: string;
  entityId?: string;
  ip?: string;
  userAgent?: string;
  payload?: unknown;
}) {
  try {
    await prisma.activityLog.create({
      data: {
        adminId: input.adminId ?? null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId,
        ip: input.ip,
        userAgent: input.userAgent,
        payload: input.payload as object | undefined,
      },
    });
  } catch (error) {
    logger.error("Failed to write activity log", {
      error: error instanceof Error ? error.message : "unknown",
    });
  }
}
