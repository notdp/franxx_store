import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  CreditCard,
  DollarSign,
  User,
  MapPin,
  Phone,
  Calendar,
  Shield,
  AlertTriangle,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
  FileText,
  Files
} from 'lucide-react';

interface VirtualCard {
  id: string;
  // 持卡人信息
  firstName: string;
  lastName: string;
  fullName: string;
  // 地址信息
  street: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
  // 银行卡信息
  cardNumber: string;
  expiryDate: string; // MM/YY格式
  cvv: string;
  phoneNumber: string;
  // 管理信息
  balance: number;
  currency: string;
  status: 'active' | 'suspended' | 'expired' | 'blocked';
  createdAt: string;
  updatedAt: string;
  lastUsed: string;
}

const statusLabels = {
  active: { label: '正常', color: 'bg-green-500' },
  suspended: { label: '暂停', color: 'bg-yellow-500' },
  expired: { label: '过期', color: 'bg-red-500' },
  blocked: { label: '冻结', color: 'bg-gray-500' }
};

const countries = [
  { value: 'Nigeria', label: '尼日利亚 (Nigeria)', flag: '🇳🇬' },
  { value: 'Kenya', label: '肯尼亚 (Kenya)', flag: '🇰🇪' },
  { value: 'Ghana', label: '加纳 (Ghana)', flag: '🇬🇭' },
  { value: 'South Africa', label: '南非 (South Africa)', flag: '🇿🇦' }
];

export function VirtualCardManagement() {
  const [cards, setCards] = useState<VirtualCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<VirtualCard[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<VirtualCard | null>(null);
  const [viewingCard, setViewingCard] = useState<VirtualCard | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCardNumbers, setShowCardNumbers] = useState<Record<string, boolean>>({});
  const [showCVVs, setShowCVVs] = useState<Record<string, boolean>>({});

  // 表单状态
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    county: '',
    postcode: '',
    country: 'Nigeria',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    phoneNumber: '',
    balance: 0,
    currency: 'USD',
    status: 'active' as VirtualCard['status']
  });

  // 模拟数据 - 基于提供的尼日利亚虚拟卡信息
  useEffect(() => {
    const mockCards: VirtualCard[] = [
      {
        id: '1',
        firstName: 'Fiddausi',
        lastName: 'Muhamamd',
        fullName: 'Fiddausi Muhamamd',
        street: 'KIRIKASAMMA QUARTERS, HADEJIA',
        city: 'Hadejia',
        county: 'Jigawa',
        postcode: '732101',
        country: 'Nigeria',
        cardNumber: '4183960034898921',
        expiryDate: '07/28',
        cvv: '028',
        phoneNumber: '+234 9045435782',
        balance: 450.00,
        currency: 'USD',
        status: 'active',
        createdAt: '2024-01-15T08:30:00Z',
        updatedAt: '2024-01-25T14:22:00Z',
        lastUsed: '2024-01-25T10:15:00Z'
      },
      {
        id: '2',
        firstName: 'Ahmed',
        lastName: 'Ibrahim',
        fullName: 'Ahmed Ibrahim',
        street: 'SABON GARI QUARTERS',
        city: 'Kano',
        county: 'Kano',
        postcode: '700001',
        country: 'Nigeria',
        cardNumber: '5412987654321098',
        expiryDate: '12/27',
        cvv: '456',
        phoneNumber: '+234 8123456789',
        balance: 120.50,
        currency: 'USD',
        status: 'active',
        createdAt: '2024-01-20T12:00:00Z',
        updatedAt: '2024-01-24T16:30:00Z',
        lastUsed: '2024-01-23T09:45:00Z'
      },
      {
        id: '3',
        firstName: 'Fatima',
        lastName: 'Hassan',
        fullName: 'Fatima Hassan',
        street: 'TUDUN WADA AREA',
        city: 'Kaduna',
        county: 'Kaduna',
        postcode: '800001',
        country: 'Nigeria',
        cardNumber: '6011234567890123',
        expiryDate: '03/26',
        cvv: '789',
        phoneNumber: '+234 7098765432',
        balance: 75.25,
        currency: 'USD',
        status: 'suspended',
        createdAt: '2024-01-18T14:20:00Z',
        updatedAt: '2024-01-22T11:10:00Z',
        lastUsed: '2024-01-20T15:30:00Z'
      }
    ];
    setCards(mockCards);
    setFilteredCards(mockCards);
  }, []);

  // 搜索和过滤
  useEffect(() => {
    let filtered = cards;

    if (searchTerm) {
      filtered = filtered.filter(card =>
        card.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.cardNumber.includes(searchTerm) ||
        card.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.phoneNumber.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(card => card.status === statusFilter);
    }

    setFilteredCards(filtered);
  }, [cards, searchTerm, statusFilter]);

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      county: '',
      postcode: '',
      country: 'Nigeria',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      phoneNumber: '',
      balance: 0,
      currency: 'USD',
      status: 'active'
    });
  };

  const handleCreate = () => {
    if (!formData.firstName || !formData.lastName || !formData.cardNumber) {
      toast.error('请填写必填字段');
      return;
    }

    const newCard: VirtualCard = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      fullName: `${formData.firstName} ${formData.lastName}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    };

    setCards(prev => [...prev, newCard]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast.success('虚拟卡创建成功');
  };

  const handleEdit = (card: VirtualCard) => {
    setEditingCard(card);
    setFormData({
      firstName: card.firstName,
      lastName: card.lastName,
      street: card.street,
      city: card.city,
      county: card.county,
      postcode: card.postcode,
      country: card.country,
      cardNumber: card.cardNumber,
      expiryDate: card.expiryDate,
      cvv: card.cvv,
      phoneNumber: card.phoneNumber,
      balance: card.balance,
      currency: card.currency,
      status: card.status
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingCard) return;

    setCards(prev =>
      prev.map(card =>
        card.id === editingCard.id
          ? { 
              ...card, 
              ...formData, 
              fullName: `${formData.firstName} ${formData.lastName}`,
              updatedAt: new Date().toISOString() 
            }
          : card
      )
    );
    setIsEditDialogOpen(false);
    setEditingCard(null);
    resetForm();
    toast.success('虚拟卡更新成功');
  };

  const handleDelete = (cardId: string) => {
    setCards(prev => prev.filter(card => card.id !== cardId));
    toast.success('虚拟卡删除成功');
  };

  const handleViewDetails = (card: VirtualCard) => {
    setViewingCard(card);
    setIsDetailDialogOpen(true);
  };

  const toggleCardNumberVisibility = (cardId: string) => {
    setShowCardNumbers(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const toggleCVVVisibility = (cardId: string) => {
    setShowCVVs(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label}已复制到剪贴板`);
    });
  };

  const copyAllCardInfo = (card: VirtualCard) => {
    const cardInfo = `虚拟卡完整信息：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
持卡人信息：
姓名：${card.fullName}
手机：${card.phoneNumber}

地址信息：
街道：${card.street || '-'}
城市：${card.city || '-'}
州/省：${card.county || '-'}
邮编：${card.postcode || '-'}
国家：${card.country}

银行卡信息：
卡号：${card.cardNumber}
有效期：${card.expiryDate}
CVV：${card.cvv}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    
    navigator.clipboard.writeText(cardInfo).then(() => {
      toast.success('完整卡片信息已复制到剪贴板');
    }).catch((error) => {
      console.error('复制失败:', error);
      toast.error('复制失败，请手动选择复制');
    });
  };

  const formatCardNumber = (cardNumber: string, show: boolean) => {
    if (show) return cardNumber;
    return cardNumber.replace(/(\d{4})\d{8}(\d{4})/, '$1****-****$2');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const totalBalance = cards.reduce((sum, card) => sum + card.balance, 0);
  const activeCards = cards.filter(card => card.status === 'active').length;
  const lowBalanceCards = cards.filter(card => card.balance < 100).length;
  const thisMonthSpending = 1280; // 模拟数据

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">虚拟卡管理</h1>
          <p className="text-muted-foreground mt-1">
            管理尼日利亚及其他地区的虚拟银行卡，用于ChatGPT订阅
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              新增虚拟卡
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>新增虚拟卡</DialogTitle>
              <DialogDescription>
                添加新的虚拟银行卡信息，请确保信息准确无误
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* 持卡人信息 */}
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  持卡人信息
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">名字 *</Label>
                    <Input
                      id="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">姓氏 *</Label>
                    <Input
                      id="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* 地址信息 */}
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  地址信息
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">街道地址</Label>
                    <Input
                      id="street"
                      placeholder="KIRIKASAMMA QUARTERS, HADEJIA"
                      value={formData.street}
                      onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">城市</Label>
                      <Input
                        id="city"
                        placeholder="Hadejia"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="county">州/省</Label>
                      <Input
                        id="county"
                        placeholder="Jigawa"
                        value={formData.county}
                        onChange={(e) => setFormData(prev => ({ ...prev, county: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postcode">邮编</Label>
                      <Input
                        id="postcode"
                        placeholder="732101"
                        value={formData.postcode}
                        onChange={(e) => setFormData(prev => ({ ...prev, postcode: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">国家</Label>
                    <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.flag} {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 银行卡信息 */}
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  银行卡信息
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">卡号 *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="4183960034898921"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value.replace(/\D/g, '') }))}
                      maxLength={16}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">有效期 (MM/YY)</Label>
                      <Input
                        id="expiryDate"
                        placeholder="07/28"
                        value={formData.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.substring(0,2) + '/' + value.substring(2,4);
                          }
                          setFormData(prev => ({ ...prev, expiryDate: value }));
                        }}
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="028"
                        value={formData.cvv}
                        onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                        maxLength={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">手机号</Label>
                      <Input
                        id="phoneNumber"
                        placeholder="+234 9045435782"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 管理信息 */}
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  管理信息
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="balance">余额</Label>
                    <Input
                      id="balance"
                      type="number"
                      placeholder="450.00"
                      value={formData.balance}
                      onChange={(e) => setFormData(prev => ({ ...prev, balance: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">货币</Label>
                    <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">美元 (USD)</SelectItem>
                        <SelectItem value="NGN">尼日利亚奈拉 (NGN)</SelectItem>
                        <SelectItem value="EUR">欧元 (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">状态</Label>
                    <Select value={formData.status} onValueChange={(value: VirtualCard['status']) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">正常</SelectItem>
                        <SelectItem value="suspended">暂停</SelectItem>
                        <SelectItem value="expired">过期</SelectItem>
                        <SelectItem value="blocked">冻结</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>


              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleCreate}>
                创建虚拟卡
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">虚拟卡总数</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cards.length}</div>
            <p className="text-xs text-muted-foreground">
              活跃卡片: {activeCards}
            </p>
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
            <p className="text-xs text-muted-foreground">需要充值</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本月消费</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${thisMonthSpending}</div>
            <p className="text-xs text-muted-foreground">订阅费用</p>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和过滤 */}
      <Card>
        <CardHeader>
          <CardTitle>虚拟卡列表</CardTitle>
          <CardDescription>管理所有虚拟银行卡信息</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索持卡人、卡号、城市或手机号..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="active">正常</SelectItem>
                  <SelectItem value="suspended">暂停</SelectItem>
                  <SelectItem value="expired">过期</SelectItem>
                  <SelectItem value="blocked">冻结</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>持卡人</TableHead>
                  <TableHead>卡号</TableHead>
                  <TableHead>有效期/CVV</TableHead>
                  <TableHead>地址</TableHead>
                  <TableHead>余额</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCards.map((card) => (
                  <TableRow key={card.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{card.fullName}</div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {card.phoneNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">
                          {formatCardNumber(card.cardNumber, showCardNumbers[card.id])}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCardNumberVisibility(card.id)}
                          className="h-6 w-6 p-0"
                        >
                          {showCardNumbers[card.id] ? 
                            <EyeOff className="h-3 w-3" /> : 
                            <Eye className="h-3 w-3" />
                          }
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(card.cardNumber, '卡号')}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{card.expiryDate}</div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs">
                            {showCVVs[card.id] ? card.cvv : '***'}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCVVVisibility(card.id)}
                            className="h-4 w-4 p-0"
                          >
                            {showCVVs[card.id] ? 
                              <EyeOff className="h-2 w-2" /> : 
                              <Eye className="h-2 w-2" />
                            }
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div>{card.city}, {card.county}</div>
                        <div className="text-muted-foreground">{card.country}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          ${card.balance.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {card.currency}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={`${statusLabels[card.status].color} text-white`}
                      >
                        {statusLabels[card.status].label}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(card)}
                          title="查看详情"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(card)}
                          title="编辑"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(card.id)}
                          title="删除"
                        >
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

      {/* 详情查看对话框 */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              虚拟卡详情
            </DialogTitle>
            <DialogDescription>
              完整的虚拟卡信息，可快速复制用于账号绑定
            </DialogDescription>
          </DialogHeader>
          
          {viewingCard && (
            <div className="space-y-6">
              {/* 一键复制按钮 */}
              <div className="flex justify-center">
                <Button
                  onClick={() => copyAllCardInfo(viewingCard)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Files className="w-4 h-4 mr-2" />
                  一键复制完整信息
                </Button>
              </div>

              <Separator />

              {/* 持卡人信息 */}
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  持卡人信息
                </h4>
                <div className="space-y-3">
                  <div 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => copyToClipboard(viewingCard.fullName, '姓名')}
                  >
                    <div>
                      <Label className="text-sm text-muted-foreground">完整姓名</Label>
                      <div className="font-mono text-sm">{viewingCard.fullName}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(viewingCard.fullName, '姓名');
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => copyToClipboard(viewingCard.phoneNumber, '手机号')}
                  >
                    <div>
                      <Label className="text-sm text-muted-foreground">手机号码</Label>
                      <div className="font-mono text-sm">{viewingCard.phoneNumber}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(viewingCard.phoneNumber, '手机号');
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 地址信息 */}
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  地址信息
                </h4>
                <div className="space-y-3">
                  <div 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => copyToClipboard(viewingCard.street || '', '街道地址')}
                  >
                    <div>
                      <Label className="text-sm text-muted-foreground">街道地址</Label>
                      <div className="font-mono text-sm">{viewingCard.street || '-'}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(viewingCard.street || '', '街道地址');
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => copyToClipboard(viewingCard.city || '', '城市')}
                    >
                      <div>
                        <Label className="text-sm text-muted-foreground">城市</Label>
                        <div className="font-mono text-sm">{viewingCard.city || '-'}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(viewingCard.city || '', '城市');
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => copyToClipboard(viewingCard.county || '', '州/省')}
                    >
                      <div>
                        <Label className="text-sm text-muted-foreground">州/省</Label>
                        <div className="font-mono text-sm">{viewingCard.county || '-'}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(viewingCard.county || '', '州/省');
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => copyToClipboard(viewingCard.postcode || '', '邮编')}
                    >
                      <div>
                        <Label className="text-sm text-muted-foreground">邮政编码</Label>
                        <div className="font-mono text-sm">{viewingCard.postcode || '-'}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(viewingCard.postcode || '', '邮编');
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => copyToClipboard(viewingCard.country, '国家')}
                    >
                      <div>
                        <Label className="text-sm text-muted-foreground">国家</Label>
                        <div className="font-mono text-sm">{viewingCard.country}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(viewingCard.country, '国家');
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 银行卡信息 */}
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  银行卡信息
                </h4>
                <div className="space-y-3">
                  <div 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => copyToClipboard(viewingCard.cardNumber, '卡号')}
                  >
                    <div>
                      <Label className="text-sm text-muted-foreground">卡号</Label>
                      <div className="font-mono text-sm">{viewingCard.cardNumber}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(viewingCard.cardNumber, '卡号');
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => copyToClipboard(viewingCard.expiryDate, '有效期')}
                    >
                      <div>
                        <Label className="text-sm text-muted-foreground">有效期</Label>
                        <div className="font-mono text-sm">{viewingCard.expiryDate}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(viewingCard.expiryDate, '有效期');
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => copyToClipboard(viewingCard.cvv, 'CVV')}
                    >
                      <div>
                        <Label className="text-sm text-muted-foreground">CVV</Label>
                        <div className="font-mono text-sm">{viewingCard.cvv}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(viewingCard.cvv, 'CVV');
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 账户状态信息 */}
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  账户状态
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-sm text-muted-foreground">账户余额</Label>
                        <div className="font-mono text-sm mt-1">{viewingCard.currency} {viewingCard.balance.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-sm text-muted-foreground">卡片状态</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="secondary" 
                            className={`${statusLabels[viewingCard.status].color} text-white`}
                          >
                            {statusLabels[viewingCard.status].label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <Label className="text-sm text-muted-foreground">创建时间</Label>
                      <div className="text-sm">{formatDate(viewingCard.createdAt)}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <Label className="text-sm text-muted-foreground">最后使用</Label>
                      <div className="text-sm">{formatDate(viewingCard.lastUsed)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑虚拟卡</DialogTitle>
            <DialogDescription>
              修改虚拟卡信息，请谨慎操作
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* 持卡人信息 */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                持卡人信息
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-firstName">名字 *</Label>
                  <Input
                    id="edit-firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lastName">姓氏 *</Label>
                  <Input
                    id="edit-lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* 地址信息 */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                地址信息
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-street">街道地址</Label>
                  <Input
                    id="edit-street"
                    placeholder="KIRIKASAMMA QUARTERS, HADEJIA"
                    value={formData.street}
                    onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-city">城市</Label>
                    <Input
                      id="edit-city"
                      placeholder="Hadejia"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-county">州/省</Label>
                    <Input
                      id="edit-county"
                      placeholder="Jigawa"
                      value={formData.county}
                      onChange={(e) => setFormData(prev => ({ ...prev, county: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-postcode">邮编</Label>
                    <Input
                      id="edit-postcode"
                      placeholder="732101"
                      value={formData.postcode}
                      onChange={(e) => setFormData(prev => ({ ...prev, postcode: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-country">国家</Label>
                  <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.flag} {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* 银行卡信息 */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                银行卡信息
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-cardNumber">卡号 *</Label>
                  <Input
                    id="edit-cardNumber"
                    placeholder="4183960034898921"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value.replace(/\D/g, '') }))}
                    maxLength={16}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-expiryDate">有效期 (MM/YY)</Label>
                    <Input
                      id="edit-expiryDate"
                      placeholder="07/28"
                      value={formData.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.substring(0,2) + '/' + value.substring(2,4);
                        }
                        setFormData(prev => ({ ...prev, expiryDate: value }));
                      }}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-cvv">CVV</Label>
                    <Input
                      id="edit-cvv"
                      placeholder="028"
                      value={formData.cvv}
                      onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                      maxLength={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phoneNumber">手机号</Label>
                    <Input
                      id="edit-phoneNumber"
                      placeholder="+234 9045435782"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* 管理信息 */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                管理信息
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-balance">余额</Label>
                  <Input
                    id="edit-balance"
                    type="number"
                    placeholder="450.00"
                    value={formData.balance}
                    onChange={(e) => setFormData(prev => ({ ...prev, balance: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-currency">货币</Label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">美元 (USD)</SelectItem>
                      <SelectItem value="NGN">尼日利亚奈拉 (NGN)</SelectItem>
                      <SelectItem value="EUR">欧元 (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">状态</Label>
                  <Select value={formData.status} onValueChange={(value: VirtualCard['status']) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">正常</SelectItem>
                      <SelectItem value="suspended">暂停</SelectItem>
                      <SelectItem value="expired">过期</SelectItem>
                      <SelectItem value="blocked">冻结</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>


            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleUpdate}>
              保存更改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
