import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { toast } from 'sonner';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Smartphone,
  Mail,
  Lock,
  Calendar,
  User,
  CreditCard,
  Shield,
  ShieldCheck,
  Link,
  Eye,
  EyeOff,
  X,
  CheckCircle
} from 'lucide-react';

interface SubscriptionService {
  id: string;
  name: string;
  email: string;
  expiryDate: string;
}

interface IOSAccount {
  id: string;
  email: string;
  password: string;
  birthDate: string;
  fullName: string;
  virtualCardNumber: string;
  status: 'active' | 'suspended' | 'banned' | 'pending';
  riskControlLifted: boolean;
  subscriptionServices: SubscriptionService[];
  createdAt: string;
  updatedAt: string;
}

const statusLabels = {
  active: { label: '正常', color: 'bg-green-500' },
  suspended: { label: '暂停', color: 'bg-yellow-500' },
  banned: { label: '封禁', color: 'bg-red-500' },
  pending: { label: '待激活', color: 'bg-gray-500' }
};

export function IOSAccountManagement() {
  const [accounts, setAccounts] = useState<IOSAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<IOSAccount[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<IOSAccount | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // 虚拟卡列表数据源
  const [virtualCards] = useState([
    { id: '1', cardNumber: '4183960034898921', holderName: 'Fiddausi Muhamamd', status: 'active' },
    { id: '2', cardNumber: '5412987654321098', holderName: 'Ahmed Ibrahim', status: 'active' },
    { id: '3', cardNumber: '6011234567890123', holderName: 'Fatima Hassan', status: 'suspended' },
    { id: '4', cardNumber: '4532123456789012', holderName: 'John Smith', status: 'active' },
    { id: '5', cardNumber: '5555444433332222', holderName: 'Sarah Johnson', status: 'active' }
  ]);

  // 可用订阅服务列表
  const availableServices = [
    { id: 'chatgpt-pro', name: 'ChatGPT Pro' },
    { id: 'claude-pro', name: 'Claude Pro' },
    { id: 'claude-max-100', name: 'Claude Max 100' },
    { id: 'claude-max-200', name: 'Claude Max 200' }
  ];

  // 表单状态
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    birthDate: '',
    fullName: '',
    virtualCardNumber: '',
    status: 'pending' as IOSAccount['status'],
    riskControlLifted: false,
    subscriptionServices: [] as SubscriptionService[]
  });

  // 模拟数据
  useEffect(() => {
    const mockAccounts: IOSAccount[] = [
      {
        id: '1',
        email: 'ios.user.001@icloud.com',
        password: 'SecurePass123!',
        birthDate: '1995-06-15',
        fullName: 'John Smith',
        virtualCardNumber: '4532-1234-5678-9012',
        status: 'active',
        riskControlLifted: true,
        subscriptionServices: [
          { id: 'chatgpt-pro', name: 'ChatGPT Pro', email: 'john.chatgpt@gmail.com', expiryDate: '2024-12-31' },
          { id: 'claude-pro', name: 'Claude Pro', email: 'john.claude@gmail.com', expiryDate: '2024-11-30' }
        ],
        createdAt: '2024-01-15T08:30:00Z',
        updatedAt: '2024-01-20T14:22:00Z'
      },
      {
        id: '2',
        email: 'ios.user.002@gmail.com',
        password: 'MyPassword456',
        birthDate: '1992-03-22',
        fullName: 'Sarah Johnson',
        virtualCardNumber: '5412-9876-5432-1098',
        status: 'suspended',
        riskControlLifted: false,
        subscriptionServices: [
          { id: 'claude-max-100', name: 'Claude Max 100', email: 'sarah.claude@outlook.com', expiryDate: '2024-10-15' }
        ],
        createdAt: '2024-01-18T12:15:00Z',
        updatedAt: '2024-01-25T09:45:00Z'
      },
      {
        id: '3',
        email: 'ios.user.003@outlook.com',
        password: 'StrongPwd789',
        birthDate: '1988-11-08',
        fullName: 'Mike Chen',
        virtualCardNumber: '6011-2345-6789-0123',
        status: 'active',
        riskControlLifted: true,
        subscriptionServices: [],
        createdAt: '2024-01-22T16:20:00Z',
        updatedAt: '2024-01-22T16:20:00Z'
      }
    ];
    setAccounts(mockAccounts);
    setFilteredAccounts(mockAccounts);
  }, []);

  // 搜索和过滤
  useEffect(() => {
    let filtered = accounts;

    if (searchTerm) {
      filtered = filtered.filter(account =>
        account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.subscriptionServices.some(service => 
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(account => account.status === statusFilter);
    }

    setFilteredAccounts(filtered);
  }, [accounts, searchTerm, statusFilter]);

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      birthDate: '',
      fullName: '',
      virtualCardNumber: '',
      status: 'pending',
      riskControlLifted: false,
      subscriptionServices: []
    });
  };

  const handleCreate = () => {
    if (!formData.email || !formData.password || !formData.fullName) {
      toast.error('请填写必填字段');
      return;
    }

    const newAccount: IOSAccount = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setAccounts(prev => [...prev, newAccount]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast.success('iOS账号创建成功');
  };

  const handleEdit = (account: IOSAccount) => {
    setEditingAccount(account);
    setFormData({
      email: account.email,
      password: account.password,
      birthDate: account.birthDate,
      fullName: account.fullName,
      virtualCardNumber: account.virtualCardNumber,
      status: account.status,
      riskControlLifted: account.riskControlLifted,
      subscriptionServices: account.subscriptionServices
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingAccount) return;

    setAccounts(prev =>
      prev.map(account =>
        account.id === editingAccount.id
          ? { 
              ...account, 
              ...formData, 
              updatedAt: new Date().toISOString() 
            }
          : account
      )
    );
    setIsEditDialogOpen(false);
    setEditingAccount(null);
    resetForm();
    toast.success('iOS账号更新成功');
  };

  const handleDelete = (accountId: string) => {
    setAccounts(prev => prev.filter(account => account.id !== accountId));
    toast.success('iOS账号删除成功');
  };

  const togglePasswordVisibility = (accountId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  // 添加订阅服务到表单
  const addSubscriptionService = (serviceId: string) => {
    const serviceName = availableServices.find(s => s.id === serviceId)?.name || '';
    const newService: SubscriptionService = {
      id: serviceId,
      name: serviceName,
      email: '',
      expiryDate: ''
    };
    
    setFormData(prev => ({
      ...prev,
      subscriptionServices: [...prev.subscriptionServices, newService]
    }));
  };

  // 更新订阅服务信息
  const updateSubscriptionService = (index: number, field: keyof SubscriptionService, value: string) => {
    setFormData(prev => ({
      ...prev,
      subscriptionServices: prev.subscriptionServices.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  // 删除订阅服务
  const removeSubscriptionService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subscriptionServices: prev.subscriptionServices.filter((_, i) => i !== index)
    }));
  };

  // 订阅服务表单组件
  const SubscriptionServiceForm = () => (
    <div className="space-y-2 md:col-span-2">
      <Label>订阅服务</Label>
      <div className="space-y-4">
        {/* 当前订阅服务列表 */}
        {formData.subscriptionServices.map((service, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">{service.name}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSubscriptionService(index)}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">服务邮箱</Label>
                <Input
                  placeholder="service@example.com"
                  value={service.email}
                  onChange={(e) => updateSubscriptionService(index, 'email', e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs">到期时间</Label>
                <Input
                  type="date"
                  value={service.expiryDate}
                  onChange={(e) => updateSubscriptionService(index, 'expiryDate', e.target.value)}
                  className="h-8"
                />
              </div>
            </div>
          </div>
        ))}

        {/* 添加新订阅服务 */}
        <div>
          <Label className="text-sm">添加订阅服务</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            {availableServices.map((service) => {
              const isAdded = formData.subscriptionServices.some(s => s.id === service.id);
              return (
                <Button
                  key={service.id}
                  type="button"
                  variant={isAdded ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => !isAdded && addSubscriptionService(service.id)}
                  disabled={isAdded}
                  className={`h-8 text-xs ${isAdded ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isAdded && <CheckCircle className="h-3 w-3 mr-1" />}
                  {service.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">iOS账号管理</h1>
          <p className="text-muted-foreground mt-1">
            管理iOS设备账号，包括Apple ID和相关配置信息
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              新增账号
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>新增iOS账号</DialogTitle>
              <DialogDescription>
                创建新的iOS设备账号，请填写完整的账号信息
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">账号邮箱 *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">账号密码 *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="请输入密码"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">姓名 *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    placeholder="请输入姓名"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">出生日期</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="virtualCardNumber">虚拟卡卡号</Label>
                <Select value={formData.virtualCardNumber} onValueChange={(value) => setFormData(prev => ({ ...prev, virtualCardNumber: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择虚拟卡" />
                  </SelectTrigger>
                  <SelectContent>
                    {virtualCards.filter(card => card.status === 'active').map((card) => (
                      <SelectItem key={card.id} value={card.cardNumber}>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span className="font-mono">{card.cardNumber}</span>
                          <span className="text-sm text-muted-foreground">({card.holderName})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">账号状态</Label>
                <Select value={formData.status} onValueChange={(value: IOSAccount['status']) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">待激活</SelectItem>
                    <SelectItem value="active">正常</SelectItem>
                    <SelectItem value="suspended">暂停</SelectItem>
                    <SelectItem value="banned">封禁</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <SubscriptionServiceForm />

              <div className="flex items-center space-x-2 md:col-span-2">
                <Switch
                  id="riskControl"
                  checked={formData.riskControlLifted}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, riskControlLifted: checked }))}
                />
                <Label htmlFor="riskControl" className="text-sm">
                  已解除风控限制
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleCreate}>
                创建账号
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总账号数</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">正常账号</CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {accounts.filter(acc => acc.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">风控解除</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {accounts.filter(acc => acc.riskControlLifted).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">有订阅服务</CardTitle>
            <Link className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {accounts.filter(acc => acc.subscriptionServices.length > 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和过滤 */}
      <Card>
        <CardHeader>
          <CardTitle>账号列表</CardTitle>
          <CardDescription>管理所有iOS设备账号信息</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索邮箱、姓名或订阅服务..."
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
                  <SelectItem value="banned">封禁</SelectItem>
                  <SelectItem value="pending">待激活</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>邮箱</TableHead>
                  <TableHead>密码</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>风控</TableHead>
                  <TableHead>订阅服务</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">
                          {showPasswords[account.id] ? account.password : '••••••••'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePasswordVisibility(account.id)}
                          className="h-6 w-6 p-0"
                        >
                          {showPasswords[account.id] ? 
                            <EyeOff className="h-3 w-3" /> : 
                            <Eye className="h-3 w-3" />
                          }
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{account.fullName}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={`${statusLabels[account.status].color} text-white`}
                      >
                        {statusLabels[account.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {account.riskControlLifted ? (
                        <Badge variant="secondary" className="bg-green-500 text-white">已解除</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-red-500 text-white">未解除</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {account.subscriptionServices.length > 0 ? (
                        <div className="space-y-1">
                          {account.subscriptionServices.map((service) => (
                            <div key={service.id} className="group relative">
                              <Badge 
                                variant="secondary" 
                                className="bg-purple-500 text-white cursor-pointer"
                              >
                                {service.name}
                              </Badge>
                              <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 bottom-full left-0 mb-1 whitespace-nowrap">
                                <div>{service.email}</div>
                                <div>到期: {formatDate(service.expiryDate)}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">无订阅</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(account.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(account)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(account.id)}
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

          {filteredAccounts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || statusFilter !== 'all' ? '没有找到匹配的账号' : '暂无iOS账号数据'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 编辑对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑iOS账号</DialogTitle>
            <DialogDescription>
              修改账号信息，请谨慎操作
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">账号邮箱 *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-password">账号密码 *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="edit-password"
                  type="password"
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-fullName">姓名 *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="edit-fullName"
                  placeholder="请输入姓名"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-birthDate">出生日期</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="edit-birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-virtualCardNumber">虚拟卡卡号</Label>
              <Select value={formData.virtualCardNumber} onValueChange={(value) => setFormData(prev => ({ ...prev, virtualCardNumber: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="选择虚拟卡" />
                </SelectTrigger>
                <SelectContent>
                  {virtualCards.filter(card => card.status === 'active').map((card) => (
                    <SelectItem key={card.id} value={card.cardNumber}>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span className="font-mono">{card.cardNumber}</span>
                        <span className="text-sm text-muted-foreground">({card.holderName})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">账号状态</Label>
              <Select value={formData.status} onValueChange={(value: IOSAccount['status']) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">待激活</SelectItem>
                  <SelectItem value="active">正常</SelectItem>
                  <SelectItem value="suspended">暂停</SelectItem>
                  <SelectItem value="banned">封禁</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <SubscriptionServiceForm />

            <div className="flex items-center space-x-2 md:col-span-2">
              <Switch
                id="edit-riskControl"
                checked={formData.riskControlLifted}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, riskControlLifted: checked }))}
              />
              <Label htmlFor="edit-riskControl" className="text-sm">
                已解除风控限制
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleUpdate}>
              更新账号
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}