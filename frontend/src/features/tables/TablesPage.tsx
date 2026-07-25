import { categoryApi } from '@/api/categoryApi'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Table, type TableColumn } from '@/components/ui/Table'
import type { Modifier } from '@/types/category'
import { Plus, Search } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AddTableModal } from './AddTablesModel'

const PAGE_SIZE = 10

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}

export function TablesPage() {
  const { t } = useTranslation()
  const [modifiers, setModifiers] = useState<Modifier[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const loadMeals = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await categoryApi.getPage({ search, page, size: PAGE_SIZE })
      setModifiers(data.content)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch {
      setError(t('table.loadError'))
    } finally {
      setLoading(false)
    }
  }, [search, page, t])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMeals()
    }, 0)
    return () => clearTimeout(timer)
  }, [loadMeals])

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(0)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  const handleMealAdded = () => {
    setPage(0)
    loadMeals()
  }

  const columns: TableColumn<Modifier>[] = [
    {
      header: t('table.columns.id'),
      key: 'id',
      cell: (table) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {table.id}
        </span>
      ),
    },
    {
      header: t('table.columns.name'),
      key: 'name',
      cell: (table) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {table.name}
        </span>
      ),
    },
    {
      header: t('table.columns.status'),
      key: 'status',
      cell: (table) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {table.status}
        </span>
      ),
    },
    {
      header: t('table.columns.createdAt'),
      key: 'createdAt',
      cell: (table) => (
        <span className="text-gray-600 dark:text-gray-400">
          {formatDate(table.createdAt)}
        </span>
      ),
    },
  ]

  return (
    <PageWrapper
      title={t('table.title')}
      description={t('table.subtitle')}
      actions={
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setModalOpen(true)}>
          {t('table.addTable')}
        </Button>
      }
    >
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t('table.searchPlaceholder')}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 ps-9 pe-3 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('table.totalItems', { count: totalElements })}
          </p>
        </div>

        <Table
          data={modifiers}
          columns={columns}
          rowKey={(table) => table.id}
          loading={loading}
          error={error}
          emptyMessage={t('table.noMeals')}
          pagination={{
            currentPage: page,
            totalPages,
            totalElements,
            onPageChange: setPage,
          }}
        />
      </Card>

      <AddTableModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleMealAdded}
      />
    </PageWrapper>
  )
}

