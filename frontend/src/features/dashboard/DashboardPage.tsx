import { PageWrapper } from '@/components/layout/PageWrapper'
import { StatCard } from '@/components/ui/StatCard'
import { useTranslation } from 'react-i18next'
import { ClipboardList, DollarSign, Package, UtensilsCrossed } from 'lucide-react'

export function DashboardPage() {
  const { t } = useTranslation()

  return (
    <PageWrapper title={t('dashboard.title')}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t('dashboard.revenue')} value="—" icon={DollarSign} />
        <StatCard label={t('dashboard.orders')} value="0" icon={ClipboardList} />
        <StatCard label={t('dashboard.tables')} value="0" icon={UtensilsCrossed} />
        <StatCard label={t('dashboard.lowStock')} value="0" icon={Package} />
      </div>
      <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        {t('common.comingSoon')} — connect menu, orders, and reports modules next.
      </p>
    </PageWrapper>
  )
}
