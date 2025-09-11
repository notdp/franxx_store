import type { Order } from '@/types'

type Status = Order['status']

export const ORDER_STATUS_META: Record<Status, { label: string; className: string }> = {
  pending: { label: '待支付', className: 'bg-yellow-100 text-yellow-800' },
  processing: { label: '处理中', className: 'bg-blue-100 text-blue-800' },
  delivered: { label: '已发货', className: 'bg-green-100 text-green-800' },
  failed: { label: '支付失败', className: 'bg-red-100 text-red-800' },
  canceled: { label: '已取消', className: 'bg-gray-100 text-gray-800' },
  expired: { label: '已过期', className: 'bg-gray-100 text-gray-800' },
}

export function getOrderStatusMeta(status: Status) {
  return ORDER_STATUS_META[status] ?? { label: '未知状态', className: 'bg-gray-100 text-gray-800' }
}

