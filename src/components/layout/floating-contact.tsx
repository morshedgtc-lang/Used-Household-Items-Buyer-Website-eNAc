"use client";

import { Phone } from "lucide-react";
import { useLocale } from "next-intl";
import { buildTelUrl, buildWhatsAppUrl } from "@/utils/whatsapp";
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
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
        onClick={() => {
          void fetch("/api/analytics/click", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "WHATSAPP", path: window.location.pathname }),
          });
        }}
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden>
          <path d="M20.5 3.5A11 11 0 0 0 3.1 17.4L2 22l4.7-1.1A11 11 0 1 0 20.5 3.5zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-2.8.7.7-2.7-.2-.3A9 9 0 1 1 12 20.5zm5-6.7c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.3 7.3 0 0 1-2.2-1.4 8 8 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.1-.3c0-.1 0-.3-.1-.4s-.6-1.4-.8-1.9-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3a2 2 0 0 0-.6 1.5 3.5 3.5 0 0 0 .7 1.9 8 8 0 0 0 3 3.1 10 10 0 0 0 2 .8 2.4 2.4 0 0 0 1.7-.6 2 2 0 0 0 .5-1.3c0-.2 0-.3-.1-.4z" />
        </svg>
      </a>
      <a
        href={buildTelUrl(phone)}
        aria-label="Call"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition hover:scale-105"
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
