import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { useTranslation } from 'react-i18next'

interface PlaceholderPageProps {
  titleKey: string
}

export function PlaceholderPage({ titleKey }: PlaceholderPageProps) {
  const { t } = useTranslation()
  return (
    <PageWrapper title={t(titleKey)}>
      <Card>
        <p className="text-gray-500 dark:text-gray-400">{t('common.comingSoon')}</p>
      </Card>
    </PageWrapper>
  )
}
