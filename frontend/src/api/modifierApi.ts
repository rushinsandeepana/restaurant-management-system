import type { Modifier, CreateModifierRequest, PageResponse } from '@/types/category'
import { apiClient } from './client'

export interface ModifierQuery {
  search?: string
  page?: number
  size?: number
}

export const modifierApi = {
  getPage: (params: ModifierQuery = {}) =>
    apiClient
      .get<PageResponse<Modifier>>('/api/modifiers', {
        params: {
          search: params.search || undefined,
          page: params.page ?? 0,
          size: params.size ?? 10,
        },
      })
      .then((r) => r.data),

  create: (body: CreateModifierRequest) =>
    apiClient.post<Modifier>('/api/modifiers', body).then((r) => r.data),
}