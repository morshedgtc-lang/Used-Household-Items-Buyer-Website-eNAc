export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    || `item-${Date.now()}`;
}

export function slugifyBilingual(ar: string, en: string): string {
  const fromEn = slugify(en);
  if (fromEn && fromEn !== `item-${Date.now().toString().slice(0, -3)}`) {
    return fromEn;
  }
  return slugify(ar) || `item-${Date.now()}`;
}
