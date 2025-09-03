import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  TrendingDown,
  Package,
  DollarSign,
  Users,
  Clock,
  Bot,
  Sparkles
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  provider: 'openai' | 'anthropic';
  originalPrice: number; // 我们的售价
  costPrice: number; // 我们的成本价
  stock: number;
  sold: number;
  status: 'active' | 'inactive' | 'soldout';
  category: 'plus' | 'pro' | 'max-5x' | 'max-20x';
  officialPriceUsd: number; // 官方月费(美元)
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'chatgpt-plus',
      name: 'ChatGPT-Plus',
      description: '支持高级推理功能的 GPT-5，扩展的消息和上传限额，扩展且较快的图片生成',
      provider: 'openai',
      originalPrice: 19, // $20 * 0.95
      costPrice: 10,
      stock: 156,
      sold: 2347,
      status: 'active',
      category: 'plus',
      officialPriceUsd: 20,
      features: ['GPT-5 访问权限', '扩展的消息和上传限额', '扩展且较快的图片生成', '扩展的记忆和背景信息', '项目、任务、自定义 GPT', 'Sora 视频生成', 'Codex 代理'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: 'chatgpt-pro',
      name: 'ChatGPT-Pro',
      description: '对 ChatGPT 最佳功能的全面访问权限，支持专业推理功能的 GPT-5',
      provider: 'openai',
      originalPrice: 190, // $200 * 0.95
      costPrice: 135,
      stock: 89,
      sold: 567,
      status: 'active',
      category: 'pro',
      officialPriceUsd: 200,
      features: ['支持专业推理功能的 GPT-5', '无限的消息和上传限额', '无限且较快的图片生成', '全面的记忆和背景信息', '全面的深入研究和代理模式', '扩展的项目、任务和自定义 GPT', '扩展的 Sora 视频生成', '扩展的 Codex 代理', '新功能的研究预览'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-18'
    },
    {
      id: 'claude-pro',
      name: 'Claude-Pro',
      description: '日常生产力的理想选择，访问Claude Code、无限Projects、Research功能',
      provider: 'anthropic',
      originalPrice: 19, // $20 * 0.95
      costPrice: 10,
      stock: 234,
      sold: 1856,
      status: 'active',
      category: 'pro',
      officialPriceUsd: 20,
      features: ['更多使用量限制', '访问Claude Code终端', '无限Projects组织', '访问Research功能', '连接Google Workspace', '连接日常工具(MCP服务器)', '扩展思维处理', '使用更多Claude模型'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-19'
    },
    {
      id: 'claude-max-5x',
      name: 'Claude-Max (5x)',
      description: '充分发挥Claude潜力，5倍于Pro的使用量，更高输出限制',
      provider: 'anthropic',
      originalPrice: 95, // $100 * 0.95
      costPrice: 68,
      stock: 67,
      sold: 423,
      status: 'active',
      category: 'max-5x',
      officialPriceUsd: 100,
      features: ['Pro版所有功能', '5倍于Pro的使用量', '更高输出限制', '高级Claude功能抢先体验', '高流量时段优先访问'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-17'
    },
    {
      id: 'claude-max-20x',
      name: 'Claude-Max (20x)',
      description: 'Claude最高级别套餐，20倍于Pro的使用量，适合重度使用场景',
      provider: 'anthropic',
      originalPrice: 190, // $200 * 0.95
      costPrice: 135,
      stock: 23,
      sold: 89,
      status: 'active',
      category: 'max-20x',
      officialPriceUsd: 200, // 修正为$200
      features: ['Pro版所有功能', '20倍于Pro的使用量', '最高输出限制', '高级Claude功能抢先体验', '最高优先级访问', '专属客户支持'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-16'
    }
  ]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'soldout': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Product['status']) => {
    switch (status) {
      case 'active': return '销售中';
      case 'inactive': return '已下架';
      case 'soldout': return '售罄';
      default: return status;
    }
  };

  const getProviderColor = (provider: Product['provider']) => {
    switch (provider) {
      case 'openai': return 'bg-green-100 text-green-800';
      case 'anthropic': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProviderText = (provider: Product['provider']) => {
    switch (provider) {
      case 'openai': return 'OpenAI';
      case 'anthropic': return 'Anthropic';
      default: return provider;
    }
  };

  const getCategoryText = (category: Product['category']) => {
    switch (category) {
      case 'plus': return 'ChatGPT-Plus';
      case 'pro': return category.includes('claude') ? 'Claude-Pro' : 'ChatGPT-Pro';
      case 'max-5x': return 'Claude-Max (5x)';
      case 'max-20x': return 'Claude-Max (20x)';
      default: return category;
    }
  };

  const getCategoryDisplayText = (product: Product) => {
    const { provider, category } = product;
    if (provider === 'openai') {
      return category === 'plus' ? 'ChatGPT-Plus' : 'ChatGPT-Pro';
    } else {
      switch (category) {
        case 'pro': return 'Claude-Pro';
        case 'max-5x': return 'Claude-Max (5x)';
        case 'max-20x': return 'Claude-Max (20x)';
        default: return category;
      }
    }
  };

  const getCategoryColor = (category: Product['category']) => {
    switch (category) {
      case 'plus': return 'bg-blue-100 text-blue-800';
      case 'pro': return 'bg-purple-100 text-purple-800';
      case 'max-5x': return 'bg-orange-100 text-orange-800';
      case 'max-20x': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleSaveProduct = () => {
    if (editingProduct.id) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...editingProduct, updatedAt: new Date().toISOString().split('T')[0] }
          : p
      ));
    } else {
      // 新建产品
      const newProduct: Product = {
        ...editingProduct as Product,
        id: `product-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setProducts([...products, newProduct]);
    }
    setIsEditDialogOpen(false);
    setEditingProduct({});
  };

  const handleToggleStatus = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
        : p
    ));
  };

  const calculateProfitMargin = (salePrice: number, costPrice: number) => {
    return (((salePrice - costPrice) / salePrice) * 100).toFixed(1);
  };

  // 计算折扣比例（相对于官方价格）
  const calculateDiscountRate = (salePrice: number, officialPrice: number) => {
    return (((officialPrice - salePrice) / officialPrice) * 100).toFixed(0);
  };

  const totalStats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.status === 'active').length,
    totalStock: products.reduce((sum, p) => sum + p.stock, 0),
    totalSold: products.reduce((sum, p) => sum + p.sold, 0),
    totalRevenue: products.reduce((sum, p) => sum + (p.sold * p.originalPrice), 0),
    totalCost: products.reduce((sum, p) => sum + (p.sold * p.costPrice), 0),
    openaiProducts: products.filter(p => p.provider === 'openai').length,
    anthropicProducts: products.filter(p => p.provider === 'anthropic').length
  };

  const avgProfitMargin = totalStats.totalRevenue > 0 
    ? (((totalStats.totalRevenue - totalStats.totalCost) / totalStats.totalRevenue) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6 p-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">商品总数</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {totalStats.activeProducts} 个在售
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OpenAI</CardTitle>
            <Bot className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalStats.openaiProducts}</div>
            <p className="text-xs text-muted-foreground">
              套餐数量
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anthropic</CardTitle>
            <Sparkles className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalStats.anthropicProducts}</div>
            <p className="text-xs text-muted-foreground">
              套餐数量
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总库存</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalStock}</div>
            <p className="text-xs text-muted-foreground">
              可售账号数量
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">累计销量</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalSold.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              历史总销量
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">累计收入</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              平均利润率 {avgProfitMargin}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="list">商品列表</TabsTrigger>
            <TabsTrigger value="analytics">销售分析</TabsTrigger>
          </TabsList>
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingProduct({
                  name: '',
                  description: '',
                  provider: 'openai',
                  originalPrice: 0,
                  costPrice: 0,
                  stock: 0,
                  sold: 0,
                  status: 'active',
                  category: 'plus',
                  officialPriceUsd: 0,
                  features: []
                });
              }}>
                <Plus className="w-4 h-4 mr-2" />
                新增商品
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct.id ? '编辑商品' : '新增商品'}
                </DialogTitle>
                <DialogDescription>
                  配置商品信息、价格和库存设置 (售价默认为官方价格的95折)
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2">
                  <Label htmlFor="name">商品名称</Label>
                  <Input
                    id="name"
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="输入商品名称"
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="description">商品描述</Label>
                  <Textarea
                    id="description"
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    placeholder="输入商品描述"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="provider">服务提供商</Label>
                  <Select
                    value={editingProduct.provider}
                    onValueChange={(value) => setEditingProduct({ ...editingProduct, provider: value as Product['provider'] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择提供商" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="category">套餐类别</Label>
                  <Select
                    value={editingProduct.category}
                    onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value as Product['category'] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择类别" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plus">Plus</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="max-5x">Max (5x)</SelectItem>
                      <SelectItem value="max-20x">Max (20x)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="officialPriceUsd">官方月费 (USD)</Label>
                  <Input
                    id="officialPriceUsd"
                    type="number"
                    value={editingProduct.officialPriceUsd || ''}
                    onChange={(e) => {
                      const officialPrice = Number(e.target.value);
                      setEditingProduct({ 
                        ...editingProduct, 
                        officialPriceUsd: officialPrice,
                        // 自动计算95折售价
                        originalPrice: Math.round(officialPrice * 0.95)
                      });
                    }}
                    placeholder="官方月费"
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">状态</Label>
                  <Select
                    value={editingProduct.status}
                    onValueChange={(value) => setEditingProduct({ ...editingProduct, status: value as Product['status'] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">销售中</SelectItem>
                      <SelectItem value="inactive">已下架</SelectItem>
                      <SelectItem value="soldout">售罄</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="originalPrice">售价 (USD)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    placeholder="我们的售价 (建议官方价格*0.95)"
                  />
                </div>
                
                <div>
                  <Label htmlFor="costPrice">成本价 (USD)</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    value={editingProduct.costPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, costPrice: Number(e.target.value) })}
                    placeholder="我们的成本价"
                  />
                </div>
                
                <div>
                  <Label htmlFor="stock">库存数量</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={editingProduct.stock || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    placeholder="库存数量"
                  />
                </div>
                
                <div>
                  <Label>折扣率 / 利润率</Label>
                  <div className="space-y-1">
                    <Input
                      value={editingProduct.officialPriceUsd && editingProduct.originalPrice 
                        ? `${calculateDiscountRate(editingProduct.originalPrice, editingProduct.officialPriceUsd)}% 折扣`
                        : '折扣率'
                      }
                      disabled
                      className="bg-muted text-xs"
                    />
                    <Input
                      value={editingProduct.originalPrice && editingProduct.costPrice 
                        ? `${calculateProfitMargin(editingProduct.originalPrice, editingProduct.costPrice)}% 利润`
                        : '利润率'
                      }
                      disabled
                      className="bg-muted text-xs"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleSaveProduct}>
                  {editingProduct.id ? '保存' : '创建'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>商品管理</CardTitle>
              <CardDescription>
                管理所有 OpenAI 和 Anthropic 订阅套餐 (统一95折定价策略)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>商品信息</TableHead>
                    <TableHead>提供商</TableHead>
                    <TableHead>标签</TableHead>
                    <TableHead>官方价格</TableHead>
                    <TableHead>我们售价</TableHead>
                    <TableHead>成本价</TableHead>
                    <TableHead>库存/销量</TableHead>
                    <TableHead>利润率</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getProviderColor(product.provider)}>
                          {getProviderText(product.provider)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getCategoryColor(product.category)}>
                          {getCategoryDisplayText(product)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${product.officialPriceUsd}/月</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-green-600">${product.originalPrice}</div>
                          <div className="text-xs text-muted-foreground">
                            {calculateDiscountRate(product.originalPrice, product.officialPriceUsd)}% off
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-red-600">${product.costPrice}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">库存: {product.stock}</div>
                          <div className="text-sm text-muted-foreground">
                            销量: {product.sold}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-green-600 font-medium">
                          {calculateProfitMargin(product.originalPrice, product.costPrice)}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(product.status)}>
                          {getStatusText(product.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(product.id)}
                          >
                            {product.status === 'active' ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>销量排行</CardTitle>
                <CardDescription>各商品销售表现对比</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {products
                  .sort((a, b) => b.sold - a.sold)
                  .map((product, index) => (
                    <div key={product.id} className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{getCategoryDisplayText(product)}</span>
                            <Badge variant="outline" className={getProviderColor(product.provider)}>
                              {getProviderText(product.provider)}
                            </Badge>
                          </div>
                          <span className="text-sm font-medium">{product.sold}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 mt-1">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ 
                              width: `${(product.sold / Math.max(...products.map(p => p.sold))) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>收入贡献</CardTitle>
                <CardDescription>各商品收入占比分析</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {products
                  .sort((a, b) => (b.sold * b.originalPrice) - (a.sold * a.originalPrice))
                  .map((product, index) => {
                    const revenue = product.sold * product.originalPrice;
                    const percentage = ((revenue / totalStats.totalRevenue) * 100).toFixed(1);
                    return (
                      <div key={product.id} className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs font-medium text-green-700">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{getCategoryDisplayText(product)}</span>
                              <Badge variant="outline" className={getProviderColor(product.provider)}>
                                {getProviderText(product.provider)}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">${revenue.toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground">{percentage}%</div>
                            </div>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>定价策略分析</CardTitle>
                <CardDescription>95折定价策略效果分析</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {products.map((product) => {
                    const discountRate = calculateDiscountRate(product.originalPrice, product.officialPriceUsd);
                    const profitMargin = calculateProfitMargin(product.originalPrice, product.costPrice);
                    const savings = product.officialPriceUsd - product.originalPrice;
                    
                    return (
                      <div key={product.id} className="p-4 border rounded-lg space-y-2">
                        <div className="font-medium text-sm">{getCategoryDisplayText(product)}</div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">官方:</span>
                            <span>${product.officialPriceUsd}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">售价:</span>
                            <span className="text-green-600">${product.originalPrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">成本:</span>
                            <span className="text-red-600">${product.costPrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">节省:</span>
                            <span className="text-blue-600">${savings}</span>
                          </div>
                          <div className="flex justify-between border-t pt-1">
                            <span className="text-muted-foreground">折扣率:</span>
                            <span className="font-medium">{discountRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">利润率:</span>
                            <span className="font-medium text-green-600">{profitMargin}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>提供商对比</CardTitle>
                <CardDescription>OpenAI vs Anthropic 销售数据对比</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-8">
                  {(['openai', 'anthropic'] as const).map((provider) => {
                    const providerProducts = products.filter(p => p.provider === provider);
                    const totalSold = providerProducts.reduce((sum, p) => sum + p.sold, 0);
                    const totalRevenue = providerProducts.reduce((sum, p) => sum + (p.sold * p.originalPrice), 0);
                    const totalCost = providerProducts.reduce((sum, p) => sum + (p.sold * p.costPrice), 0);
                    const profitMargin = totalRevenue > 0 ? (((totalRevenue - totalCost) / totalRevenue) * 100).toFixed(1) : '0.0';
                    
                    return (
                      <div key={provider} className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getProviderColor(provider)}>
                            {getProviderText(provider)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {providerProducts.length} 个套餐
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-2xl font-bold">{totalSold.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">总销量</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-lg font-medium">${totalRevenue.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">总收入</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-lg font-medium text-green-600">{profitMargin}%</div>
                          <div className="text-sm text-muted-foreground">利润率</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}