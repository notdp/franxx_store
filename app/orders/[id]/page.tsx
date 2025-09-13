import { notFound } from 'next/navigation'
import { getOrderByIdForCurrentUser } from '@/lib/services/orders.server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getOrderStatusMeta } from '@/constants/order'
import Link from 'next/link'

type Params = { params: { id: string } }

export const revalidate = 0

export default async function OrderDetailPage({ params }: Params) {
  const order = await getOrderByIdForCurrentUser(params.id)
  if (!order) return notFound()
  const meta = getOrderStatusMeta(order.status)

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="container mx-auto max-w-3xl">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">订单 #{order.id}</CardTitle>
              <CardDescription>
                {order.packageName || '—'} · 下单时间：{new Date(order.createdAt).toLocaleString('zh-CN')}
              </CardDescription>
            </div>
            <Badge className={meta.className}>{meta.label}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">金额</div>
                <div className="font-medium">¥{order.amount}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">支付方式</div>
                <div className="font-medium">{order.paymentMethod || 'card'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">联系邮箱</div>
                <div className="font-medium">{order.email}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Stripe 会话</div>
                <div className="font-mono text-sm break-all">{order.stripe_session_id || '—'}</div>
              </div>
            </div>

            {order.account && order.status === 'delivered' && (
              <div className="rounded-lg border p-4">
                <div className="font-medium mb-2">账号信息</div>
                <div className="text-sm">邮箱：{order.account.email}</div>
                <div className="text-sm">密码：••••••••</div>
              </div>
            )}

            <div className="pt-2">
              <Link href="/orders">
                <Button variant="outline">返回列表</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

