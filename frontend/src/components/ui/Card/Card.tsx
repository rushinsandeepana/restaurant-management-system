import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  actions?: ReactNode
  footer?: ReactNode
  children: ReactNode
  className?: string
}

export function Card({ title, actions, footer, children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900',
        className,
      )}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          {title && <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>}
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && (
        <div className="border-t border-gray-100 px-5 py-3 dark:border-gray-800">{footer}</div>
      )}
    </div>
  )
}
