"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ContentStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { requireAdmin } from "@/services/admin";
import { slugifyBilingual } from "@/utils/slug";

const categorySchema = z.object({
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  slug: z.string().optional(),
  descriptionAr: z.string().default(""),
  descriptionEn: z.string().default(""),
  image: z.string().optional(),
  icon: z.string().optional(),
  status: z.nativeEnum(ContentStatus),
  sortOrder: z.coerce.number().int().default(0),
});

export async function createCategory(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = categorySchema.parse({
    nameAr: formData.get("nameAr"),
    nameEn: formData.get("nameEn"),
    slug: formData.get("slug") || undefined,
    descriptionAr: formData.get("descriptionAr") ?? "",
    descriptionEn: formData.get("descriptionEn") ?? "",
    image: formData.get("image") || undefined,
    icon: formData.get("icon") || undefined,
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder") ?? 0,
  });

  const slug =
    parsed.slug?.trim() || slugifyBilingual(parsed.nameAr, parsed.nameEn);

  const category = await prisma.category.create({
    data: { ...parsed, slug },
  });

  await logActivity({
    adminId: admin.id,
    action: "CREATE",
    entity: "Category",
    entityId: category.id,
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const admin = await requireAdmin();
  const parsed = categorySchema.parse({
    nameAr: formData.get("nameAr"),
    nameEn: formData.get("nameEn"),
    slug: formData.get("slug") || undefined,
    descriptionAr: formData.get("descriptionAr") ?? "",
    descriptionEn: formData.get("descriptionEn") ?? "",
    image: formData.get("image") || undefined,
    icon: formData.get("icon") || undefined,
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder") ?? 0,
  });

  const slug =
    parsed.slug?.trim() || slugifyBilingual(parsed.nameAr, parsed.nameEn);

  await prisma.category.update({
    where: { id },
    data: { ...parsed, slug },
  });

  await logActivity({
    adminId: admin.id,
    action: "UPDATE",
    entity: "Category",
    entityId: id,
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  const admin = await requireAdmin();
  await prisma.category.delete({ where: { id } });
  await logActivity({
    adminId: admin.id,
    action: "DELETE",
    entity: "Category",
    entityId: id,
  });
  revalidatePath("/admin/categories");
}

export async function toggleCategoryStatus(id: string) {
  const admin = await requireAdmin();
  const category = await prisma.category.findUniqueOrThrow({ where: { id } });
  const newStatus =
    category.status === ContentStatus.PUBLISHED
      ? ContentStatus.DRAFT
      : ContentStatus.PUBLISHED;

  await prisma.category.update({
    where: { id },
    data: { status: newStatus },
  });

  await logActivity({
    adminId: admin.id,
    action: "TOGGLE_STATUS",
    entity: "Category",
    entityId: id,
    payload: { status: newStatus },
  });

  revalidatePath("/admin/categories");
}
