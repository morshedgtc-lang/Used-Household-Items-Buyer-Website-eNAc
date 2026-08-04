import Link from "next/link";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Locale } from "@/config/site";
import { listPublishedCategories } from "@/services/content";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildPageMetadata("categories", locale as Locale);
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  const categories = await listPublishedCategories();

  return (
    <div className="container-page section-space">
      <h1 className="text-4xl font-bold">{t("AllCategories")}</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.id} href={`/${locale}/categories/${category.slug}`}>
            <Card className="overflow-hidden transition hover:-translate-y-1">
              <div className="relative h-44 bg-muted">
                <Image
                  src={category.image || "/images/placeholder.svg"}
                  alt={locale === "ar" ? category.nameAr : category.nameEn}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{locale === "ar" ? category.nameAr : category.nameEn}</CardTitle>
                <CardDescription>
                  {locale === "ar" ? category.descriptionAr : category.descriptionEn}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
