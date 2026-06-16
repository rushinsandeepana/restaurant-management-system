import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface SelectOption {
  label: string
  value: string
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: SelectOption[]
  error?: string
  required?: boolean
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, options, error, required, className, ...rest }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <select
          ref={ref}
          className={cn(
            'w-full rounded-lg border px-3 py-2 text-sm transition-colors',
            'border-gray-300 bg-white text-gray-900',
            'dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100',
            'focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500',
            'dark:focus:border-orange-400 dark:focus:ring-orange-400/40',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/40',
            className
          )}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)

FormSelect.displayName = 'FormSelect'