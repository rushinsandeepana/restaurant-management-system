import type { Role } from './auth'

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'SERVED'
  | 'PAID'
  | 'CANCELLED'

export interface OrderItem {
  id: number
  itemName: string
  quantity: number
  unitPrice: number | null
  notes: string | null
}

export interface Order {
  id: number
  orderNumber: string
  tableNumber: string | null
  status: OrderStatus
  notes: string | null
  createdAt: string
  items: OrderItem[]
}

export type AppSide = 'cashier' | 'kitchen'

export const SIDE_ROLES: Record<AppSide, Role> = {
  cashier: 'CASHIER',
  kitchen: 'CHEF',
}
