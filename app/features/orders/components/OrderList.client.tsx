'use client'

import { useTransition } from 'react'
import type { Order } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getOrderStatusMeta } from '@/constants/order'
import { History, RefreshCw, X, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
  initial: Order[]
  cancelOrderAction: (id: string) => Promise<void>
  revalidateAction: () => Promise<void>
}

export default function OrderList({ initial, cancelOrderAction, revalidateAction }: Props) {
  const router = useRouter()
  const [isRefreshing, startRefresh] = useTransition()
  const [isCancelling, startCancel] = useTransition()

  const onRefresh = () => {
    startRefresh(async () => {
      await revalidateAction()
      router.refresh()
    })
  }

  const canCancel = (o: Order) => o.status === 'pending' || o.status === 'processing'

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <History className="w-5 h-5" /> 我的订单
            </CardTitle>
            <CardDescription>查看你的订阅购买与发货信息</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> 刷新
          </Button>
        </CardHeader>
      </Card>

      {initial.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">暂无订单，去首页选择一个套餐吧</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {initial.map((o) => {
            const meta = getOrderStatusMeta(o.status)
            return (
              <Card key={o.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-base">订单 #{o.id}</CardTitle>
                    <CardDescription>
                      {o.packageName || '—'} · 下单时间：{new Date(o.createdAt).toLocaleString('zh-CN')}
                    </CardDescription>
                  </div>
                  <Badge className={meta.className}>{meta.label}</Badge>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    支付方式：{o.paymentMethod || 'card'} · 金额：<span className="text-foreground font-medium">¥{o.amount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/orders/${o.id}`)}>
                      <ExternalLink className="w-4 h-4 mr-1" /> 详情
                    </Button>
                    {canCancel(o) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isCancelling}
                        onClick={() =>
                          startCancel(async () => {
                            await cancelOrderAction(o.id)
                            router.refresh()
                          })
                        }
                      >
                        <X className="w-4 h-4 mr-1" /> 取消
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

