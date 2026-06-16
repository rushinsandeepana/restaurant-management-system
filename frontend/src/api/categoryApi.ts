import type { Category, CreateCategoryRequest, PageResponse } from '@/types/category'
import { apiClient } from './client'

export interface CategoryQuery {
  search?: string
  page?: number
  size?: number
}

export const categoryApi = {
  getPage: (params: CategoryQuery = {}) =>
    apiClient
      .get<PageResponse<Category>>('/api/categories', {
        params: {
          search: params.search || undefined,
          page: params.page ?? 0,
          size: params.size ?? 10,
        },
      })
      .then((r) => r.data),

  create: (body: CreateCategoryRequest) =>
    apiClient.post<Category>('/api/categories', body).then((r) => r.data),
}