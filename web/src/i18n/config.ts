export type Locale = (typeof locales)[number]

export const locales = [
  'en',
  'de',
  'es',
  'fr',
  'id',
  'it',
  'ja',
  'nl',
  'ru',
  'th',
  'zh-CN',
  'zh-TW',
] as const

export const defaultLocale: Locale = 'en'

export function isValidLocale(s: string): s is Locale {
  return (locales as readonly string[]).includes(s)
}
