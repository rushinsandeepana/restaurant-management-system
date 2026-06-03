import { Card } from '@/components/ui/Card'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: string
}

export function StatCard({ label, value, icon: Icon, trend }: StatCardProps) {
  return (
    <Card className="!p-0">
      <div className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && <p className="mt-1 text-xs text-green-600">{trend}</p>}
        </div>
        {Icon && (
          <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900/30">
            <Icon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
        )}
      </div>
    </Card>
  )
}
