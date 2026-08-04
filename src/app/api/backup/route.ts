import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import {
  exportBackupData,
  restoreBackupData,
  type BackupPayload,
} from "@/services/admin";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await exportBackupData();

  await logActivity({
    adminId: session.user.id,
    action: "BACKUP_EXPORT",
    entity: "Backup",
  });

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="cms-backup-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as BackupPayload;

    if (!payload || payload.version !== 1) {
      return NextResponse.json({ error: "Invalid backup format" }, { status: 400 });
    }

    await restoreBackupData(payload);

    await logActivity({
      adminId: session.user.id,
      action: "BACKUP_RESTORE",
      entity: "Backup",
      payload: { exportedAt: payload.exportedAt },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Restore failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
