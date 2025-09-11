import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { 
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  CreditCard,
  DollarSign,
  Shield,
  AlertTriangle,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
  FileText,
} from 'lucide-react'
import { cardsService, type AdminCard } from '@/lib/supabase/database'

type CardStatus = 'active' | 'frozen' | 'expired' | 'cancelled'
type Currency = 'USD' | 'CNY' | 'NGN'
const statusLabels: Record<CardStatus, { label: string; color: string }> = {
  active:   { label: '正常',   color: 'bg-green-500' },
  frozen:   { label: '冻结',   color: 'bg-gray-500' },
  expired:  { label: '过期',   color: 'bg-red-500' },
  cancelled:{ label: '已取消', color: 'bg-yellow-500' },
}

const currencyOptions = ['USD','CNY','NGN'] as const
const statusOptions = ['active','frozen','expired','cancelled'] as const

export function VirtualCardManagement() {
  const [cards, setCards] = useState<AdminCard[]>([])
  const [filteredCards, setFilteredCards] = useState<AdminCard[]>([])
  const [loading, setLoading] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<AdminCard | null>(null)
  const [viewingCard, setViewingCard] = useState<AdminCard | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | CardStatus>('all')
  const [showPAN, setShowPAN] = useState<Record<string, boolean>>({})
  const [showCVV, setShowCVV] = useState<Record<string, boolean>>({})

  type FormState = {
    pan: string
    expiry: string
    cvv: string
    provider: string
    balance: number
    holder_name: string
    currency: 'USD' | 'CNY' | 'NGN'
    status: 'active' | 'frozen' | 'expired' | 'cancelled'
    monthly_limit: number | ''
    notes: string
  }

  const [formData, setFormData] = useState<FormState>({
    pan: '',
    expiry: '',
    cvv: '',
    provider: '',
    balance: 0,
    holder_name: '',
    currency: 'USD',
    status: 'active',
    monthly_limit: '',
    notes: '',
  })

  const fetchCards = async () => {
    try {
      setLoading(true)
      const data = await cardsService.list()
      setCards(data)
      setFilteredCards(data)
    } catch (e: any) {
      console.error(e)
      toast.error('获取虚拟卡失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCards() }, [])

  useEffect(() => {
    let list = [...cards]
    const q = searchTerm.trim().toLowerCase()
    if (q) {
      list = list.filter(c =>
        (c.provider?.toLowerCase().includes(q) ?? false) ||
        (c.holder_name?.toLowerCase().includes(q) ?? false) ||
        (c.last4?.includes(q) ?? false) ||
        (c.notes?.toLowerCase().includes(q) ?? false)
      )
    }
    if (statusFilter !== 'all') {
      list = list.filter(c => c.status === statusFilter)
    }
    setFilteredCards(list)
  }, [cards, searchTerm, statusFilter])

  const resetForm = () => setFormData({
    pan: '', expiry: '', cvv: '', provider: '', balance: 0, holder_name: '',
    currency: 'USD', status: 'active', monthly_limit: '', notes: ''
  })

  const handleCreate = async () => {
    if (!formData.pan || !formData.cvv || !formData.expiry) {
      toast.error('请填写卡号/有效期/CVV')
      return
    }
    try {
      await cardsService.create({
        pan: formData.pan,
        cvv: formData.cvv,
        expiry: formData.expiry,
        currency: formData.currency,
        status: formData.status,
        provider: formData.provider || null,
        holder_name: formData.holder_name || null,
        balance: formData.balance,
        monthly_limit: formData.monthly_limit === '' ? null : Number(formData.monthly_limit),
        notes: formData.notes || null,
      })
      await fetchCards()
      setIsCreateDialogOpen(false)
      resetForm()
      toast.success('虚拟卡创建成功')
    } catch (e: any) {
      console.error(e)
      toast.error('创建失败')
    }
  }

  const handleEdit = (card: AdminCard) => {
    setEditingCard(card)
    setFormData({
      pan: card.pan_plain ?? '',
      expiry: card.expiry ?? '',
      cvv: card.cvv_plain ?? '',
      provider: card.provider ?? '',
      balance: Number(card.balance ?? 0),
      holder_name: card.holder_name ?? '',
      currency: card.currency,
      status: card.status,
      monthly_limit: card.monthly_limit ?? '',
      notes: card.notes ?? '',
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingCard) return
    try {
      const updated = await cardsService.update(editingCard.id, {
        pan: formData.pan,
        cvv: formData.cvv,
        expiry: formData.expiry,
        currency: formData.currency,
        status: formData.status,
        provider: formData.provider,
        holder_name: formData.holder_name,
        balance: formData.balance,
        monthly_limit: formData.monthly_limit === '' ? null : Number(formData.monthly_limit),
        notes: formData.notes,
      })
      // after update, refresh list to get decrypted values
      await fetchCards()
      setIsEditDialogOpen(false)
      setEditingCard(null)
      toast.success('虚拟卡更新成功')
    } catch (e: any) {
      console.error(e)
      toast.error('更新失败')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await cardsService.remove(id)
      setCards(prev => prev.filter(c => c.id !== id))
      toast.success('虚拟卡删除成功')
    } catch (e: any) {
      console.error(e)
      toast.error('删除失败')
    }
  }

  const handleViewDetails = (card: AdminCard) => {
    setViewingCard(card)
    setIsDetailDialogOpen(true)
  }

  const togglePAN = (id: string) => setShowPAN(prev => ({ ...prev, [id]: !prev[id] }))
  const toggleCVV = (id: string) => setShowCVV(prev => ({ ...prev, [id]: !prev[id] }))

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success(`${label}已复制到剪贴板`))
  }

  const maskPAN = (pan?: string | null, show?: boolean) => {
    if (!pan) return '-'
    if (show) return pan
    return pan.replace(/(\d{4})\d+(\d{4})/, '$1 **** **** $2')
  }

  const totalBalance = useMemo(() => cards.reduce((s, c) => s + Number(c.balance ?? 0), 0), [cards])
  const activeCards = useMemo(() => cards.filter(c => c.status === 'active').length, [cards])
  const lowBalanceCards = useMemo(() => cards.filter(c => Number(c.balance ?? 0) < 50).length, [cards])
  const thisMonthSpending = useMemo(() => cards.reduce((s, c) => s + Number(c.used_this_month ?? 0), 0).toFixed(2), [cards])

  const copyAll = (c: AdminCard) => {
    const text = [
      '虚拟卡信息',
      '------------------------------',
      `持卡人：${c.holder_name || '-'}`,
      `供应商：${c.provider || '-'}`,
      `卡号：${c.pan_plain || '-'}`,
      `后四位：${c.last4 || '-'}`,
      `有效期：${c.expiry || '-'}`,
      `CVV：${c.cvv_plain || '-'}`,
      `余额：${Number(c.balance ?? 0).toFixed(2)} ${c.currency}`,
      `本月已用：${Number(c.used_this_month ?? 0).toFixed(2)}`,
      `月限额：${c.monthly_limit ?? '-'}`,
      `状态：${c.status}`,
      `备注：${c.notes || '-'}`,
    ].join('\n')
    copyToClipboard(text, '完整信息')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">虚拟卡管理</h1>
          <p className="text-muted-foreground mt-1">按数据库设计：含持卡人姓名，不含电话</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchCards} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />{loading ? '刷新中...' : '刷新'}
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />新增虚拟卡
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>新增虚拟卡</DialogTitle>
                <DialogDescription>采集卡片与管理字段（含持卡人姓名，不含电话）</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3 flex items-center"><CreditCard className="w-4 h-4 mr-2" />银行卡信息</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">卡号 *</Label>
                      <Input id="cardNumber" placeholder="4183960034898921" value={formData.pan}
                        onChange={(e) => setFormData(p => ({ ...p, pan: e.target.value.replace(/\D/g, '') }))} maxLength={19} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiry">有效期 (YYYY/MM)</Label>
                      <Input id="expiry" placeholder="2028/07" value={formData.expiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, '')
                          if (v.length >= 4) v = v.substring(0,4) + '/' + v.substring(4,6)
                          setFormData(p => ({ ...p, expiry: v }))
                        }} maxLength={7} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" value={formData.cvv}
                        onChange={(e) => setFormData(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '') }))} maxLength={4} />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3 flex items-center"><Shield className="w-4 h-4 mr-2" />管理信息</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="holder">持卡人姓名</Label>
                      <Input id="holder" placeholder="John Doe" value={formData.holder_name}
                        onChange={(e) => setFormData(p => ({ ...p, holder_name: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="provider">供应商</Label>
                      <Input id="provider" placeholder="gomoney / timon / ..." value={formData.provider}
                        onChange={(e) => setFormData(p => ({ ...p, provider: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="balance">余额</Label>
                      <Input id="balance" type="number" value={formData.balance}
                        onChange={(e) => setFormData(p => ({ ...p, balance: Number(e.target.value) || 0 }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>货币</Label>
                    <Select value={formData.currency} onValueChange={(v) => setFormData(p => ({ ...p, currency: v as Currency }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{currencyOptions.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>状态</Label>
                    <Select value={formData.status} onValueChange={(v) => setFormData(p => ({ ...p, status: v as CardStatus }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{statusOptions.map(s => (<SelectItem key={s} value={s}>{statusLabels[s].label}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="limit">月限额</Label>
                      <Input id="limit" type="number" value={formData.monthly_limit as any}
                        onChange={(e) => setFormData(p => ({ ...p, monthly_limit: e.target.value === '' ? '' : Number(e.target.value) }))} />
                    </div>
                    <div className="space-y-2 md:col-span-3">
                      <Label htmlFor="notes">备注</Label>
                      <Input id="notes" placeholder="可选" value={formData.notes}
                        onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))} />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>取消</Button>
                <Button onClick={handleCreate}>创建虚拟卡</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">虚拟卡总数</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cards.length}</div>
            <p className="text-xs text-muted-foreground">活跃卡片: {activeCards}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总余额</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">可用余额</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">低余额预警</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowBalanceCards}</div>
            <p className="text-xs text-muted-foreground">余额低于 $50</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本月消费</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${thisMonthSpending}</div>
            <p className="text-xs text-muted-foreground">已统计</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>虚拟卡列表</CardTitle>
          <CardDescription>遵循数据库结构（含持卡人姓名；不含电话）</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="搜索后四位、供应商或持卡人..." value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  {statusOptions.map(s => (<SelectItem key={s} value={s}>{statusLabels[s].label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>供应商</TableHead>
                  <TableHead>持卡人</TableHead>
                  <TableHead>卡号/后四位</TableHead>
                  <TableHead>有效期 / CVV</TableHead>
                  <TableHead>余额/货币</TableHead>
                  <TableHead>月限额/本月</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCards.map((card) => (
                  <TableRow key={card.id}>
                    <TableCell className="text-sm">{card.provider || '-'}</TableCell>
                    <TableCell className="text-sm">{card.holder_name || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{maskPAN(card.pan_plain, showPAN[card.id])}</span>
                        <Button variant="ghost" size="sm" onClick={() => togglePAN(card.id)} className="h-6 w-6 p-0">
                          {showPAN[card.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        {card.pan_plain && (
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(card.pan_plain!, '卡号')} className="h-6 w-6 p-0">
                            <Copy className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">后四位 {card.last4 || '-'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{card.expiry || '-'}</div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs">{showCVV[card.id] ? (card.cvv_plain || '-') : '***'}</span>
                          <Button variant="ghost" size="sm" onClick={() => toggleCVV(card.id)} className="h-4 w-4 p-0">
                            {showCVV[card.id] ? <EyeOff className="h-2 w-2" /> : <Eye className="h-2 w-2" />}
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">${Number(card.balance ?? 0).toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">{card.currency}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div>限额 {card.monthly_limit ?? '-'}</div>
                        <div className="text-muted-foreground">本月 {Number(card.used_this_month ?? 0).toFixed(2)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`${statusLabels[card.status].color} text-white`}>
                        {statusLabels[card.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(card)} title="详情">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(card)} title="编辑">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(card.id)} title="删除">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredCards.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || statusFilter !== 'all' ? '没有找到匹配的虚拟卡' : '暂无虚拟卡数据'}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileText className="w-5 h-5" />虚拟卡详情</DialogTitle>
            <DialogDescription>完整卡片信息（含持卡人姓名；不含电话）</DialogDescription>
          </DialogHeader>
          {viewingCard && (
            <div className="space-y-6">
              <div>
                <Button className="w-full" onClick={() => copyAll(viewingCard)}>
                  <Copy className="w-4 h-4 mr-2" />一键复制完整信息
                </Button>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>供应商</Label>
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="text-sm">{viewingCard.provider || '-'}</div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(viewingCard.provider || '-', '供应商')} className="h-6 w-6 p-0"><Copy className="h-3 w-3" /></Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>持卡人</Label>
                  <div className="text-sm">{viewingCard.holder_name || '-'}</div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(viewingCard.holder_name || '-', '持卡人')} className="h-6 w-6 p-0"><Copy className="h-3 w-3" /></Button>
                </div>
                <div className="space-y-2">
                  <Label>状态</Label>
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <Badge className={`${statusLabels[viewingCard.status].color} text-white`}>{statusLabels[viewingCard.status].label}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(viewingCard.status, '状态')} className="h-6 w-6 p-0"><Copy className="h-3 w-3" /></Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>货币</Label>
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="text-sm">{viewingCard.currency}</div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(viewingCard.currency, '货币')} className="h-6 w-6 p-0"><Copy className="h-3 w-3" /></Button>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>卡号</Label>
                  <div className="flex items-center gap-2">
                    <div className="font-mono text-sm flex-1">{maskPAN(viewingCard.pan_plain, showPAN[viewingCard.id])}</div>
                    <Button variant="ghost" size="sm" onClick={() => togglePAN(viewingCard.id)} className="h-6 w-6 p-0">{showPAN[viewingCard.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}</Button>
                    {viewingCard.pan_plain && (
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(viewingCard.pan_plain!, '卡号')} className="h-6 w-6 p-0"><Copy className="h-3 w-3" /></Button>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">后四位 {viewingCard.last4 || '-'}</div>
                </div>
                <div className="space-y-2">
                  <Label>有效期</Label>
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="text-sm">{viewingCard.expiry || '-'}</div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(viewingCard.expiry || '-', '有效期')} className="h-6 w-6 p-0"><Copy className="h-3 w-3" /></Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>CVV</Label>
                  <div className="flex items-center gap-2">
                    <div className="font-mono text-sm">{showCVV[viewingCard.id] ? (viewingCard.cvv_plain || '-') : '***'}</div>
                    <Button variant="ghost" size="sm" onClick={() => toggleCVV(viewingCard.id)} className="h-6 w-6 p-0">{showCVV[viewingCard.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}</Button>
                    {viewingCard.cvv_plain && (
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(viewingCard.cvv_plain!, 'CVV')} className="h-6 w-6 p-0"><Copy className="h-3 w-3" /></Button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>余额</Label>
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="text-sm">${Number(viewingCard.balance ?? 0).toFixed(2)} {viewingCard.currency}</div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(`${Number(viewingCard.balance ?? 0).toFixed(2)} ${viewingCard.currency}`, '余额')} className="h-6 w-6 p-0"><Copy className="h-3 w-3" /></Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>本月已用</Label>
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="text-sm">{Number(viewingCard.used_this_month ?? 0).toFixed(2)}</div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(String(Number(viewingCard.used_this_month ?? 0).toFixed(2)), '本月已用')} className="h-6 w-6 p-0"><Copy className="h-3 w-3" /></Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>月限额</Label>
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="text-sm">{viewingCard.monthly_limit ?? '-'}</div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(String(viewingCard.monthly_limit ?? '-'), '月限额')} className="h-6 w-6 p-0"><Copy className="h-3 w-3" /></Button>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>备注</Label>
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="text-sm truncate">{viewingCard.notes || '-'}</div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(viewingCard.notes || '-', '备注')} className="h-6 w-6 p-0"><Copy className="h-3 w-3" /></Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>创建时间</Label>
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="text-sm">{new Date(viewingCard.created_at).toLocaleString('zh-CN')}</div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(new Date(viewingCard.created_at).toLocaleString('zh-CN'), '创建时间')} className="h-6 w-6 p-0"><Copy className="h-3 w-3" /></Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>更新时间</Label>
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="text-sm">{new Date(viewingCard.updated_at).toLocaleString('zh-CN')}</div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(new Date(viewingCard.updated_at).toLocaleString('zh-CN'), '更新时间')} className="h-6 w-6 p-0"><Copy className="h-3 w-3" /></Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>编辑虚拟卡</DialogTitle>
              <DialogDescription>修改虚拟卡信息（遵循数据库字段）</DialogDescription>
            </DialogHeader>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3 flex items-center"><CreditCard className="w-4 h-4 mr-2" />银行卡信息</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-cardNumber">卡号 *</Label>
                  <Input id="edit-cardNumber" placeholder="4183960034898921" value={formData.pan}
                    onChange={(e) => setFormData(p => ({ ...p, pan: e.target.value.replace(/\D/g, '') }))} maxLength={19} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-expiry">有效期 (YYYY/MM)</Label>
                  <Input id="edit-expiry" placeholder="2028/07" value={formData.expiry}
                    onChange={(e) => { let v = e.target.value.replace(/\D/g, ''); if (v.length >= 4) v = v.substring(0,4)+'/'+v.substring(4,6); setFormData(p => ({ ...p, expiry: v })) }} maxLength={7} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cvv">CVV</Label>
                  <Input id="edit-cvv" placeholder="123" value={formData.cvv}
                    onChange={(e) => setFormData(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '') }))} maxLength={4} />
                </div>
                
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-3 flex items-center"><Shield className="w-4 h-4 mr-2" />管理信息</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-holder">持卡人姓名</Label>
                  <Input id="edit-holder" value={formData.holder_name} onChange={(e) => setFormData(p => ({ ...p, holder_name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-provider">供应商</Label>
                  <Input id="edit-provider" value={formData.provider} onChange={(e) => setFormData(p => ({ ...p, provider: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-balance">余额</Label>
                  <Input id="edit-balance" type="number" value={formData.balance} onChange={(e) => setFormData(p => ({ ...p, balance: Number(e.target.value) || 0 }))} />
                </div>
                <div className="space-y-2">
                  <Label>货币</Label>
                  <Select value={formData.currency} onValueChange={(v) => setFormData(p => ({ ...p, currency: v as Currency }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{currencyOptions.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>状态</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData(p => ({ ...p, status: v as CardStatus }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{statusOptions.map(s => (<SelectItem key={s} value={s}>{statusLabels[s].label}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-limit">月限额</Label>
                  <Input id="edit-limit" type="number" value={formData.monthly_limit as any}
                    onChange={(e) => setFormData(p => ({ ...p, monthly_limit: e.target.value === '' ? '' : Number(e.target.value) }))} />
                </div>
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="edit-notes">备注</Label>
                  <Input id="edit-notes" value={formData.notes} onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))} />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>取消</Button>
            <Button onClick={handleUpdate}>保存更改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
