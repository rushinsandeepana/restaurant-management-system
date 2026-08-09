import { mealsApi } from '@/api/mealsApi'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Table, type TableColumn } from '@/components/ui/Table'
import { AddMealModal } from '@/features/meal/AddMealModal'
import type { Meal } from '@/types/meal'
import { Plus, Search, UtensilsCrossed } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const PAGE_SIZE = 10

function formatPrice(value: number) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'LKR' }).format(value)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}

export function MealPage() {
  const { t } = useTranslation()
  const [meals, setMeals] = useState<Meal[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [expandedRowId, setExpandedRowId] = useState<string | number | null>(null)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)

  const loadMeals = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await mealsApi.getPage({ search, page, size: PAGE_SIZE })
      setMeals(data.content)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch {
      setError(t('meal.loadError'))
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

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal)
    setModalOpen(true)
  }

  const handleDelete = async (meal: Meal) => {
    const doDelete = async () => {
      if (!confirm(t('meal.confirmDelete', { defaultValue: 'Are you sure you want to delete this modifier?' }))) return
      try {
        setLoading(true)
        await mealsApi.delete(meal.id)
        if (expandedRowId === meal.id) setExpandedRowId(null)
        await loadMeals()
      } catch (e) {
        console.error('Failed to delete meal', e)
      } finally {
        setLoading(false)
      }
    }

    void doDelete()
  }

  const columns: TableColumn<Meal>[] = [
    {
      header: t('meal.columns.image'),
      key: 'imageUrl',
      cell: (meal) =>
        meal.imageUrl ? (
          <img
            src={meal.imageUrl}
            alt={meal.name}
            className="h-12 w-12 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
            <UtensilsCrossed className="h-5 w-5 text-gray-400" />
          </div>
        ),
    },
    {
      header: t('meal.columns.name'),
      key: 'name',
      cell: (meal) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {meal.name}
        </span>
      ),
    },
    {
      header: t('meal.columns.variations'),
      key: 'variations',
      cell: (meal) => (
        <div className="flex flex-col gap-1 text-gray-600 dark:text-gray-400">
          {meal.variations.length > 0 ? (
            meal.variations.map((variation) => (
              <span key={variation.id}>{variation.name}</span>
            ))
          ) : (
            <span>—</span>
          )}
        </div>
      ),
    },
    {
      header: t('meal.columns.basePrice'),
      key: 'basePrice',
      cell: (meal) => (
        <div className="flex flex-col gap-1">
          {meal.variations.length > 0 ? (
            meal.variations.map((variation) => (
              <span key={variation.id}>{formatPrice(variation.price)}</span>
            ))
          ) : (
            <span>{formatPrice(meal.basePrice)}</span>
          )}
        </div>
      ),
    },
    {
      header: t('meal.columns.status'),
      key: 'status',
      cell: (meal) => (
        <span className="text-gray-600 dark:text-gray-400">
          {meal.status}
        </span>
      ),
    },
    {
      header: t('meal.columns.createdAt'),
      key: 'createdAt',
      cell: (meal) => (
        <span className="text-gray-600 dark:text-gray-400">
          {formatDate(meal.createdAt)}
        </span>
      ),
    },
    {
      header: t('meal.columns.updatedAt'),
      key: 'updatedAt',
      cell: (meal) => (
        <span className="text-gray-600 dark:text-gray-400">
          {formatDate(meal.updatedAt)}
        </span>
      ),
    },
  ]

  return (
    <PageWrapper
      title={t('meal.title')}
      description={t('meal.subtitle')}
      actions={
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setModalOpen(true)}>
          {t('meal.addMeal')}
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
              placeholder={t('meal.searchPlaceholder')}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 ps-9 pe-3 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('meal.totalItems', { count: totalElements })}
          </p>
        </div>

        <Table
          data={meals}
          columns={columns}
          rowKey={(meal) => meal.id}
          loading={loading}
          error={error}
          emptyMessage={t('meal.noMeals')}
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

      <AddMealModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingMeal(null) }}
        onSuccess={() => { handleMealAdded(); setEditingMeal(null) }}
        initialMeal={editingMeal}
        useMeal={meals}
      />
    </PageWrapper>
  )
}

