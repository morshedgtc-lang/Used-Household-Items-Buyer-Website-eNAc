"use client";

import { Phone } from "lucide-react";
import { useLocale } from "next-intl";
import { buildTelUrl, buildWhatsAppUrl } from "@/utils/whatsapp";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import type { Locale } from "@/config/site";

type FloatingContactProps = {
  phone: string;
  whatsapp: string;
  itemName?: string;
};

export function FloatingContact({ phone, whatsapp, itemName }: FloatingContactProps) {
  const locale = useLocale() as Locale;
  const label = itemName || (locale === "ar" ? "أغراض مستعملة" : "used items");

  return (
    <div className="fixed bottom-5 z-50 flex flex-col gap-3 end-5">
      <a
        href={buildWhatsAppUrl(whatsapp, label, locale)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition hover:scale-110"
        onClick={() => {
          void fetch("/api/analytics/click", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "WHATSAPP", path: window.location.pathname }),
          });
        }}
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
      <a
        href={buildTelUrl(phone)}
        aria-label="Call"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition hover:scale-110"
        onClick={() => {
          void fetch("/api/analytics/click", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "CALL", path: window.location.pathname }),
          });
        }}
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}
