import { apiClient } from './client'
import type { PageResponse } from '@/types/category'

// ─── Types ────────────────────────────────────────────────────────────────────

export type TableStatus = 'AVAILABLE' | 'UNAVAILABLE'

export interface Table {
  id: number
  name: string
  status: TableStatus
  createdAt: string
  updatedAt: string
}

export interface CreateTableRequest {
  name:   string
  status: TableStatus
}

export interface TableQuery {
  search?: string
  page?:   number
  size?:   number
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const tableApi = {
  getPage: (params: TableQuery = {}) =>
    apiClient
      .get<PageResponse<Table>>('/api/tables', {
        params: {
          search: params.search || undefined,
          page:   params.page ?? 0,
          size:   params.size ?? 10,
        },
      })
      .then((r) => r.data),

  create: (body: CreateTableRequest) =>
    apiClient.post<Table>('/api/tables', body).then((r) => r.data),
}
