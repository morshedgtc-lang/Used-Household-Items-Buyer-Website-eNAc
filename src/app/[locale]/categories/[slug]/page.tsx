import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Locale } from "@/config/site";
import { getCategoryBySlug, listPublishedItems } from "@/services/content";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return buildPageMetadata("categories", locale as Locale, {
    title: locale === "ar" ? category.nameAr : category.nameEn,
    description: locale === "ar" ? category.descriptionAr : category.descriptionEn,
  });
}

export default async function CategoryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const { q, page: pageParam } = await searchParams;
  const locale = localeParam as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const page = Number(pageParam || "1") || 1;
  const { items, totalPages } = await listPublishedItems({
    categoryId: category.id,
    search: q,
    page,
    pageSize: 9,
  });

  return (
    <div>
      <section className="relative h-64 overflow-hidden">
        <Image
          src={category.image || "/images/placeholder.svg"}
          alt={locale === "ar" ? category.nameAr : category.nameEn}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="container-page relative flex h-full flex-col justify-end pb-8 text-white">
          <nav className="mb-3 text-sm text-white/80">
            <Link href={`/${locale}`}>{t("Home")}</Link>
            {" / "}
            <Link href={`/${locale}/categories`}>{t("Categories")}</Link>
            {" / "}
            <span>{locale === "ar" ? category.nameAr : category.nameEn}</span>
          </nav>
          <h1 className="text-4xl font-bold">
            {locale === "ar" ? category.nameAr : category.nameEn}
          </h1>
          <p className="mt-2 max-w-2xl text-white/85">
            {locale === "ar" ? category.descriptionAr : category.descriptionEn}
          </p>
        </div>
      </section>

      <div className="container-page section-space">
        <form className="mb-8 max-w-md">
          <Input
            name="q"
            defaultValue={q}
            placeholder={t("SearchPlaceholder")}
            className="h-12"
          />
        </form>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link key={item.id} href={`/${locale}/items/${item.slug}`}>
              <Card className="overflow-hidden transition hover:-translate-y-1">
                <div className="relative h-48 bg-muted">
                  <Image
                    src={item.thumbnail || "/images/placeholder.svg"}
                    alt={locale === "ar" ? item.titleAr : item.titleEn}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-base">
                    {locale === "ar" ? item.titleAr : item.titleEn}
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {!items.length ? (
          <p className="mt-8 text-muted-foreground">{t("NoResults")}</p>
        ) : null}

        {totalPages > 1 ? (
          <div className="mt-10 flex items-center justify-center gap-3">
            <Button asChild variant="outline" disabled={page <= 1}>
              <Link
                href={`/${locale}/categories/${slug}?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              >
                {t("Previous")}
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground">
              {t("Page")} {page} {t("Of")} {totalPages}
            </span>
            <Button asChild variant="outline" disabled={page >= totalPages}>
              <Link
                href={`/${locale}/categories/${slug}?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              >
                {t("Next")}
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
