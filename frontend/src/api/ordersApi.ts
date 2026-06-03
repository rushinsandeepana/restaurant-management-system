import type { Order } from '@/types/order'
import { apiClient } from './client'

export const ordersApi = {
  getAll: () => apiClient.get<Order[]>('/api/orders').then((r) => r.data),
}
