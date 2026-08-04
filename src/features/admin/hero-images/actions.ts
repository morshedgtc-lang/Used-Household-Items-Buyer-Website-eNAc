"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { requireAdmin } from "@/services/admin";

const heroImageSchema = z.object({
  url: z.string().min(1),
  altAr: z.string().default(""),
  altEn: z.string().default(""),
  sortOrder: z.coerce.number().int().default(0),
});

export async function createHeroImage(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = heroImageSchema.parse({
    url: formData.get("url"),
    altAr: formData.get("altAr") ?? "",
    altEn: formData.get("altEn") ?? "",
    sortOrder: formData.get("sortOrder") ?? 0,
  });

  await prisma.heroImage.create({ data: parsed });

  await logActivity({
    adminId: admin.id,
    action: "CREATE",
    entity: "HeroImage",
  });

  revalidatePath("/admin/hero-images");
  revalidatePath("/");
}

export async function updateHeroImage(id: string, formData: FormData) {
  const admin = await requireAdmin();
  const parsed = heroImageSchema.parse({
    url: formData.get("url"),
    altAr: formData.get("altAr") ?? "",
    altEn: formData.get("altEn") ?? "",
    sortOrder: formData.get("sortOrder") ?? 0,
  });

  await prisma.heroImage.update({ where: { id }, data: parsed });

  await logActivity({
    adminId: admin.id,
    action: "UPDATE",
    entity: "HeroImage",
    entityId: id,
  });

  revalidatePath("/admin/hero-images");
  revalidatePath("/");
}

export async function deleteHeroImage(id: string) {
  const admin = await requireAdmin();
  await prisma.heroImage.delete({ where: { id } });

  await logActivity({
    adminId: admin.id,
    action: "DELETE",
    entity: "HeroImage",
    entityId: id,
  });

  revalidatePath("/admin/hero-images");
  revalidatePath("/");
}

export async function toggleHeroImageStatus(id: string) {
  const admin = await requireAdmin();
  const image = await prisma.heroImage.findUniqueOrThrow({ where: { id } });
  const newStatus =
    image.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

  await prisma.heroImage.update({
    where: { id },
    data: { status: newStatus as never },
  });

  await logActivity({
    adminId: admin.id,
    action: "TOGGLE_STATUS",
    entity: "HeroImage",
    entityId: id,
    payload: { status: newStatus },
  });

  revalidatePath("/admin/hero-images");
  revalidatePath("/");
}
