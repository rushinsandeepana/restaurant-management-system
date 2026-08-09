import { mealsApi } from '@/api/mealsApi'
import { categoryApi } from '@/api/categoryApi'
import { modifierApi } from '@/api/modifierApi'
import { Button } from '@/components/ui/Button'
import { FormInput } from '@/components/ui/Input'
import { ImageUpload } from '@/components/ui/Input/ImageUpload'
import { FormSelect } from '@/components/ui/Input/Select'
import { Modal } from '@/components/ui/Modal'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { Status, STATUS_OPTIONS } from '@/types/enums'
import type { Category, Modifier } from '@/types/category'
import { cn } from '@/utils/cn'
import type { Meal } from '@/types/meal'

// ─── Enums ────────────────────────────────────────────────────────────────────

// eslint-disable-next-line react-refresh/only-export-components
export const VariationSize = {
  REGULAR:  'REGULAR',
  STANDARD: 'STANDARD',
  LARGE:    'LARGE',
} as const

export type VariationSize = typeof VariationSize[keyof typeof VariationSize]

const VARIATION_SIZE_OPTIONS = [
  { label: 'Regular',  value: VariationSize.REGULAR  },
  { label: 'Standard', value: VariationSize.STANDARD },
  { label: 'Large',    value: VariationSize.LARGE    },
]

const VARIATION_SIZE_VALUES = [
  VariationSize.REGULAR,
  VariationSize.STANDARD,
  VariationSize.LARGE,
] as const

const STATUS_VALUES = [
  Status.ACTIVE,
  Status.INACTIVE,
  Status.DRAFT,
] as const

// ─── Schema ───────────────────────────────────────────────────────────────────

const createSchema = (t: (key: string, options?: Record<string, unknown>) => string) =>
  z.object({
    name:        z.string().min(1, { message: t('meal.errors.nameRequired') }),
    categoryId:  z.string().min(1, { message: t('meal.errors.categoryRequired') }),
    description: z.string(),
    status:      z.enum(STATUS_VALUES),
    imageUrl:    z.string().min(1, { message: t('meal.errors.imageRequired') }),
    variations:  z
      .array(
        z.object({
          name:   z.enum(VARIATION_SIZE_VALUES, {
            message: t('meal.errors.variationNameRequired'),
          }),
          price:  z
            .number({ message: t('meal.errors.priceRequired') })
            .min(0, { message: t('meal.errors.priceMin') }),
          status: z.enum(STATUS_VALUES),
        })
      )
      .min(1, { message: t('meal.errors.atLeastOneVariation') }),
    modifierIds: z.array(z.number()),
  })

type MealFormData = z.infer<ReturnType<typeof createSchema>>

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddMealModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialMeal?: Meal | null
  useMeal?: Meal[]
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddMealModal({ isOpen, onClose, onSuccess, initialMeal }: AddMealModalProps) {
  const { t } = useTranslation()

  const [categories,  setCategories]  = useState<Category[]>([])
  const [modifiers,   setModifiers]   = useState<Modifier[]>([])
  const [loadingMeta, setLoadingMeta] = useState(false)
  const [, setImageFile] = useState<File | null>(null)

  const schema = createSchema(t)

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<MealFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:        '',
      categoryId:  '',
      description: '',
      status:      Status.ACTIVE,
      imageUrl:    '',
      variations:  [],
      modifierIds: [],
    },
  })

  const {
    fields: variationFields,
    append: appendVariation,
    remove: removeVariation,
  } = useFieldArray({ control, name: 'variations' })

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedModifierIds = watch('modifierIds')

  // Load categories & modifiers once on open
  useEffect(() => {
    if (!isOpen) return

    setLoadingMeta(true)

    Promise.all([
      categoryApi.getPage({ size: 100 }),
      modifierApi.getPage({ size: 100 }),
    ])
      .then(([catData, modData]) => {
        const activeCategories = catData.content.filter(
          (category) => category.status === 'ACTIVE'
        )
        const activeModifiers = modData.content.filter(
          (modifier) => modifier.status === 'ACTIVE'
        )
        
        setCategories(activeCategories)
        setModifiers(activeModifiers)
      })
      .catch((error) => {
        console.error('MEAL META ERROR:', error)
      })
      .finally(() => {
        setLoadingMeta(false)
      })
  }, [isOpen])

  // Reset form on close
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => reset(), 0)
      return () => clearTimeout(timer)
    }
  }, [isOpen, reset])

  useEffect(() => {
    if (!isOpen) return

    if (initialMeal) {
      const timer = setTimeout(() => {
        setValue('name', initialMeal.name)
        setValue('categoryId', String(initialMeal.categoryId))
        setValue('description', initialMeal.description)
        setValue('status', initialMeal.status as MealFormData['status'])
        setValue('imageUrl', initialMeal.imageUrl ?? '')
        setValue(
          'variations',
          initialMeal.variations.map((variation) => ({
            name: variation.name as VariationSize,
            price: variation.price,
            status: Status.ACTIVE,
          }))
        )
        setValue('modifierIds', initialMeal.modifierIds)
      }, 0)

      return () => clearTimeout(timer)
    }
  }, [isOpen, initialMeal, setValue])

  const close = () => onClose()

  const onSubmit = async (data: MealFormData) => {
    if (initialMeal) {
      await mealsApi.update(initialMeal.id, {
        name:        data.name,
        imageUrl:    data.imageUrl,
        categoryId:  Number(data.categoryId),
        status:      data.status,
        description: data.description,
        variations:  data.variations,
        modifierIds: data.modifierIds,
      })
    } else {
      await mealsApi.create({
        name:        data.name,
        imageUrl:    data.imageUrl,
        categoryId:  Number(data.categoryId),
        status:      data.status,
        description: data.description,
        variations:  data.variations,
        modifierIds: data.modifierIds,
      })
    }
    onSuccess()
    onClose()
  }

  // Toggle modifier selection
  const toggleModifier = (id: number) => {
    const current = watchedModifierIds ?? []
    if (current.includes(id)) {
      setValue('modifierIds', current.filter((m) => m !== id))
    } else {
      setValue('modifierIds', [...current, id])
    }
  }

  const categoryOptions = [
    { label: 'Select a category…', value: '' },
    ...categories.map((c) => ({ label: c.name, value: String(c.id) })),
  ]

  return (
    <Modal isOpen={isOpen} onClose={close} title={t('meal.addMeal')} size="xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ── Two-column layout ─────────────────────────────────────────────── */}
        <div className="flex gap-6">

          {/* ── LEFT: Main Fields ─────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Name + Category */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                label={t('meal.fields.name')}
                required
                placeholder={t('meal.placeholders.name', 'Enter meal name')}
                error={errors.name?.message}
                {...register('name')}
              />
              <FormSelect
                label={t('meal.fields.category')}
                required
                options={categoryOptions}
                error={errors.categoryId?.message}
                disabled={loadingMeta}
                {...register('categoryId')}
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('meal.fields.description', 'Description')}
                <span className="ml-1 text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder={t('meal.placeholders.description', 'Enter meal description…')}
                className={cn(
                  'w-full rounded-lg border px-3 py-2 text-sm transition-colors resize-none',
                  'border-gray-300 bg-white text-gray-900 placeholder-gray-400',
                  'dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500',
                  'focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500',
                  'dark:focus:border-orange-400 dark:focus:ring-orange-400/40'
                )}
                {...register('description')}
              />
            </div>

            {/* Status */}
            <FormSelect
              label={t('meal.fields.status', 'Status')}
              required
              options={STATUS_OPTIONS}
              error={errors.status?.message}
              {...register('status')}
            />

            {/* ── Variations ──────────────────────────────────────────────── */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('meal.fields.variations', 'Variations')}
                </span>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  icon={<Plus className="h-3.5 w-3.5" />}
                  onClick={() => appendVariation({ name: VariationSize.STANDARD, price: 0, status: Status.ACTIVE })}
                >
                  {t('meal.addVariation', 'Add variation')}
                </Button>
              </div>

              {/* Column headers */}
              {variationFields.length > 0 && (
                <div className="grid grid-cols-[1fr_120px_130px_auto] gap-0 px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Name</span>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Price <span className="text-red-400">*</span>
                  </span>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Status</span>
                  <span />
                </div>
              )}

              {/* Empty state */}
              {variationFields.length === 0 && (
                <p className="px-4 py-6 text-sm text-center text-gray-400 dark:text-gray-500">
                  {t('meal.noVariations', 'No variations yet. Click "Add variation" to begin.')}
                </p>
              )}

              {/* Variation rows */}
              <div className="divide-y divide-gray-100 dark:divide-gray-800  max-h-32 overflow-y-auto">
                {variationFields.map((field, index) => (
                  <div key={field.id} className="px-4 py-3 bg-white dark:bg-gray-900">
                    <div className="grid grid-cols-[1fr_120px_130px_auto] gap-2 items-start">
                      {/* Name dropdown */}
                      <FormSelect
                        options={VARIATION_SIZE_OPTIONS}
                        error={errors.variations?.[index]?.name?.message}
                        {...register(`variations.${index}.name`)}
                      />

                      {/* Price */}
                      <FormInput
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder={t('meal.placeholders.price', '0.00')}
                        error={errors.variations?.[index]?.price?.message}
                        {...register(`variations.${index}.price`, { valueAsNumber: true })}
                      />

                      {/* Status */}
                      <FormSelect
                        options={STATUS_OPTIONS}
                        error={errors.variations?.[index]?.status?.message}
                        {...register(`variations.${index}.status`)}
                      />

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeVariation(index)}
                        className="mt-1 text-xs font-medium text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 whitespace-nowrap transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {errors.variations?.message && (
                <p className="px-4 pb-3 text-sm text-red-600">{errors.variations.message}</p>
              )}
            </div>
          </div>

          {/* ── RIGHT: Sidebar ────────────────────────────────────────────── */}
          <div className="w-64 shrink-0 space-y-4">

            {/* Image */}
            <ImageUpload
              label={t('meal.fields.image', 'Image')}
              error={errors.imageUrl?.message}
              value={watch('imageUrl')}
              previewAlt="Meal preview"
              onChange={(url) => {
                setValue('imageUrl', url)
                trigger('imageUrl')
              }}
              onFileChange={(file) => {
                setImageFile(file)
              }}
              onRemove={() => {
                setImageFile(null)
                setValue('imageUrl', '')
                trigger('imageUrl')
              }}
            />

            {/* Modifiers */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('meal.fields.modifiers', 'Modifiers')}
                </span>
              </div>

              {loadingMeta && (
                <p className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">Loading…</p>
              )}

              {!loadingMeta && modifiers.length === 0 && (
                <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {t('meal.noModifiers', 'No modifiers available.')}
                </p>
              )}

              {!loadingMeta && modifiers.length > 0 && (
                <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-48 overflow-y-auto">
                  {modifiers.map((modifier) => {
                    const isChecked = (watchedModifierIds ?? []).includes(modifier.id)
                    return (
                      <label
                        key={modifier.id}
                        className={cn(
                          'flex items-center gap-3 px-4 py-2.5 cursor-pointer select-none transition-colors',
                          'hover:bg-gray-50 dark:hover:bg-gray-800/60',
                          isChecked && 'bg-orange-50 dark:bg-orange-900/20'
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleModifier(modifier.id)}
                          className="h-4 w-4 rounded border-gray-300 accent-orange-500 focus:ring-orange-500/40 dark:border-gray-600"
                        />
                        <span className="flex-1 text-sm text-gray-800 dark:text-gray-200">
                          {modifier.name}
                        </span>
                      </label>
                    )
                  })}
                </div>
              )}

              {(watchedModifierIds ?? []).length > 0 && (
                <div className="px-4 py-2 bg-orange-50 dark:bg-orange-900/10 border-t border-orange-100 dark:border-orange-900/30">
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                    {(watchedModifierIds ?? []).length} selected
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Actions ─────────────────────────────────────────────────────────── */}
        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 mt-5 dark:border-gray-800">
          <Button type="button" variant="secondary" onClick={close}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {t('common.save')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}