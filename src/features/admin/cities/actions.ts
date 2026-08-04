"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ContentStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { requireAdmin } from "@/services/admin";

const citySchema = z.object({
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  status: z.nativeEnum(ContentStatus),
  sortOrder: z.coerce.number().int().default(0),
});

export async function createCity(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = citySchema.parse({
    nameAr: formData.get("nameAr"),
    nameEn: formData.get("nameEn"),
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder") ?? 0,
  });

  const city = await prisma.city.create({ data: parsed });
  await logActivity({
    adminId: admin.id,
    action: "CREATE",
    entity: "City",
    entityId: city.id,
  });
  revalidatePath("/admin/cities");
  redirect("/admin/cities");
}

export async function updateCity(id: string, formData: FormData) {
  const admin = await requireAdmin();
  const parsed = citySchema.parse({
    nameAr: formData.get("nameAr"),
    nameEn: formData.get("nameEn"),
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder") ?? 0,
  });

  await prisma.city.update({ where: { id }, data: parsed });
  await logActivity({
    adminId: admin.id,
    action: "UPDATE",
    entity: "City",
    entityId: id,
  });
  revalidatePath("/admin/cities");
  redirect("/admin/cities");
}

export async function deleteCity(id: string) {
  const admin = await requireAdmin();
  await prisma.city.delete({ where: { id } });
  await logActivity({
    adminId: admin.id,
    action: "DELETE",
    entity: "City",
    entityId: id,
  });
  revalidatePath("/admin/cities");
}

export async function toggleCityStatus(id: string) {
  const admin = await requireAdmin();
  const row = await prisma.city.findUniqueOrThrow({ where: { id } });
  const newStatus =
    row.status === ContentStatus.PUBLISHED ? ContentStatus.DRAFT : ContentStatus.PUBLISHED;
  await prisma.city.update({ where: { id }, data: { status: newStatus } });
  await logActivity({
    adminId: admin.id,
    action: "TOGGLE_STATUS",
    entity: "City",
    entityId: id,
  });
  revalidatePath("/admin/cities");
}
