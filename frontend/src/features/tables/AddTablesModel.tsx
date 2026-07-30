import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { tableApi, type TableStatus, type Table } from '@/api/tableApi'
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
  // List of all existing tables — used to determine occupied numbers
  useTables: Table[]
  // If provided, the modal will open in edit mode for this table
  initialTable?: Table | null
}

// ─── Component ───────────────────────────────────────────────────────────────
export function AddTableModal({ isOpen, onClose, onSuccess, useTables, initialTable }: AddTableModalProps) {
  const { t } = useTranslation()
  const [selectedTable, setSelectedTable] = useState<number | null>(null)

  const tables = useTables ?? []
  const initialNumber = initialTable?.number ?? null

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

  // Initialize form when opening for edit
  useEffect(() => {
    if (isOpen && initialTable) {
      const timer = setTimeout(() => {
        const num = initialNumber || 0
        setSelectedTable(num)
        setValue('tableNumber', num)
        setValue('status', initialTable.status)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isOpen, initialNumber, initialTable, setValue])

  const handleTableSelect = (num: number) => {
    setSelectedTable(num)
    setValue('tableNumber', num)
  }

  const close = () => onClose()

  const onSubmit = async (data: TableFormData) => {
    if (!data.tableNumber) return
    if (initialTable) {
      await tableApi.update(initialTable.id, {
        name: `Table ${data.tableNumber}`,
        number: data.tableNumber,
        status: data.status,
      })
    } else {
      await tableApi.create({
        name:   `Table ${data.tableNumber}`,
        number: data.tableNumber,
        status: data.status,
      })
    }
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
              const isOccupied = tables.some(table => table.number === num);
              const disabled = isOccupied && initialNumber !== num;


              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => !disabled && handleTableSelect(num)}
                  disabled={disabled}
                  aria-pressed={isSelected}
                  className={`inline-flex items-center justify-center w-9 h-9 rounded-lg font-semibold text-sm transition-all ${isSelected ? 'border-2 border-orange-500 bg-orange-500 text-black' : 'border-2 border-gray-200 bg-transparent text-inherit'} ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-amber-50 hover:border-amber-400 cursor-pointer'}`}
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