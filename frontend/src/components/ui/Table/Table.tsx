import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/utils/cn'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export interface TableColumn<T> {
  header: ReactNode
  key: string
  cell?: (row: T) => ReactNode
  className?: string
  headerClassName?: string
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalElements: number
  onPageChange: (page: number) => void
}

interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  rowKey: (row: T) => string | number
  loading?: boolean
  error?: string | null
  emptyMessage?: string
  pagination?: PaginationProps
  className?: string
}

export function Table<T>({
  data,
  columns,
  rowKey,
  loading,
  error,
  emptyMessage,
  pagination,
  className,
}: TableProps<T>) {
  const { t } = useTranslation()

  const showPlaceholder = loading || !!error || data.length === 0

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:text-gray-400">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn('px-3 py-3 font-medium', col.headerClassName)}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {showPlaceholder ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8 text-center">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Spinner />
                    </div>
                  ) : error ? (
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {emptyMessage || t('common.noData', { defaultValue: 'No data found' })}
                    </p>
                  )}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn('px-3 py-3 text-gray-600 dark:text-gray-300', col.className)}
                    >
                      {col.cell ? col.cell(row) : (row[col.key as keyof T] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && !loading && (
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {t('meal.pageInfo', {
              current: pagination.currentPage + 1,
              total: pagination.totalPages,
              defaultValue: `Page ${pagination.currentPage + 1} of ${pagination.totalPages}`,
            })}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.currentPage === 0}
              icon={<ChevronLeft className="h-4 w-4" />}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            >
              {t('meal.previous', { defaultValue: 'Previous' })}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.currentPage >= pagination.totalPages - 1}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            >
              {t('meal.next', { defaultValue: 'Next' })}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
