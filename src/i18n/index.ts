import { createI18n } from 'vue-i18n'
import en, { type MessageSchema } from './en'
import es from './es'

export const LOCALES = ['en', 'es'] as const
export type AppLocale = (typeof LOCALES)[number]

// Locale used for Intl number/date formatting (EUR in both)
export const INTL_LOCALE: Record<AppLocale, string> = { en: 'en-IE', es: 'es-ES' }

const STORAGE_KEY = 'locale'

function isLocale(value: unknown): value is AppLocale {
  return LOCALES.includes(value as AppLocale)
}

function initialLocale(): AppLocale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isLocale(saved)) return saved
  } catch {
    // storage unavailable: fall through to browser language
  }
  const browser = navigator.language.slice(0, 2)
  return isLocale(browser) ? browser : 'en'
}

const i18n = createI18n<[MessageSchema], AppLocale, false>({
  legacy: false,
  locale: initialLocale(),
  fallbackLocale: 'en',
  messages: { en, es },
})

document.documentElement.lang = i18n.global.locale.value

export function setLocale(locale: AppLocale): void {
  i18n.global.locale.value = locale
  document.documentElement.lang = locale
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // ignore: preference just won't persist
  }
}

export default i18n

// Type-safe message keys for t()
declare module 'vue-i18n' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefineLocaleMessage extends MessageSchema {}
}
