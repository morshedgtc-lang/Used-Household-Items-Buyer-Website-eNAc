import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { ConversionButtons } from "@/components/items/conversion-buttons";
import type { Locale } from "@/config/site";
import { getPageContent, getSettings } from "@/services/content";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildPageMetadata("how-it-works", locale as Locale, {
    title: locale === "ar" ? "كيف نعمل" : "How It Works",
  });
}

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  const [settings, content] = await Promise.all([getSettings(), getPageContent("how_it_works")]);
  const data = (content?.data ?? {}) as Record<string, string>;
  const companyName = locale === "ar" ? settings.companyNameAr : settings.companyNameEn;

  const steps = [
    { title: t("Step1Title"), desc: t("Step1Desc") },
    { title: t("Step2Title"), desc: t("Step2Desc") },
    { title: t("Step3Title"), desc: t("Step3Desc") },
    { title: t("Step4Title"), desc: t("Step4Desc") },
    { title: t("Step5Title"), desc: t("Step5Desc") },
  ];

  return (
    <div className="container-page section-space">
      <h1 className="text-4xl font-bold">{t("HowItWorks")}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        {locale === "ar" ? data.introAr : data.introEn}
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <Card key={step.title} className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
              {index + 1}
            </div>
            <h2 className="text-xl font-semibold">{step.title}</h2>
            <p className="mt-2 text-muted-foreground">{step.desc}</p>
          </Card>
        ))}
      </div>
      <div className="mt-12">
        <ConversionButtons
          phone={settings.phone}
          whatsapp={settings.whatsapp}
          itemName={companyName}
        />
      </div>
    </div>
  );
}
