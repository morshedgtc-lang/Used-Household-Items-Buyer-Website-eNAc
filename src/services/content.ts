import { ContentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getSettings() {
  const settings = await prisma.setting.findUnique({ where: { id: "default" } });
  if (settings) return settings;
  return prisma.setting.create({ data: { id: "default" } });
}

export async function getPageContent(pageKey: string) {
  return prisma.pageContent.findUnique({ where: { pageKey } });
}

export async function getSeoSetting(pageKey: string) {
  return prisma.seoSetting.findUnique({ where: { pageKey } });
}

export async function listPublishedCategories() {
  return prisma.category.findMany({
    where: { status: ContentStatus.PUBLISHED },
    orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findFirst({
    where: { slug, status: ContentStatus.PUBLISHED },
  });
}

export async function listPublishedItems(params?: {
  categoryId?: string;
  featured?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 12;
  const where: Prisma.ItemWhereInput = {
    status: ContentStatus.PUBLISHED,
    ...(params?.categoryId ? { categoryId: params.categoryId } : {}),
    ...(params?.featured !== undefined ? { featured: params.featured } : {}),
    ...(params?.search
      ? {
          OR: [
            { titleAr: { contains: params.search, mode: "insensitive" } },
            { titleEn: { contains: params.search, mode: "insensitive" } },
            { descriptionAr: { contains: params.search, mode: "insensitive" } },
            { descriptionEn: { contains: params.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, items] = await Promise.all([
    prisma.item.count({ where }),
    prisma.item.findMany({
      where,
      include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getItemBySlug(slug: string) {
  return prisma.item.findFirst({
    where: { slug, status: ContentStatus.PUBLISHED },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getRelatedItems(categoryId: string, excludeId: string, take = 4) {
  return prisma.item.findMany({
    where: {
      categoryId,
      id: { not: excludeId },
      status: ContentStatus.PUBLISHED,
    },
    include: { category: true },
    orderBy: { sortOrder: "asc" },
    take,
  });
}

export async function listPublishedFaqs() {
  return prisma.faq.findMany({
    where: { status: ContentStatus.PUBLISHED },
    orderBy: { sortOrder: "asc" },
  });
}

export async function listPublishedCities() {
  return prisma.city.findMany({
    where: { status: ContentStatus.PUBLISHED },
    orderBy: { sortOrder: "asc" },
  });
}

export async function listPublishedTestimonials() {
  return prisma.testimonial.findMany({
    where: { status: ContentStatus.PUBLISHED },
    orderBy: { sortOrder: "asc" },
  });
}

export async function searchContent(query: string, limit = 10) {
  const q = query.trim();
  if (!q) return { categories: [], items: [] };

  const [categories, items] = await Promise.all([
    prisma.category.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        OR: [
          { nameAr: { contains: q, mode: "insensitive" } },
          { nameEn: { contains: q, mode: "insensitive" } },
        ],
      },
      take: limit,
    }),
    prisma.item.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        OR: [
          { titleAr: { contains: q, mode: "insensitive" } },
          { titleEn: { contains: q, mode: "insensitive" } },
        ],
      },
      include: { category: true },
      take: limit,
    }),
  ]);

  return { categories, items };
}

export async function trackClick(input: {
  type: "WHATSAPP" | "CALL" | "PAGE_VIEW";
  itemId?: string;
  path?: string;
  meta?: Record<string, unknown>;
}) {
  return prisma.clickEvent.create({
    data: {
      type: input.type,
      itemId: input.itemId,
      path: input.path,
      meta: input.meta as Prisma.InputJsonValue | undefined,
    },
  });
}

export async function listPublishedHeroImages() {
  return prisma.heroImage.findMany({
    where: { status: ContentStatus.PUBLISHED },
    orderBy: { sortOrder: "asc" },
    select: { url: true, altAr: true, altEn: true },
  });
}
