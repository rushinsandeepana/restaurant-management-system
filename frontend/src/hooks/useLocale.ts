import { useTranslation } from 'react-i18next'
import { supportedLanguages, type SupportedLanguage } from '@/i18n/config'

export function useLocale() {
  const { i18n, t } = useTranslation()

  const setLanguage = (code: SupportedLanguage) => {
    i18n.changeLanguage(code)
    localStorage.setItem('rms-locale', code)
    const isRtl = code === 'ar'
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr'
    document.documentElement.lang = code
  }

  return {
    language: i18n.language as SupportedLanguage,
    setLanguage,
    t,
    languages: supportedLanguages,
  }
}
