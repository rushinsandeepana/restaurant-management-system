// src/types/enums.ts

// ✅ const object instead of enum — works with erasableSyntaxOnly
export const Status = {
  ACTIVE:   'ACTIVE',
  INACTIVE: 'INACTIVE',
  DRAFT:    'DRAFT',
} as const

// ✅ Derive the type from the const object
export type Status = typeof Status[keyof typeof Status]

export const STATUS_OPTIONS = [
  { label: 'Active',   value: Status.ACTIVE },
  { label: 'Inactive', value: Status.INACTIVE },
  { label: 'Draft',    value: Status.DRAFT },
]

export function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}