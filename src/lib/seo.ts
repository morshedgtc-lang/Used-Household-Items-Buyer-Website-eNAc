import type { Metadata } from "next";
import { env } from "@/lib/env";
import { getSeoSetting, getSettings } from "@/services/content";
import type { Locale } from "@/config/site";

export async function buildPageMetadata(
  pageKey: string,
  locale: Locale,
  overrides?: Partial<Metadata>,
): Promise<Metadata> {
  const [seo, settings] = await Promise.all([getSeoSetting(pageKey), getSettings()]);
  const title =
    locale === "ar"
      ? seo?.metaTitleAr || settings.companyNameAr
      : seo?.metaTitleEn || settings.companyNameEn;
  const description =
    locale === "ar"
      ? seo?.metaDescriptionAr || settings.addressAr
      : seo?.metaDescriptionEn || settings.addressEn;

  const url = `${env.NEXT_PUBLIC_SITE_URL}/${locale}${pageKey === "home" ? "" : `/${pageKey}`}`;

  return {
    title,
    description,
    keywords: seo?.keywords,
    alternates: {
      canonical: url,
      languages: {
        ar: `${env.NEXT_PUBLIC_SITE_URL}/ar${pageKey === "home" ? "" : `/${pageKey}`}`,
        en: `${env.NEXT_PUBLIC_SITE_URL}/en${pageKey === "home" ? "" : `/${pageKey}`}`,
      },
    },
    openGraph: {
      title: title ?? undefined,
      description: description ?? undefined,
      url,
      siteName: settings.companyNameEn,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
      images: seo?.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? undefined,
      description: description ?? undefined,
      images: seo?.ogImage ? [seo.ogImage] : undefined,
    },
    ...overrides,
  };
}

export function localBusinessJsonLd(settings: {
  companyNameEn: string;
  companyNameAr: string;
  phone: string;
  email: string;
  addressEn: string;
  addressAr: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.companyNameEn,
    alternateName: settings.companyNameAr,
    telephone: settings.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tabuk",
      addressCountry: "SA",
      streetAddress: settings.addressEn,
    },
    areaServed: "SA",
  };
}
