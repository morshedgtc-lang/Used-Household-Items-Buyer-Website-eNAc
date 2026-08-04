export type Locale = "ar" | "en";

export const locales: Locale[] = ["ar", "en"];
export const defaultLocale: Locale = "ar";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocalized<T extends Record<string, unknown>>(
  record: T,
  locale: Locale,
  arKey: keyof T,
  enKey: keyof T,
): string {
  const value = locale === "ar" ? record[arKey] : record[enKey];
  return typeof value === "string" ? value : "";
}
