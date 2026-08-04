import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card } from "@/components/ui/card";
import type { Locale } from "@/config/site";
import { getPageContent } from "@/services/content";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildPageMetadata("about", locale as Locale, {
    title: locale === "ar" ? "من نحن" : "About Us",
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  const content = await getPageContent("about");
  const data = (content?.data ?? {}) as Record<string, string>;

  const blocks = [
    { title: t("CompanyStory"), body: locale === "ar" ? data.storyAr : data.storyEn },
    { title: t("Mission"), body: locale === "ar" ? data.missionAr : data.missionEn },
    { title: t("Vision"), body: locale === "ar" ? data.visionAr : data.visionEn },
    { title: t("Experience"), body: locale === "ar" ? data.experienceAr : data.experienceEn },
    { title: t("AreasCovered"), body: locale === "ar" ? data.areasAr : data.areasEn },
  ];

  return (
    <div className="container-page section-space">
      <h1 className="text-4xl font-bold">{t("About")}</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {blocks.map((block) => (
          <Card key={block.title} className="p-6">
            <h2 className="text-xl font-semibold">{block.title}</h2>
            <p className="mt-3 text-muted-foreground">{block.body}</p>
          </Card>
        ))}
      </div>
      <Link href={`/${locale}/contact`} className="mt-8 inline-block text-primary hover:underline">
        {t("Contact")}
      </Link>
    </div>
  );
}
