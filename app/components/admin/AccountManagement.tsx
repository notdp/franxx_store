import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Mail, Plus, Upload, Search, Eye, EyeOff, Edit, Trash2, Phone, Smartphone } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Gmail账号类型定义
interface GmailAccount {
  id: string;
  email: string;
  password: string;
  status: 'normal' | 'chatgpt-banned' | 'claude-banned' | 'both-banned';
  phone: string;
  bindedIOSAccount?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export function GmailAccountManagement() {
  const [accounts, setAccounts] = useState<GmailAccount[]>([
    {
      id: 'gmail001',
      email: 'franxx.user.001@gmail.com',
      password: 'SecurePass123!',
      status: 'normal',
      phone: '+1-555-0101',
      bindedIOSAccount: 'iOS001',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      notes: '正常使用中'
    },
    {
      id: 'gmail002', 
      email: 'franxx.user.002@gmail.com',
      password: 'SecurePass456!',
      status: 'chatgpt-banned',
      phone: '+1-555-0102',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      notes: 'ChatGPT账号被封，Claude可用'
    },
    {
      id: 'gmail003',
      email: 'franxx.user.003@gmail.com', 
      password: 'SecurePass789!',
      status: 'claude-banned',
      phone: '+1-555-0103',
      bindedIOSAccount: 'iOS003',
      createdAt: '2024-01-16',
      updatedAt: '2024-01-22',
      notes: 'Claude账号被封，ChatGPT可用'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<GmailAccount | null>(null);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});

  // 表单状态
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    status: 'normal' as GmailAccount['status'],
    phone: '',
    bindedIOSAccount: '',
    notes: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'chatgpt-banned': return 'bg-red-100 text-red-800';
      case 'claude-banned': return 'bg-yellow-100 text-yellow-800';
      case 'both-banned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal': return '正常';
      case 'chatgpt-banned': return 'ChatGPT封禁';
      case 'claude-banned': return 'Claude封禁';
      case 'both-banned': return '全部封禁';
      default: return status;
    }
  };

  // 辅助函数
  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      status: 'normal',
      phone: '',
      bindedIOSAccount: '',
      notes: ''
    });
  };

  const handleAdd = () => {
    const newAccount: GmailAccount = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setAccounts(prev => [...prev, newAccount]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Gmail账号添加成功');
  };

  const handleEdit = (account: GmailAccount) => {
    setEditingAccount(account);
    setFormData({
      email: account.email,
      password: account.password,
      status: account.status,
      phone: account.phone,
      bindedIOSAccount: account.bindedIOSAccount || '',
      notes: account.notes || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingAccount) return;

    setAccounts(prev =>
      prev.map(account =>
        account.id === editingAccount.id
          ? { ...account, ...formData, updatedAt: new Date().toISOString() }
          : account
      )
    );
    setIsEditDialogOpen(false);
    setEditingAccount(null);
    resetForm();
    toast.success('Gmail账号更新成功');
  };

  const handleDelete = (id: string) => {
    setAccounts(prev => prev.filter(account => account.id !== id));
    toast.success('Gmail账号删除成功');
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // 统计数据
  const totalAccounts = accounts.length;
  const normalAccounts = accounts.filter(acc => acc.status === 'normal').length;
  const chatgptBannedAccounts = accounts.filter(acc => acc.status === 'chatgpt-banned').length;
  const claudeBannedAccounts = accounts.filter(acc => acc.status === 'claude-banned').length;

  return (
    <div className="space-y-6 p-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总账号数</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAccounts}</div>
            <p className="text-xs text-muted-foreground">Gmail 账号</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">正常账号</CardTitle>
            <Mail className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{normalAccounts}</div>
            <p className="text-xs text-muted-foreground">可正常使用</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ChatGPT封禁</CardTitle>
            <Mail className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chatgptBannedAccounts}</div>
            <p className="text-xs text-muted-foreground">ChatGPT不可用</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claude封禁</CardTitle>
            <Mail className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{claudeBannedAccounts}</div>
            <p className="text-xs text-muted-foreground">Claude不可用</p>
          </CardContent>
        </Card>
      </div>

      {/* Gmail账号管理 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gmail 账号管理</CardTitle>
              <CardDescription>管理所有Gmail账号，包括ChatGPT和Claude使用状态</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                批量导入
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    添加账号
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>添加Gmail账号</DialogTitle>
                    <DialogDescription>添加新的Gmail账号到系统中</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">邮箱地址</Label>
                      <Input
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="user@gmail.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">密码</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="输入密码"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">绑定手机号</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1-555-0101"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">账号状态</Label>
                      <Select value={formData.status} onValueChange={(value: GmailAccount['status']) => setFormData(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">正常</SelectItem>
                          <SelectItem value="chatgpt-banned">ChatGPT封禁</SelectItem>
                          <SelectItem value="claude-banned">Claude封禁</SelectItem>
                          <SelectItem value="both-banned">全部封禁</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ios-account">绑定iOS账号</Label>
                      <Input
                        id="ios-account"
                        value={formData.bindedIOSAccount}
                        onChange={(e) => setFormData(prev => ({ ...prev, bindedIOSAccount: e.target.value }))}
                        placeholder="iOS账号ID（可选）"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">备注</Label>
                      <Input
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="备注信息（可选）"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        取消
                      </Button>
                      <Button onClick={handleAdd}>
                        添加账号
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 搜索和筛选 */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="搜索Gmail邮箱..." className="pl-10" />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="normal">正常</SelectItem>
                <SelectItem value="chatgpt-banned">ChatGPT封禁</SelectItem>
                <SelectItem value="claude-banned">Claude封禁</SelectItem>
                <SelectItem value="both-banned">全部封禁</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gmail账号表格 */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gmail邮箱</TableHead>
                <TableHead>密码</TableHead>
                <TableHead>绑定手机</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>绑定iOS账号</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>备注</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>
                    <div className="font-mono text-sm">{account.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="font-mono text-sm">
                        {showPasswords[account.id] ? account.password : '••••••••••••'}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => togglePasswordVisibility(account.id)}
                        className="h-6 w-6"
                      >
                        {showPasswords[account.id] ? (
                          <EyeOff className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm">{account.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(account.status)}>
                      {getStatusText(account.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {account.bindedIOSAccount ? (
                      <div className="flex items-center space-x-1">
                        <Smartphone className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{account.bindedIOSAccount}</span>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">未绑定</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{new Date(account.createdAt).toLocaleDateString()}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm max-w-32 truncate" title={account.notes}>
                      {account.notes || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(account)}
                        className="h-8 w-8"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(account.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 编辑对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>编辑Gmail账号</DialogTitle>
            <DialogDescription>修改Gmail账号信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">邮箱地址</Label>
              <Input
                id="edit-email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="user@gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">密码</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="输入密码"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">绑定手机号</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1-555-0101"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">账号状态</Label>
              <Select value={formData.status} onValueChange={(value: GmailAccount['status']) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">正常</SelectItem>
                  <SelectItem value="chatgpt-banned">ChatGPT封禁</SelectItem>
                  <SelectItem value="claude-banned">Claude封禁</SelectItem>
                  <SelectItem value="both-banned">全部封禁</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-ios-account">绑定iOS账号</Label>
              <Input
                id="edit-ios-account"
                value={formData.bindedIOSAccount}
                onChange={(e) => setFormData(prev => ({ ...prev, bindedIOSAccount: e.target.value }))}
                placeholder="iOS账号ID（可选）"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">备注</Label>
              <Input
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="备注信息（可选）"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleUpdate}>
                保存更改
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}