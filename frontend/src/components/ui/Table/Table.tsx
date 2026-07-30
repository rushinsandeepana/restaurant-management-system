import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/utils/cn'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Fragment, useState, type ReactNode } from 'react'
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
  expandedRow?: (row: T) => ReactNode
  expandedRowId?: string | number | null
  onExpandedRowIdChange?: (rowKey: string | number | null) => void
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
  expandedRow,
  expandedRowId,
  onExpandedRowIdChange,
}: TableProps<T>) {
  const { t } = useTranslation()
  const [internalExpandedRowId, setInternalExpandedRowId] = useState<string | number | null>(null)
  const controlled = expandedRowId !== undefined
  const actualExpandedRowId = controlled ? expandedRowId : internalExpandedRowId
  const hasExpandableRows = Boolean(expandedRow)
  const columnsCount = columns.length + (hasExpandableRows ? 1 : 0)

  const toggleExpandedRow = (rowKeyValue: string | number) => {
    const nextRowKey = actualExpandedRowId === rowKeyValue ? null : rowKeyValue
    if (!controlled) {
      setInternalExpandedRowId(nextRowKey)
    }
    if (onExpandedRowIdChange) {
      onExpandedRowIdChange(nextRowKey)
    }
  }

  const showPlaceholder = loading || !!error || data.length === 0

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:text-gray-400">
              {hasExpandableRows && (
                <th className="w-12 px-3 py-3" />
              )}
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
                <td colSpan={columnsCount} className="px-3 py-8 text-center">
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
              data.map((row) => {
                const rowId = rowKey(row)
                const isExpanded = actualExpandedRowId === rowId

                return (
                  <Fragment key={rowId}>
                    <tr
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      {hasExpandableRows && (
                        <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                            onClick={() => toggleExpandedRow(rowId)}
                            aria-label={isExpanded ? t('common.collapseRow', { defaultValue: 'Collapse row' }) : t('common.expandRow', { defaultValue: 'Expand row' })}
                          >
                            <ChevronDown className={cn('h-4 w-4 transition-transform', isExpanded ? 'rotate-180' : 'rotate-0')} />
                          </button>
                        </td>
                      )}

                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={cn('px-3 py-3 text-gray-600 dark:text-gray-300', col.className)}
                        >
                          {col.cell ? col.cell(row) : (row[col.key as keyof T] as ReactNode)}
                        </td>
                      ))}
                    </tr>

                    {isExpanded && expandedRow ? (
                      <tr className="bg-gray-50 dark:bg-gray-950">
                        <td colSpan={columnsCount} className="px-3 py-3">
                          {expandedRow(row)}
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                )
              })
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
