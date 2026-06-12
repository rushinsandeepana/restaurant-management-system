import type { CreateMealRequest, Meal, PageResponse } from '@/types/meal'
import { apiClient } from './client'

export interface MealsQuery {
  search?: string
  page?: number
  size?: number
}

export const mealsApi = {
  getPage: (params: MealsQuery = {}) =>
    apiClient
      .get<PageResponse<Meal>>('/api/meals', {
        params: {
          search: params.search || undefined,
          page: params.page ?? 0,
          size: params.size ?? 10,
        },
      })
      .then((r) => r.data),

  create: (body: CreateMealRequest) =>
    apiClient.post<Meal>('/api/meals', body).then((r) => r.data),
}
