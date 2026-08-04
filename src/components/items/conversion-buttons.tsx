"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildTelUrl, buildWhatsAppUrl } from "@/utils/whatsapp";
import type { Locale } from "@/config/site";

type ConversionButtonsProps = {
  phone: string;
  whatsapp: string;
  itemName: string;
  itemId?: string;
  className?: string;
};

export function ConversionButtons({
  phone,
  whatsapp,
  itemName,
  itemId,
  className,
}: ConversionButtonsProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  async function track(type: "WHATSAPP" | "CALL") {
    await fetch("/api/analytics/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        itemId,
        path: window.location.pathname,
      }),
    });
  }

  return (
    <div className={className ?? "flex flex-wrap gap-3"}>
      <Button asChild variant="whatsapp" size="lg">
        <a
          href={buildWhatsAppUrl(whatsapp, itemName, locale)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => void track("WHATSAPP")}
        >
          {t("SellThisItem")}
        </a>
      </Button>
      <Button asChild variant="call" size="lg">
        <a href={buildTelUrl(phone)} onClick={() => void track("CALL")}>
          <Phone className="h-4 w-4" />
          {t("CallNow")}
        </a>
      </Button>
      <Button asChild variant="outline" size="lg">
        <Link href={`/${locale}/contact`}>{t("Contact")}</Link>
      </Button>
    </div>
  );
}
