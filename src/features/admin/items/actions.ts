"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ContentStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { requireAdmin } from "@/services/admin";
import { slugifyBilingual } from "@/utils/slug";

const itemSchema = z.object({
  categoryId: z.string().min(1),
  titleAr: z.string().min(1),
  titleEn: z.string().min(1),
  slug: z.string().optional(),
  descriptionAr: z.string().default(""),
  descriptionEn: z.string().default(""),
  benefitsAr: z.string().default(""),
  benefitsEn: z.string().default(""),
  pickupInfoAr: z.string().default(""),
  pickupInfoEn: z.string().default(""),
  thumbnail: z.string().optional(),
  featured: z.coerce.boolean().default(false),
  status: z.nativeEnum(ContentStatus),
  sortOrder: z.coerce.number().int().default(0),
  metaTitleAr: z.string().optional(),
  metaTitleEn: z.string().optional(),
  metaDescriptionAr: z.string().optional(),
  metaDescriptionEn: z.string().optional(),
});

type ImageInput = { url: string; altAr: string; altEn: string };

function parseImages(raw: FormDataEntryValue | null): ImageInput[] {
  if (!raw || typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as ImageInput[];
    return Array.isArray(parsed) ? parsed.filter((i) => i.url) : [];
  } catch {
    return [];
  }
}

export async function createItem(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = itemSchema.parse({
    categoryId: formData.get("categoryId"),
    titleAr: formData.get("titleAr"),
    titleEn: formData.get("titleEn"),
    slug: formData.get("slug") || undefined,
    descriptionAr: formData.get("descriptionAr") ?? "",
    descriptionEn: formData.get("descriptionEn") ?? "",
    benefitsAr: formData.get("benefitsAr") ?? "",
    benefitsEn: formData.get("benefitsEn") ?? "",
    pickupInfoAr: formData.get("pickupInfoAr") ?? "",
    pickupInfoEn: formData.get("pickupInfoEn") ?? "",
    thumbnail: formData.get("thumbnail") || undefined,
    featured: formData.get("featured") === "on",
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder") ?? 0,
    metaTitleAr: formData.get("metaTitleAr") || undefined,
    metaTitleEn: formData.get("metaTitleEn") || undefined,
    metaDescriptionAr: formData.get("metaDescriptionAr") || undefined,
    metaDescriptionEn: formData.get("metaDescriptionEn") || undefined,
  });

  const images = parseImages(formData.get("images"));
  const slug =
    parsed.slug?.trim() || slugifyBilingual(parsed.titleAr, parsed.titleEn);

  const item = await prisma.item.create({
    data: {
      ...parsed,
      slug,
      thumbnail: parsed.thumbnail || images[0]?.url,
      images: {
        create: images.map((img, index) => ({
          url: img.url,
          altAr: img.altAr,
          altEn: img.altEn,
          sortOrder: index,
        })),
      },
    },
  });

  await logActivity({
    adminId: admin.id,
    action: "CREATE",
    entity: "Item",
    entityId: item.id,
  });

  revalidatePath("/admin/items");
  redirect("/admin/items");
}

export async function updateItem(id: string, formData: FormData) {
  const admin = await requireAdmin();
  const parsed = itemSchema.parse({
    categoryId: formData.get("categoryId"),
    titleAr: formData.get("titleAr"),
    titleEn: formData.get("titleEn"),
    slug: formData.get("slug") || undefined,
    descriptionAr: formData.get("descriptionAr") ?? "",
    descriptionEn: formData.get("descriptionEn") ?? "",
    benefitsAr: formData.get("benefitsAr") ?? "",
    benefitsEn: formData.get("benefitsEn") ?? "",
    pickupInfoAr: formData.get("pickupInfoAr") ?? "",
    pickupInfoEn: formData.get("pickupInfoEn") ?? "",
    thumbnail: formData.get("thumbnail") || undefined,
    featured: formData.get("featured") === "on",
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder") ?? 0,
    metaTitleAr: formData.get("metaTitleAr") || undefined,
    metaTitleEn: formData.get("metaTitleEn") || undefined,
    metaDescriptionAr: formData.get("metaDescriptionAr") || undefined,
    metaDescriptionEn: formData.get("metaDescriptionEn") || undefined,
  });

  const images = parseImages(formData.get("images"));
  const slug =
    parsed.slug?.trim() || slugifyBilingual(parsed.titleAr, parsed.titleEn);

  await prisma.$transaction(async (tx) => {
    await tx.itemImage.deleteMany({ where: { itemId: id } });
    await tx.item.update({
      where: { id },
      data: {
        ...parsed,
        slug,
        thumbnail: parsed.thumbnail || images[0]?.url,
        images: {
          create: images.map((img, index) => ({
            url: img.url,
            altAr: img.altAr,
            altEn: img.altEn,
            sortOrder: index,
          })),
        },
      },
    });
  });

  await logActivity({
    adminId: admin.id,
    action: "UPDATE",
    entity: "Item",
    entityId: id,
  });

  revalidatePath("/admin/items");
  redirect("/admin/items");
}

export async function deleteItem(id: string) {
  const admin = await requireAdmin();
  await prisma.item.delete({ where: { id } });
  await logActivity({
    adminId: admin.id,
    action: "DELETE",
    entity: "Item",
    entityId: id,
  });
  revalidatePath("/admin/items");
}

export async function toggleItemFeatured(id: string) {
  const admin = await requireAdmin();
  const item = await prisma.item.findUniqueOrThrow({ where: { id } });
  await prisma.item.update({
    where: { id },
    data: { featured: !item.featured },
  });
  await logActivity({
    adminId: admin.id,
    action: "TOGGLE_FEATURED",
    entity: "Item",
    entityId: id,
  });
  revalidatePath("/admin/items");
}
