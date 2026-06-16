import { categoryApi } from '@/api/categoryApi'
import { Button } from '@/components/ui/Button'
import { FormInput } from '@/components/ui/Input'
import { ImageUpload } from '@/components/ui/Input/ImageUpload'
import { Modal } from '@/components/ui/Modal'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { cn } from '@/utils/cn'
import { Status, STATUS_OPTIONS, generateSlug } from '@/types/enums'
import { FormSelect } from '@/components/ui/Input/Select'

const createSchema = (t: (key: string, options?: Record<string, unknown>) => string) =>
  z.object({
    name:        z.string().min(1, { message: t('category.errors.nameRequired') }),
    slug:        z.string().min(1, { message: t('category.errors.slugRequired') }),
    description: z.string(),
    status:      z.nativeEnum(Status),
    imageUrl:    z.string().min(1, { message: t('category.errors.imageRequired') }),
    quantity:    z.number({ message: t('category.errors.quantityRequired') })
                  .int()
                  .min(0,  { message: t('category.errors.quantityMin') }),
  })

type CategoryFormData = z.infer<ReturnType<typeof createSchema>>

interface AddCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddCategoryModal({ isOpen, onClose, onSuccess }: AddCategoryModalProps) {
  const { t } = useTranslation()
  const [isSlugManuallyEdited, setIsSlugManually] = useState(false)  // ✅ only remaining state

  const schema = createSchema(t)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:        '',
      slug:        '',
      description: '',
      status:      Status.ACTIVE,
      imageUrl:    '',
      quantity:    0,
    },
  })

  // Auto-generate slug from name unless manually edited
  const nameValue = watch('name')
  useEffect(() => {
    if (!isSlugManuallyEdited) {
      setValue('slug', generateSlug(nameValue), { shouldValidate: true })
    }
  }, [nameValue, isSlugManuallyEdited, setValue])

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        reset()
        setIsSlugManually(false)  // ✅ removed setPreviewUrl — ImageUpload handles it internally
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isOpen, reset])

  const close = () => onClose()

  const onSubmit = async (data: CategoryFormData) => {
    await categoryApi.create({
      name:        data.name,
      slug:        data.slug,
      description: data.description,
      status:      data.status,
      imageUrl:    data.imageUrl,
      quantity:    data.quantity,
    })
    onSuccess()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={close} title={t('category.addCategory')} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <ImageUpload
          label={t('category.fields.image')}
          required
          error={errors.imageUrl?.message}
          value={watch('imageUrl')}
          previewAlt="Category preview"
          onChange={(url) => {
            setValue('imageUrl', url)
            trigger('imageUrl')
          }}
          onRemove={() => {
            setValue('imageUrl', '')
            trigger('imageUrl')
          }}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            label={t('category.fields.name')}
            placeholder={t('category.placeholders.name', 'Enter category name')}
            required
            error={errors.name?.message}
            {...register('name')}
          />
          <div className="grid gap-2 sm:grid-cols-1">
            <FormInput
              label={t('category.fields.slug', 'Slug')}
              required
              error={errors.slug?.message}
              placeholder="auto-generated-from-name"
              {...register('slug')}
              onChange={(e) => {
                setIsSlugManually(true)
                setValue('slug', e.target.value)
              }}
            />
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Auto-generated from name. You can edit it manually.
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('category.fields.description', 'Description')}
          </label>
          <textarea
            rows={3}
            placeholder={t('category.placeholders.description', 'Enter a description...')}
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

        <FormSelect
          label={t('category.fields.status', 'Status')}
          required
          options={STATUS_OPTIONS}
          error={errors.status?.message}
          {...register('status')}
        />

        {/* Actions */}
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