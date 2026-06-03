import type { ReactNode } from 'react'

interface PageWrapperProps {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

export function PageWrapper({ title, description, actions, children }: PageWrapperProps) {
  return (
    <div className="flex flex-1 flex-col overflow-auto p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
        {actions}
      </div>
      {children}
    </div>
  )
}
