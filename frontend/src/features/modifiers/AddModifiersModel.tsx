import { Button } from '@/components/ui/Button'
import { FormInput } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useEffect, useState } from 'react'
// import { cn } from '@/utils/cn'
import { Status, STATUS_OPTIONS, generateSlug } from '@/types/enums'
import { FormSelect } from '@/components/ui/Input/Select'
import { modifierApi } from '@/api/modifierApi'

const createSchema = (t: (key: string, options?: Record<string, unknown>) => string) =>
  z.object({
    name:        z.string().min(1, { message: t('modifier.errors.nameRequired') }),
    slug:        z.string().min(1, { message: t('modifier.errors.slugRequired') }),
    description: z.string(),
    status:      z.nativeEnum(Status),
    imageUrl:    z.string().min(1, { message: t('modifier.errors.imageRequired') }),
    quantity:    z.number({ message: t('modifier.errors.quantityRequired') })
                  .int()
                  .min(0,  { message: t('modifier.errors.quantityMin') }),
    base_price: z.number({ message: t('modifier.errors.basePriceRequired') })
                  .positive({ message: t('modifier.errors.basePriceMin') }),
  })

type ModifierFormData = z.infer<ReturnType<typeof createSchema>>

interface AddModifierModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddModifierModal({ isOpen, onClose, onSuccess }: AddModifierModalProps) {
  const { t } = useTranslation()
  const [isSlugManuallyEdited, setIsSlugManually] = useState(false)  // ✅ only remaining state

  const schema = createSchema(t)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ModifierFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:        '',
      slug:        '',
      description: '',
      status:      Status.ACTIVE,
      imageUrl:    '',
      base_price:  0,
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

  const onSubmit = async (data: ModifierFormData) => {
    await modifierApi.create({
      name:        data.name,
      slug:        data.slug,
      description: data.description,
      status:      data.status,
      imageUrl:    data.imageUrl,
      base_price:  data.base_price,
    })
    onSuccess()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={close} title={t('modifier.addModifier')} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            label={t('modifier.fields.name')}
            placeholder={t('modifier.placeholders.name', 'Enter modifier name')}
            required
            error={errors.name?.message}
            {...register('name')}
          />
          <div className="grid gap-2 sm:grid-cols-1">
            <FormInput
              label={t('modifier.fields.slug', 'Slug')}
              required
              disabled
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

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            label={t('modifier.fields.basePrice')}
            placeholder={t('modifier.placeholders.basePrice', 'Enter base priceq')}
            required
            type='number'
            error={errors.base_price?.message}
            {...register('base_price')}
          />
          <FormSelect
            label={t('modifier.fields.status', 'Status')}
            required
            options={STATUS_OPTIONS}
            error={errors.status?.message}
            {...register('status')}
          />
        </div>

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