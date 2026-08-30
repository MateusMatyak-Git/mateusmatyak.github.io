import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import pt from './locales/pt.json'
import ptPT from './locales/pt-PT.json'
import es from './locales/es.json'
import de from './locales/de.json'
import ja from './locales/ja.json'

export const LOCALES = [
  { code: 'en', nativeLabel: 'English', htmlLang: 'en' },
  { code: 'pt', nativeLabel: 'Português (Brasil)', htmlLang: 'pt-BR' },
  { code: 'pt-PT', nativeLabel: 'Português (Portugal)', htmlLang: 'pt-PT' },
  { code: 'es', nativeLabel: 'Español', htmlLang: 'es' },
  { code: 'de', nativeLabel: 'Deutsch', htmlLang: 'de' },
  { code: 'ja', nativeLabel: '日本語', htmlLang: 'ja' },
] as const

export type Locale = (typeof LOCALES)[number]['code']
export const SUPPORTED_LOCALES = LOCALES.map((locale) => locale.code)
const STORAGE_KEY = 'locale'

function isLocale(value: string | null): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale)
}

function htmlLangFor(locale: Locale) {
  return LOCALES.find((item) => item.code === locale)?.htmlLang ?? locale
}

function applyDocumentLang(locale: Locale) {
  document.documentElement.setAttribute('lang', htmlLangFor(locale))
}

function detectLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (isLocale(stored)) return stored

  const raw = navigator.language || 'en'
  const lower = raw.toLowerCase()

  if (isLocale(raw)) return raw
  if (lower.startsWith('pt-pt')) return 'pt-PT'
  if (lower.startsWith('pt')) return 'pt'
  if (lower.startsWith('ja')) return 'ja'
  if (lower.startsWith('es')) return 'es'
  if (lower.startsWith('de')) return 'de'
  if (lower.startsWith('en')) return 'en'

  return 'en'
}

const initialLocale = detectLocale()

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages: { en, pt, es, de, ja, 'pt-PT': ptPT },
})

applyDocumentLang(initialLocale)

export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale
  localStorage.setItem(STORAGE_KEY, locale)
  applyDocumentLang(locale)
}

export function localeMeta(code: Locale) {
  return LOCALES.find((item) => item.code === code) ?? LOCALES[0]
}
