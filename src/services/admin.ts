import { ClickType, Prisma } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";

export async function requireAdmin() {
  const session = await requireAdminSession();
  return session.user;
}

export async function getDashboardStats() {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const [
    pageViews,
    whatsappClicks,
    callClicks,
    categoryCount,
    itemCount,
    testimonialCount,
    topViewed,
  ] = await Promise.all([
    prisma.clickEvent.count({
      where: {
        type: ClickType.PAGE_VIEW,
        createdAt: { gte: todayStart, lte: todayEnd },
      },
    }),
    prisma.clickEvent.count({
      where: {
        type: ClickType.WHATSAPP,
        createdAt: { gte: todayStart, lte: todayEnd },
      },
    }),
    prisma.clickEvent.count({
      where: {
        type: ClickType.CALL,
        createdAt: { gte: todayStart, lte: todayEnd },
      },
    }),
    prisma.category.count(),
    prisma.item.count(),
    prisma.testimonial.count(),
    prisma.clickEvent.groupBy({
      by: ["itemId"],
      where: {
        type: ClickType.PAGE_VIEW,
        itemId: { not: null },
        createdAt: { gte: todayStart, lte: todayEnd },
      },
      _count: { itemId: true },
      orderBy: { _count: { itemId: "desc" } },
      take: 1,
    }),
  ]);

  let topViewedItem: { id: string; titleEn: string; titleAr: string; views: number } | null =
    null;

  if (topViewed[0]?.itemId) {
    const item = await prisma.item.findUnique({
      where: { id: topViewed[0].itemId! },
      select: { id: true, titleEn: true, titleAr: true },
    });
    if (item) {
      topViewedItem = {
        ...item,
        views: topViewed[0]._count.itemId,
      };
    }
  }

  return {
    pageViews,
    whatsappClicks,
    callClicks,
    categoryCount,
    itemCount,
    testimonialCount,
    topViewedItem,
  };
}

export type BackupPayload = {
  version: 1;
  exportedAt: string;
  admins: Prisma.AdminCreateManyInput[];
  categories: Prisma.CategoryCreateManyInput[];
  items: Prisma.ItemCreateManyInput[];
  itemImages: Prisma.ItemImageCreateManyInput[];
  testimonials: Prisma.TestimonialCreateManyInput[];
  faqs: Prisma.FaqCreateManyInput[];
  cities: Prisma.CityCreateManyInput[];
  settings: Prisma.SettingCreateManyInput[];
  pageContents: Prisma.PageContentCreateManyInput[];
  seoSettings: Prisma.SeoSettingCreateManyInput[];
};

export async function exportBackupData(): Promise<BackupPayload> {
  const [admins, categories, items, itemImages, testimonials, faqs, cities, settings, pageContents, seoSettings] =
    await Promise.all([
      prisma.admin.findMany({ select: { id: true, email: true, passwordHash: true, name: true, role: true, createdAt: true, updatedAt: true } }),
      prisma.category.findMany(),
      prisma.item.findMany(),
      prisma.itemImage.findMany(),
      prisma.testimonial.findMany(),
      prisma.faq.findMany(),
      prisma.city.findMany(),
      prisma.setting.findMany() as Promise<Prisma.SettingCreateManyInput[]>,
      prisma.pageContent.findMany() as Promise<Prisma.PageContentCreateManyInput[]>,
      prisma.seoSetting.findMany() as Promise<Prisma.SeoSettingCreateManyInput[]>,
    ]);

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    admins,
    categories,
    items,
    itemImages,
    testimonials,
    faqs,
    cities,
    settings,
    pageContents,
    seoSettings,
  };
}

export async function restoreBackupData(payload: BackupPayload) {
  await prisma.$transaction(async (tx) => {
    await tx.itemImage.deleteMany();
    await tx.item.deleteMany();
    await tx.category.deleteMany();
    await tx.testimonial.deleteMany();
    await tx.faq.deleteMany();
    await tx.city.deleteMany();
    await tx.pageContent.deleteMany();
    await tx.seoSetting.deleteMany();
    await tx.setting.deleteMany();

    if (payload.admins.length) {
      await tx.admin.deleteMany();
      await tx.admin.createMany({ data: payload.admins });
    }

    if (payload.categories.length) {
      await tx.category.createMany({ data: payload.categories });
    }
    if (payload.items.length) {
      await tx.item.createMany({ data: payload.items });
    }
    if (payload.itemImages.length) {
      await tx.itemImage.createMany({ data: payload.itemImages });
    }
    if (payload.testimonials.length) {
      await tx.testimonial.createMany({ data: payload.testimonials });
    }
    if (payload.faqs.length) {
      await tx.faq.createMany({ data: payload.faqs });
    }
    if (payload.cities.length) {
      await tx.city.createMany({ data: payload.cities });
    }
    if (payload.settings.length) {
      await tx.setting.createMany({ data: payload.settings });
    }
    if (payload.pageContents.length) {
      await tx.pageContent.createMany({ data: payload.pageContents });
    }
    if (payload.seoSettings.length) {
      await tx.seoSetting.createMany({ data: payload.seoSettings });
    }
  });
}
