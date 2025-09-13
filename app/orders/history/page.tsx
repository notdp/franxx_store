import OrderList from '@/features/orders/components/OrderList.client'
import { listOrdersForCurrentUser } from '@/lib/services/orders.server'
import { cancelOrder, revalidateOrders } from '@/actions/orders'

export const revalidate = 0

export default async function OrdersHistoryPage() {
  const orders = await listOrdersForCurrentUser()
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="container mx-auto max-w-4xl">
        <OrderList initial={orders} cancelOrderAction={cancelOrder} revalidateAction={revalidateOrders} />
      </div>
    </div>
  )
}

