import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/config/site";
import { getPageContent } from "@/services/content";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildPageMetadata("terms", locale as Locale, {
    title: locale === "ar" ? "الشروط والأحكام" : "Terms",
  });
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  const content = await getPageContent("terms");
  const data = (content?.data ?? {}) as Record<string, string>;

  return (
    <div className="container-page section-space prose prose-neutral dark:prose-invert max-w-3xl">
      <h1>{t("Terms")}</h1>
      <p>{locale === "ar" ? data.bodyAr : data.bodyEn}</p>
    </div>
  );
}
