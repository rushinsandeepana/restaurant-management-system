import { ordersApi } from '@/api/ordersApi'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import type { Order, OrderStatus } from '@/types/order'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

const statusColor: Record<
  OrderStatus,
  'yellow' | 'blue' | 'green' | 'gray' | 'red'
> = {
  PENDING: 'yellow',
  CONFIRMED: 'blue',
  PREPARING: 'blue',
  READY: 'green',
  SERVED: 'green',
  PAID: 'gray',
  CANCELLED: 'red',
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function KitchenOrdersPage() {
  const { t } = useTranslation()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadOrders = async () => {
    try {
      setError(null)
      const data = await ordersApi.getAll()
      setOrders(data)
    } catch {
      setError(t('kitchen.loadError'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
    const interval = setInterval(loadOrders, 15000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('kitchen.title')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('kitchen.subtitle')}</p>
        </div>
        <span className="text-sm text-gray-500">
          {orders.length} {t('kitchen.orderCount')}
        </span>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {orders.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 dark:text-gray-400">{t('kitchen.noOrders')}</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <Card key={order.id} className="!p-0">
              <div className="flex items-start justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">
                    {order.tableNumber
                      ? `${t('kitchen.table')} ${order.tableNumber}`
                      : t('kitchen.noTable')}{' '}
                    · {formatTime(order.createdAt)}
                  </p>
                </div>
                <Badge color={statusColor[order.status]} text={order.status} />
              </div>
              <ul className="space-y-2 px-4 py-3">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm">
                    <span>
                      <span className="font-medium">{item.quantity}x</span> {item.itemName}
                      {item.notes && (
                        <span className="ms-1 text-xs text-orange-600">({item.notes})</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              {order.notes && (
                <p className="border-t border-gray-100 px-4 py-2 text-xs text-gray-500 dark:border-gray-800">
                  {t('kitchen.note')}: {order.notes}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
