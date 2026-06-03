import { cn } from '@/utils/cn'

type BadgeColor = 'green' | 'yellow' | 'red' | 'blue' | 'gray'

interface BadgeProps {
  color?: BadgeColor
  text: string
}

const colors: Record<BadgeColor, string> = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
}

export function Badge({ color = 'gray', text }: BadgeProps) {
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium', colors[color])}>
      {text}
    </span>
  )
}
