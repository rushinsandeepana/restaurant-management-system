import type { Status } from '@/types/enums'

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  status: Status
  imageUrl: string
  quantity: number
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryRequest {
  name: string
  slug: string
  description: string
  status: Status
  imageUrl: string
  quantity: number
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}