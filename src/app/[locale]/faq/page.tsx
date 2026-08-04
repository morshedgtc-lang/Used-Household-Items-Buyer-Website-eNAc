import { getTranslations, setRequestLocale } from "next-intl/server";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Locale } from "@/config/site";
import { listPublishedFaqs } from "@/services/content";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildPageMetadata("faq", locale as Locale, {
    title: locale === "ar" ? "الأسئلة الشائعة" : "FAQ",
  });
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  const faqs = await listPublishedFaqs();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: locale === "ar" ? faq.questionAr : faq.questionEn,
      acceptedAnswer: {
        "@type": "Answer",
        text: locale === "ar" ? faq.answerAr : faq.answerEn,
      },
    })),
  };

  return (
    <div className="container-page section-space">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-4xl font-bold">{t("FAQ")}</h1>
      <Accordion type="single" collapsible className="mt-8 glass rounded-2xl px-4">
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
    </div>
  );
}
