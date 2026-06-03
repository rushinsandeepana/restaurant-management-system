import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'

export const supportedLanguages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'si', label: 'සිංහල', flag: '🇱🇰' },
  { code: 'ta', label: 'தமிழ்', flag: '🇱🇰' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
] as const

export type SupportedLanguage = (typeof supportedLanguages)[number]['code']

const saved = localStorage.getItem('rms-locale') ?? 'en'

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: saved,
    fallbackLng: 'en',
    supportedLngs: supportedLanguages.map((l) => l.code),
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    interpolation: { escapeValue: false },
  })

const isRtl = saved === 'ar'
document.documentElement.dir = isRtl ? 'rtl' : 'ltr'
document.documentElement.lang = saved

export default i18n
