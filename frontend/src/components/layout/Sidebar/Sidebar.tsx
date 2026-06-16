import { useLocale } from '@/hooks/useLocale'
import { cn } from '@/utils/cn'
import {
  BarChart3,
  Calendar,
  ChefHat,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  Warehouse,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', icon: LayoutDashboard, key: 'dashboard' },
  { to: '/menu', icon: UtensilsCrossed, key: 'menu' },
  { to: '/orders', icon: ClipboardList, key: 'orders' },
  { to: '/categories', icon: ClipboardList, key: 'categories' },
  { to: '/meals', icon: Warehouse, key: 'meals' },
  { to: '/tables', icon: UtensilsCrossed, key: 'tables' },
  { to: '/kitchen', icon: ChefHat, key: 'kitchen' },
  { to: '/staff', icon: Users, key: 'staff' },
  { to: '/reservations', icon: Calendar, key: 'reservations' },
  { to: '/billing', icon: CreditCard, key: 'billing' },
  { to: '/reports', icon: BarChart3, key: 'reports' },
] as const

export function Sidebar() {
  const { t } = useLocale()

  return (
    <aside className="flex w-60 shrink-0 flex-col border-e border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <h1 className="text-lg font-bold text-orange-600">{t('app.name')}</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">{t('app.tagline')}</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ to, icon: Icon, key }) => (
          <NavLink
            key={key}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {t(`nav.${key}`)}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
