import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { tableApi, type TableStatus } from '@/api/tableApi'
import { FormSelect } from '@/components/ui/Input/Select'

// ─── Status options ──────────────────────────────────────────────────────────
const TABLE_STATUS_OPTIONS: { label: string; value: TableStatus }[] = [
  { label: 'Available',   value: 'AVAILABLE' },
  { label: 'Unavailable', value: 'UNAVAILABLE' },
]

interface TableFormData {
  tableNumber: number
  status: TableStatus
}

interface AddTableModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

// ─── Component ───────────────────────────────────────────────────────────────
export function AddTableModal({ isOpen, onClose, onSuccess }: AddTableModalProps) {
  const { t } = useTranslation()
  const [selectedTable, setSelectedTable] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TableFormData>({
    defaultValues: {
      tableNumber: 0,
      status: 'AVAILABLE',
    },
  })

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        reset()
        setSelectedTable(null)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isOpen, reset])

  const handleTableSelect = (num: number) => {
    setSelectedTable(num)
    setValue('tableNumber', num)
  }

  const close = () => onClose()

  const onSubmit = async (data: TableFormData) => {
    if (!data.tableNumber) return
    await tableApi.create({
      name:   `Table ${data.tableNumber}`,
      status: data.status,
    })
    onSuccess()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={close} title={t('table.addTable', 'Add Table')} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* ── Table number grid ───────────────────────────────────────────── */}
        <div className="flex flex-col items-center">
          <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Table Number
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 38px)',
              gap: '5px',
            }}
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => {
              const isSelected = selectedTable === num
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleTableSelect(num)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    border: isSelected
                      ? '2px solid var(--color-primary, #f97316)'
                      : '2px solid #e5e7eb',
                    backgroundColor: isSelected
                      ? 'var(--color-primary, #f97316)'
                      : 'transparent',
                    color: isSelected ? '#fff' : 'inherit',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#fff7ed'
                      ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#f97316'
                      ;(e.currentTarget as HTMLButtonElement).style.color = '#f97316'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                      ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e7eb'
                      ;(e.currentTarget as HTMLButtonElement).style.color = 'inherit'
                    }
                  }}
                >
                  {num}
                </button>
              )
            })}
          </div>
          {errors.tableNumber && (
            <p className="mt-1 text-xs text-red-500">Please select a table number.</p>
          )}
          {selectedTable && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Selected: <span className="font-semibold text-orange-500">Table {selectedTable}</span>
            </p>
          )}
        </div>

        {/* ── Status select ────────────────────────────────────────────────── */}
        <div className="flex flex-col w-1/2 mx-auto">
          <FormSelect
            label={t('modifier.fields.status', 'Status')}
            required
            options={TABLE_STATUS_OPTIONS}
            error={errors.status?.message}
            {...register('status')}
          />
        </div>

        {/* ── Actions ──────────────────────────────────────────────────────── */}
        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
          <Button type="button" variant="secondary" onClick={close}>
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={!selectedTable}
          >
            {t('common.save')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}