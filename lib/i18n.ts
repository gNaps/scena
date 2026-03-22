export const locales = ["it", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "it";

export function getLocalizedValue(
  items: { code: string; value: string }[],
  locale: string
): string {
  return (
    items.find((i) => i.code === locale)?.value ??
    items.find((i) => i.code === defaultLocale)?.value ??
    items[0]?.value ??
    ""
  );
}

export function getLocalizedName(
  items: { code: string; name: string }[],
  locale: string
): string {
  return (
    items.find((i) => i.code === locale)?.name ??
    items.find((i) => i.code === defaultLocale)?.name ??
    items[0]?.name ??
    ""
  );
}
