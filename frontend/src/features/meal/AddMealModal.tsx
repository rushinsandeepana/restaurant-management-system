import { mealsApi } from '@/api/mealsApi'
import { Button } from '@/components/ui/Button'
import { FormInput } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, UploadCloud } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { cn } from '@/utils/cn'

interface FormData {
  name: string
  imageUrl: string
  quantity: number
  basePrice: number
  variations: {
    name: string
    priceAdjustment: number
  }[]
}

const createSchema = (t: (key: string, options?: Record<string, unknown>) => string) => z.object({
  name: z.string().min(1, { message: t('meal.errors.nameRequired') }),
  imageUrl: z.string().min(1, { message: t('meal.errors.imageRequired') }),
  quantity: z.number({ message: t('meal.errors.quantityRequired') }).int().min(0, { message: t('meal.errors.quantityMin') }),
  basePrice: z.number({ message: t('meal.errors.basePriceRequired') }).min(0.01, { message: t('meal.errors.basePriceMin') }),
  variations: z.array(
    z.object({
      name: z.string().min(1, { message: t('meal.errors.variationNameRequired') }),
      priceAdjustment: z.number({ message: t('meal.errors.priceAdjustmentRequired') }).min(0, { message: t('meal.errors.priceAdjustmentMin') }),
    })
  ).min(1, { message: t('meal.errors.atLeastOneVariation') }),
})

interface AddMealModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddMealModal({ isOpen, onClose, onSuccess }: AddMealModalProps) {
  const { t } = useTranslation()
  const [isDragActive, setIsDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const schema = createSchema(t)

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      imageUrl: '',
      quantity: 0,
      basePrice: 0,
      variations: [],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'variations' })

  // Clean up states asynchronously when modal is closed
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        reset()
        setPreviewUrl('')
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isOpen, reset])

  const close = () => {
    onClose()
  }

  const onSubmit = async (data: FormData) => {
    console.log("data", data);
    await mealsApi.create({
      name: data.name,
      imageUrl: data.imageUrl,
      quantity: data.quantity,
      basePrice: data.basePrice,
      variations: data.variations.length > 0 ? data.variations : undefined,
    })
    onSuccess()
    onClose()
  }
  

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragActive(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragActive(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        setValue('imageUrl', url)
        trigger('imageUrl')
      }
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setValue('imageUrl', url)
      trigger('imageUrl')
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const removeImage = () => {
    setPreviewUrl('')
    setValue('imageUrl', '')
    trigger('imageUrl')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={close} title={t('meal.addMeal')} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('meal.fields.image')}
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
            className={cn(
              'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all min-h-[160px]',
              isDragActive
                ? 'border-orange-500 bg-orange-500/5 dark:border-orange-400 dark:bg-orange-400/5'
                : 'border-gray-300 bg-white hover:border-orange-500/50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-orange-400/50',
              errors.imageUrl && 'border-red-500 hover:border-red-500/80 dark:border-red-500'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {previewUrl ? (
              <div className="relative group w-full max-w-[200px] h-[150px] overflow-hidden rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
                <img
                  src={previewUrl}
                  alt="Meal preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-2">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeImage()
                    }}
                  >
                    {t('common.delete')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <UploadCloud className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    PNG, JPG, or WEBP up to 5MB
                  </p>
                </div>
              </div>
            )}
          </div>
          {errors.imageUrl?.message && (
            <p className="text-sm text-red-600">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormInput
            label={t('meal.fields.name')}
            required
            error={errors.name?.message}
            {...register('name')}
          />
          <FormInput
            label={t('meal.fields.quantity')}
            required
            type="number"
            min={0}
            error={errors.quantity?.message}
            {...register('quantity', { valueAsNumber: true })}
          />
          <FormInput
            label={t('meal.fields.basePrice')}
            required
            type="number"
            min={0}
            step="0.01"
            error={errors.basePrice?.message}
            {...register('basePrice', { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('meal.fields.variations')}
              <span className="ml-1 text-red-500">
                *
              </span>
            </h3>
            
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => append({ name: '', priceAdjustment: 0 })}
            >
              {t('meal.addVariation')}
            </Button>
          </div>

          {fields.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('meal.noVariations')}
            </p>
          )}

          {fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-2">
              <div className="flex-1">
                <FormInput
                  label={t('meal.fields.variationName')}
                  required
                  error={errors.variations?.[index]?.name?.message}
                  {...register(`variations.${index}.name`)}
                />
              </div>
              <div className="w-36">
                <FormInput
                  label={t('meal.fields.priceAdjustment')}
                  type="number"
                  min={0}
                  step="0.01"
                  error={errors.variations?.[index]?.priceAdjustment?.message}
                  {...register(`variations.${index}.priceAdjustment`, { valueAsNumber: true })}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={t('common.delete')}
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}

          {errors.variations?.message && (
            <p className="text-sm text-red-600">{errors.variations.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
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
