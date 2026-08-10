import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'
import { useTheme } from '@/hooks/useTheme'
import { authApi } from '@/api/authApi'
import { useAuthStore } from '@/store/authStore'
import { Globe, LogOut, Moon, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function Topbar() {
  const { t, language, setLanguage, languages } = useLocale()
  const { toggleTheme, isDark } = useTheme()
  const { user } = useAuth()
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const refreshToken = useAuthStore((s) => s.refreshToken)
  const navigate = useNavigate()

  const handleLogout = async () => {
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken)
      } catch {
        /* ignore */
      }
    }
    clearAuth()
    const loginPath = user?.role === 'CHEF' ? '/login/kitchen' : '/login/cashier'
    navigate(loginPath)
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {user && (
          <span>
            {user.fullName} · <span className="font-medium text-orange-600">{user.role}</span>
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant='primary' size="sm" onClick={() => navigate('/orders/create')} >
          <span className=''>+</span>POS
        </Button>
        <div className="relative">
          <Globe className="pointer-events-none absolute start-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as typeof language)}
            className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-1.5 ps-8 pe-8 text-sm dark:border-gray-700 dark:bg-gray-800"
            aria-label="Language"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          aria-label={isDark ? t('theme.light') : t('theme.dark')}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleLogout} icon={<LogOut className="h-4 w-4" />}>
          {t('auth.logout')}
        </Button>
      </div>
    </header>
  )
}
