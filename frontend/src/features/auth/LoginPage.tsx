import { authApi } from '@/api/authApi'
import { Button } from '@/components/ui/Button'
import { FormInput } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/store/authStore'
import type { AppSide } from '@/types/order'
import { SIDE_ROLES } from '@/types/order'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChefHat, CreditCard } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useState } from 'react'
import { cn } from '@/utils/cn'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

type FormData = z.infer<typeof schema>

const defaults: Record<AppSide, FormData> = {
  cashier: { email: 'cashier@rms.local', password: 'Cashier@123' },
  kitchen: { email: 'kitchen@rms.local', password: 'Kitchen@123' },
}

interface LoginPageProps {
  side: AppSide
}

export function LoginPage({ side }: LoginPageProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [error, setError] = useState<string | null>(null)
  const expectedRole = SIDE_ROLES[side]

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaults[side],
  })

  const onSubmit = async (data: FormData) => {
    setError(null)
    try {
      const response = await authApi.login(data)
      if (response.user.role !== expectedRole) {
        setError(t(`auth.wrongSide.${side}`))
        return
      }
      setAuth(response)
      navigate(side === 'kitchen' ? '/kitchen' : '/')
    } catch {
      setError(t('auth.invalidCredentials'))
    }
  }

  const title = side === 'cashier' ? t('auth.cashierLogin') : t('auth.kitchenLogin')
  const demoHint =
    side === 'cashier'
      ? 'cashier@rms.local / Cashier@123'
      : 'kitchen@rms.local / Kitchen@123'

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 p-4 dark:from-gray-950 dark:to-gray-900">
      <div className="w-full max-w-md space-y-4">
        <div className="flex rounded-xl border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-900">
          <Link
            to="/login/cashier"
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              side === 'cashier'
                ? 'bg-orange-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
            )}
          >
            <CreditCard className="h-4 w-4" />
            {t('auth.cashierSide')}
          </Link>
          <Link
            to="/login/kitchen"
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              side === 'kitchen'
                ? 'bg-orange-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
            )}
          >
            <ChefHat className="h-4 w-4" />
            {t('auth.kitchenSide')}
          </Link>
        </div>

        <Card className="w-full" title={title}>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{t('auth.welcome')}</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              label={t('auth.email')}
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <FormInput
              label={t('auth.password')}
              type="password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" loading={isSubmitting}>
              {t('auth.login')}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-gray-400">Demo: {demoHint}</p>
        </Card>
      </div>
    </div>
  )
}
