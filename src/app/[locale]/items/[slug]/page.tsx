import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ConversionButtons } from "@/components/items/conversion-buttons";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Locale } from "@/config/site";
import {
  getItemBySlug,
  getRelatedItems,
  getSettings,
  listPublishedFaqs,
} from "@/services/content";
import { buildPageMetadata } from "@/lib/seo";
import { ItemGallery } from "@/components/items/item-gallery";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) return {};
  return buildPageMetadata("home", locale as Locale, {
    title:
      locale === "ar"
        ? item.metaTitleAr || item.titleAr
        : item.metaTitleEn || item.titleEn,
    description:
      locale === "ar"
        ? item.metaDescriptionAr || item.descriptionAr
        : item.metaDescriptionEn || item.descriptionEn,
  });
}

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();

  const item = await getItemBySlug(slug);
  if (!item) notFound();

  const [settings, related, faqs] = await Promise.all([
    getSettings(),
    getRelatedItems(item.categoryId, item.id),
    listPublishedFaqs(),
  ]);

  const title = locale === "ar" ? item.titleAr : item.titleEn;
  const description = locale === "ar" ? item.descriptionAr : item.descriptionEn;
  const benefits = (locale === "ar" ? item.benefitsAr : item.benefitsEn)
    .split("\n")
    .filter(Boolean);
  const pickup = locale === "ar" ? item.pickupInfoAr : item.pickupInfoEn;
  const gallery = item.images.length
    ? item.images
    : [{ id: "thumb", url: item.thumbnail || "/images/placeholder.svg", altAr: item.titleAr, altEn: item.titleEn, sortOrder: 0, itemId: item.id, createdAt: new Date() }];

  return (
    <div className="container-page section-space">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href={`/${locale}`}>{t("Home")}</Link>
        {" / "}
        <Link href={`/${locale}/categories`}>{t("Categories")}</Link>
        {" / "}
        <Link href={`/${locale}/categories/${item.category.slug}`}>
          {locale === "ar" ? item.category.nameAr : item.category.nameEn}
        </Link>
        {" / "}
        <span>{title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ItemGallery
          images={gallery.map((img) => ({
            url: img.url,
            alt: locale === "ar" ? img.altAr || title : img.altEn || title,
          }))}
        />

        <div>
          <h1 className="text-4xl font-bold">{title}</h1>
          <p className="mt-4 whitespace-pre-line text-muted-foreground">{description}</p>

          <div className="mt-8">
            <h2 className="text-xl font-semibold">{t("Benefits")}</h2>
            <ul className="mt-3 space-y-2">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-white/60 p-5 dark:bg-white/5">
            <h2 className="text-xl font-semibold">{t("PickupInfo")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{pickup}</p>
          </div>

          <div className="sticky bottom-4 mt-8 rounded-2xl border border-border bg-background/90 p-4 shadow-soft backdrop-blur">
            <ConversionButtons
              phone={settings.phone}
              whatsapp={settings.whatsapp}
              itemName={title}
              itemId={item.id}
            />
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">{t("RelatedItems")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((relatedItem) => (
            <Link key={relatedItem.id} href={`/${locale}/items/${relatedItem.slug}`}>
              <Card className="overflow-hidden">
                <div className="relative h-40 bg-muted">
                  <Image
                    src={relatedItem.thumbnail || "/images/placeholder.svg"}
                    alt={locale === "ar" ? relatedItem.titleAr : relatedItem.titleEn}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-base">
                    {locale === "ar" ? relatedItem.titleAr : relatedItem.titleEn}
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">{t("FAQ")}</h2>
        <Accordion type="single" collapsible className="glass rounded-2xl px-4">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>
                {locale === "ar" ? faq.questionAr : faq.questionEn}
              </AccordionTrigger>
              <AccordionContent>
                {locale === "ar" ? faq.answerAr : faq.answerEn}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
