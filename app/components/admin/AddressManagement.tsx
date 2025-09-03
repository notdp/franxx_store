import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { toast } from 'sonner';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  MapPin,
  User,
  Building,
  Globe
} from 'lucide-react';

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  street: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

const countries = [
  { value: 'Nigeria', label: '尼日利亚 (Nigeria)', flag: '🇳🇬' },
  { value: 'Kenya', label: '肯尼亚 (Kenya)', flag: '🇰🇪' },
  { value: 'Ghana', label: '加纳 (Ghana)', flag: '🇬🇭' },
  { value: 'South Africa', label: '南非 (South Africa)', flag: '🇿🇦' },
  { value: 'United States', label: '美国 (United States)', flag: '🇺🇸' },
  { value: 'United Kingdom', label: '英国 (United Kingdom)', flag: '🇬🇧' },
  { value: 'Canada', label: '加拿大 (Canada)', flag: '🇨🇦' }
];

export function AddressManagement() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [filteredAddresses, setFilteredAddresses] = useState<Address[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState<string>('all');

  // 表单状态
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    county: '',
    postcode: '',
    country: 'Nigeria',
    isDefault: false
  });

  // 模拟数据
  useEffect(() => {
    const mockAddresses: Address[] = [
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
        isDefault: true,
        createdAt: '2024-01-15T08:30:00Z',
        updatedAt: '2024-01-25T14:22:00Z'
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
        isDefault: false,
        createdAt: '2024-01-20T12:00:00Z',
        updatedAt: '2024-01-24T16:30:00Z'
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
        isDefault: false,
        createdAt: '2024-01-18T14:20:00Z',
        updatedAt: '2024-01-22T11:10:00Z'
      }
    ];
    setAddresses(mockAddresses);
    setFilteredAddresses(mockAddresses);
  }, []);

  // 搜索和过滤
  useEffect(() => {
    let filtered = addresses;

    if (searchTerm) {
      filtered = filtered.filter(address =>
        address.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.county.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.postcode.includes(searchTerm)
      );
    }

    if (countryFilter !== 'all') {
      filtered = filtered.filter(address => address.country === countryFilter);
    }

    setFilteredAddresses(filtered);
  }, [addresses, searchTerm, countryFilter]);

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      county: '',
      postcode: '',
      country: 'Nigeria',
      isDefault: false
    });
  };

  const handleCreate = () => {
    if (!formData.firstName || !formData.lastName || !formData.street || !formData.city) {
      toast.error('请填写必填字段');
      return;
    }

    const newAddress: Address = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      fullName: `${formData.firstName} ${formData.lastName}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 如果设置为默认地址，取消其他地址的默认状态
    if (formData.isDefault) {
      setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
    }

    setAddresses(prev => [...prev, newAddress]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast.success('地址创建成功');
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      city: address.city,
      county: address.county,
      postcode: address.postcode,
      country: address.country,
      isDefault: address.isDefault
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingAddress) return;

    // 如果设置为默认地址，取消其他地址的默认状态
    if (formData.isDefault) {
      setAddresses(prev => prev.map(addr => 
        addr.id === editingAddress.id ? addr : { ...addr, isDefault: false }
      ));
    }

    setAddresses(prev =>
      prev.map(address =>
        address.id === editingAddress.id
          ? { 
              ...address, 
              ...formData, 
              fullName: `${formData.firstName} ${formData.lastName}`,
              updatedAt: new Date().toISOString() 
            }
          : address
      )
    );
    setIsEditDialogOpen(false);
    setEditingAddress(null);
    resetForm();
    toast.success('地址更新成功');
  };

  const handleDelete = (addressId: string) => {
    setAddresses(prev => prev.filter(address => address.id !== addressId));
    toast.success('地址删除成功');
  };

  const handleSetDefault = (addressId: string) => {
    setAddresses(prev => prev.map(address => ({
      ...address,
      isDefault: address.id === addressId
    })));
    toast.success('默认地址已更新');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const AddressForm = () => (
    <div className="space-y-6">
      {/* 基本信息 */}
      <div>
        <h4 className="font-medium mb-3 flex items-center">
          <User className="w-4 h-4 mr-2" />
          基本信息
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

      {/* 地址信息 */}
      <div>
        <h4 className="font-medium mb-3 flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          地址信息
        </h4>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="street">街道地址 *</Label>
            <Input
              id="street"
              placeholder="KIRIKASAMMA QUARTERS, HADEJIA"
              value={formData.street}
              onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">城市/城镇 *</Label>
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

      {/* 设置选项 */}
      <div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isDefault"
            checked={formData.isDefault}
            onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
            className="rounded"
          />
          <Label htmlFor="isDefault" className="text-sm">
            设为默认地址
          </Label>
        </div>
      </div>
    </div>
  );

  const totalAddresses = addresses.length;
  const defaultAddress = addresses.find(addr => addr.isDefault);
  const countryStats = addresses.reduce((acc, addr) => {
    acc[addr.country] = (acc[addr.country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">地址管理</h1>
          <p className="text-muted-foreground mt-1">
            管理收货地址信息，支持国际地址格式
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              新增地址
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>新增地址</DialogTitle>
              <DialogDescription>
                添加新的收货地址信息，请确保信息准确无误
              </DialogDescription>
            </DialogHeader>
            
            <AddressForm />

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleCreate}>
                创建地址
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总地址数</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAddresses}</div>
            <p className="text-xs text-muted-foreground">
              已管理地址
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">默认地址</CardTitle>
            <Building className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{defaultAddress?.city || '未设置'}</div>
            <p className="text-xs text-muted-foreground">
              {defaultAddress?.fullName || '无默认地址'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">主要国家</CardTitle>
            <Globe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {Object.keys(countryStats)[0] || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {countryStats[Object.keys(countryStats)[0]] || 0} 个地址
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">最近更新</CardTitle>
            <User className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {addresses.length > 0 ? formatDate(Math.max(...addresses.map(a => new Date(a.updatedAt).getTime())).toString()) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              最后更新时间
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和过滤 */}
      <Card>
        <CardHeader>
          <CardTitle>地址列表</CardTitle>
          <CardDescription>管理所有收货地址信息</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索姓名、地址信息..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部国家</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.flag} {country.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>收件人信息</TableHead>
                  <TableHead>完整地址</TableHead>
                  <TableHead>默认地址</TableHead>
                  <TableHead>更新时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAddresses.map((address) => (
                  <TableRow key={address.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{address.fullName}</div>
                        <div className="text-sm text-muted-foreground">
                          {address.country}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 max-w-xs">
                        <div className="text-sm">{address.street}</div>
                        <div className="text-sm text-muted-foreground">
                          {address.city}, {address.county} {address.postcode}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {address.isDefault ? (
                        <Badge variant="secondary" className="bg-green-500 text-white">
                          默认地址
                        </Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          设为默认
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(address.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(address)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(address.id)}
                          disabled={address.isDefault}
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

          {filteredAddresses.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || countryFilter !== 'all' ? '没有找到匹配的地址' : '暂无地址数据'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 编辑对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑地址</DialogTitle>
            <DialogDescription>
              修改地址信息，请谨慎操作
            </DialogDescription>
          </DialogHeader>
          
          <AddressForm />

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleUpdate}>
              更新地址
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}