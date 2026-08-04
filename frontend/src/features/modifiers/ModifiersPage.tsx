import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Table, type TableColumn } from '@/components/ui/Table'
import type { Modifier } from '@/types/category'
import { Plus, Search } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AddModifierModal } from './AddModifiersModel'
import { modifierApi } from '@/api/modifierApi'

const PAGE_SIZE = 10

// function formatPrice(value: number) {
//   return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value)
// }

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}

export function ModifierPage() {
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
  const [expandedRowId, setExpandedRowId] = useState<string | number | null>(null)
  const [editingModifier, setEditingModifier] = useState<Modifier | null>(null)

  const loadMeals = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await modifierApi.getPage({ search, page, size: PAGE_SIZE })
      setModifiers(data.content)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch {
      setError(t('modifier.loadError'))
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

  const handleModifierAdded = () => {
    setPage(0)
    void loadMeals()
  }

  const handleEdit = (modifier: Modifier) => {
    setEditingModifier(modifier)
    setModalOpen(true)
  }

  const handleDelete = (modifier: Modifier) => {
    const doDelete = async () => {
      if (!confirm(t('modifier.confirmDelete', { defaultValue: 'Are you sure you want to delete this modifier?' }))) return
      try {
        setLoading(true)
        await modifierApi.delete(modifier.id)
        if (expandedRowId === modifier.id) setExpandedRowId(null)
        await loadMeals()
      } catch (e) {
        console.error('Failed to delete modifier', e)
      } finally {
        setLoading(false)
      }
    }

    void doDelete()
  }

  const columns: TableColumn<Modifier>[] = [
    {
      header: t('modifier.columns.id'),
      key: 'id',
      cell: (modifier) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {modifier.id}
        </span>
      ),
    },
    {
      header: t('modifier.columns.name'),
      key: 'name',
      cell: (modifier) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {modifier.name}
        </span>
      ),
    },
    {
      header: t('modifier.columns.basePrice'),
      key: 'base_price',
      cell: (modifier) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {modifier.base_price}
        </span>
      ),
    },
    {
      header: t('modifier.columns.status'),
      key: 'status',
      cell: (modifier) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {modifier.status}
        </span>
      ),
    },
    {
      header: t('modifier.columns.createdAt'),
      key: 'createdAt',
      cell: (modifier) => (
        <span className="text-gray-600 dark:text-gray-400">
          {formatDate(modifier.createdAt)}
        </span>
      ),
    },
  ]

  return (
    <PageWrapper
      title={t('modifier.title')}
      description={t('modifier.subtitle')}
      actions={
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setModalOpen(true)}>
          {t('modifier.addModifier')}
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
              placeholder={t('modifier.searchPlaceholder')}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 ps-9 pe-3 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('modifier.totalItems', { count: totalElements })}
          </p>
        </div>

        <Table
          data={modifiers}
          columns={columns}
          rowKey={(modifier) => modifier.id}
          loading={loading}
          error={error}
          emptyMessage={t('modifier.noMeals')}
          pagination={{
            currentPage: page,
            totalPages,
            totalElements,
            onPageChange: setPage,
          }}
          expandedRowId={expandedRowId}
          onExpandedRowIdChange={setExpandedRowId}
          expandedRow={(table) => (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleEdit(table)}
              >
                {t('table.edit')}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(table)}
              >
                {t('table.delete')}
              </Button>
            </div>
          )}
        />
      </Card>

      <AddModifierModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingModifier(null) }}
        onSuccess={() => { handleModifierAdded(); setEditingModifier(null) }}
        initialModifier={editingModifier}
        useModifiers={modifiers}
      />
    </PageWrapper>
  )
}

