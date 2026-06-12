import { cn } from '@/utils/cn'
import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  required?: boolean
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  function FormInput({ label, error, required, className, id, ...props }, ref) {
    const inputId = id ?? props.name

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}

            {required && (
              <span className="ml-1 text-red-500">
                *
              </span>
            )}

          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className,
          )}
          {...props}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    )
  },
)