import Link from "next/link";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { InstantSearch } from "@/components/home/instant-search";
import { ConversionButtons } from "@/components/items/conversion-buttons";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/config/site";
import {
  getPageContent,
  getSettings,
  listPublishedCategories,
  listPublishedCities,
  listPublishedFaqs,
  listPublishedItems,
  listPublishedTestimonials,
} from "@/services/content";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildPageMetadata("home", locale as Locale);
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();

  const [settings, hero, whyUs, cta, categories, featured, cities, testimonials, faqs] =
    await Promise.all([
      getSettings(),
      getPageContent("home_hero"),
      getPageContent("why_us"),
      getPageContent("cta"),
      listPublishedCategories(),
      listPublishedItems({ featured: true, pageSize: 8 }),
      listPublishedCities(),
      listPublishedTestimonials(),
      listPublishedFaqs(),
    ]);

  const heroData = (hero?.data ?? {}) as Record<string, string>;
  const whyData = (whyUs?.data ?? {}) as { points?: { icon: string; titleAr: string; titleEn: string }[] };
  const ctaData = (cta?.data ?? {}) as Record<string, string>;
  const companyName = locale === "ar" ? settings.companyNameAr : settings.companyNameEn;

  const steps = [
    { title: t("Step1Title"), desc: t("Step1Desc") },
    { title: t("Step2Title"), desc: t("Step2Desc") },
    { title: t("Step3Title"), desc: t("Step3Desc") },
    { title: t("Step4Title"), desc: t("Step4Desc") },
    { title: t("Step5Title"), desc: t("Step5Desc") },
  ];

  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroData.image || "/images/hero.svg"}
            alt={companyName}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/25" />
        </div>
        <div className="container-page relative flex min-h-[88vh] flex-col justify-end pb-16 pt-28 text-white">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-green-200">
            {companyName}
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {locale === "ar" ? heroData.titleAr : heroData.titleEn}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/85 sm:text-lg">
            {locale === "ar" ? heroData.subtitleAr : heroData.subtitleEn}
          </p>
          <div className="mt-8">
            <ConversionButtons
              phone={settings.phone}
              whatsapp={settings.whatsapp}
              itemName={companyName}
            />
          </div>
          <div className="mt-10">
            <InstantSearch />
          </div>
        </div>
      </section>

      <section className="section-space container-page">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold">{t("Categories")}</h2>
          <Button asChild variant="outline">
            <Link href={`/${locale}/categories`}>{t("ViewAll")}</Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.id} href={`/${locale}/categories/${category.slug}`}>
              <Card className="overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
                <div className="relative h-40 bg-muted">
                  <Image
                    src={category.image || "/images/placeholder.svg"}
                    alt={locale === "ar" ? category.nameAr : category.nameEn}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{locale === "ar" ? category.nameAr : category.nameEn}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-space container-page">
        <h2 className="mb-8 text-3xl font-bold">{t("PopularItems")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.items.map((item) => (
            <Link key={item.id} href={`/${locale}/items/${item.slug}`}>
              <Card className="h-full overflow-hidden transition hover:-translate-y-1">
                <div className="relative h-44 bg-muted">
                  <Image
                    src={item.thumbnail || "/images/placeholder.svg"}
                    alt={locale === "ar" ? item.titleAr : item.titleEn}
                    fill
                    className="object-cover"
                  />
                  {item.featured ? (
                    <Badge className="absolute start-3 top-3">{t("Featured")}</Badge>
                  ) : null}
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
      </section>

      <section className="section-space container-page">
        <h2 className="mb-8 text-3xl font-bold">{t("WhyChooseUs")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(whyData.points ?? []).map((point) => (
            <Card key={point.titleEn} className="p-6">
              <h3 className="text-lg font-semibold">
                {locale === "ar" ? point.titleAr : point.titleEn}
              </h3>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-space container-page">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-bold">{t("HowItWorks")}</h2>
          <Button asChild variant="outline">
            <Link href={`/${locale}/how-it-works`}>{t("ViewAll")}</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          {steps.map((step, index) => (
            <Card key={step.title} className="p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {index + 1}
              </div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-space container-page">
        <h2 className="mb-8 text-3xl font-bold">{t("CitiesWeServe")}</h2>
        <div className="flex flex-wrap gap-3">
          {cities.map((city) => (
            <span
              key={city.id}
              className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
            >
              {locale === "ar" ? city.nameAr : city.nameEn}
            </span>
          ))}
        </div>
      </section>

      <section className="section-space container-page">
        <h2 className="mb-8 text-3xl font-bold">{t("CustomerReviews")}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="mb-2 text-amber-500">{"★".repeat(review.rating)}</div>
              <p className="text-sm text-muted-foreground">
                {locale === "ar" ? review.messageAr : review.messageEn}
              </p>
              <p className="mt-4 font-semibold">{review.name}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-space container-page">
        <Card className="overflow-hidden p-8 md:p-12">
          <h2 className="text-3xl font-bold">
            {locale === "ar" ? ctaData.titleAr : ctaData.titleEn}
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {locale === "ar" ? ctaData.subtitleAr : ctaData.subtitleEn}
          </p>
          <div className="mt-6">
            <ConversionButtons
              phone={settings.phone}
              whatsapp={settings.whatsapp}
              itemName={companyName}
            />
          </div>
        </Card>
      </section>

      {settings.googleMapEmbed ? (
        <section className="section-space container-page">
          <div className="overflow-hidden rounded-3xl border border-border shadow-soft">
            <iframe
              src={settings.googleMapEmbed}
              title="Google Map"
              className="h-80 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      ) : null}

      <section className="section-space container-page">
        <h2 className="mb-6 text-3xl font-bold">{t("FAQ")}</h2>
        <Accordion type="single" collapsible className="glass rounded-2xl px-4">
          {faqs.slice(0, 4).map((faq) => (
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
    </>
  );
}
