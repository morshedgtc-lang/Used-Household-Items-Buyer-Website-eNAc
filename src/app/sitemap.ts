import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { locales } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const staticPaths = [
    "",
    "/categories",
    "/about",
    "/how-it-works",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.7,
      });
    }
  }

  try {
    const [categories, items] = await Promise.all([
      prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.item.findMany({ select: { slug: true, updatedAt: true } }),
    ]);

    for (const locale of locales) {
      for (const category of categories) {
        entries.push({
          url: `${base}/${locale}/categories/${category.slug}`,
          lastModified: category.updatedAt,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
      for (const item of items) {
        entries.push({
          url: `${base}/${locale}/items/${item.slug}`,
          lastModified: item.updatedAt,
          changeFrequency: "weekly",
          priority: 0.9,
        });
      }
    }
  } catch {
    // DB unavailable during build — return static entries
  }

  return entries;
}
