export function buildWhatsAppUrl(
  whatsappNumber: string,
  itemName: string,
  locale: "ar" | "en" = "ar",
): string {
  const digits = whatsappNumber.replace(/\D/g, "");
  const message =
    locale === "ar"
      ? `مرحبا، أريد بيع ${itemName} المستعمل`
      : `Hello, I want to sell my used ${itemName}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildTelUrl(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, "");
  const withPlus = cleaned.startsWith("+") ? cleaned : `+${cleaned.replace(/^00/, "")}`;
  return `tel:${withPlus}`;
}

export function formatPhoneDisplay(phone: string): string {
  return phone.trim();
}
