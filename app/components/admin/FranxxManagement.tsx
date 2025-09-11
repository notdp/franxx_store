import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Edit, 
  Eye, 
  EyeOff, 
  Zap,
  Shield,
  Heart,
  Users,
  Crown,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bot,
  Gauge,
  Package,
  Link,
  Unlink
} from 'lucide-react';
import { packages } from '@/data/mockData';

interface Pilot {
  id: string;
  code: string;
  name: string;
  role: 'stamen' | 'pistil';
  paracapacity: number;
  status: 'active' | 'standby' | 'offline';
}

interface FranxxUnit {
  id: string;
  name: string;
  code: string;
  type: 'ace' | 'commander' | 'scout' | 'artillery' | 'support' | 'standard';
  classification: 'legendary' | 'advanced' | 'standard';
  pilots: {
    stamen?: Pilot;
    pistil?: Pilot;
  };
  syncRate: number;
  status: 'active' | 'maintenance' | 'standby' | 'damaged';
  magmaEnergy: number;
  combatReadiness: number;
  features: string[];
  description: string;
  flowerTheme?: string;
  specialAbilities?: string[];
  boundProductId?: string; // 绑定的商品ID
}

export function FranxxManagement() {
  const [franxxUnits, setFranxxUnits] = useState<FranxxUnit[]>([
    {
      id: 'strelizia',
      name: 'Strelizia',
      code: 'STR-001',
      type: 'ace',
      classification: 'legendary',
      pilots: {
        pistil: { id: '002', code: '002', name: 'Zero Two', role: 'pistil', paracapacity: 100, status: 'active' },
        stamen: { id: '016', code: '016', name: 'Hiro', role: 'stamen', paracapacity: 95, status: 'active' }
      },
      syncRate: 98,
      status: 'active',
      magmaEnergy: 95,
      combatReadiness: 100,
      features: ['Beast Mode', 'High Mobility', 'Adaptive Combat'],
      description: '鹤望兰 - 最强大的FRANXX，拥有特殊的战斗能力和适应性',
      flowerTheme: '鹤望兰（Bird of Paradise）',
      specialAbilities: ['Beast Mode Transformation', 'Adaptive Neural Link', 'Enhanced Regeneration'],
      boundProductId: 'strelizia'
    },
    {
      id: 'delphinium',
      name: 'Delphinium',
      code: 'DLP-015',
      type: 'commander',
      classification: 'advanced',
      pilots: {
        pistil: { id: '015', code: '015', name: 'Ichigo', role: 'pistil', paracapacity: 88, status: 'active' },
        stamen: { id: '056', code: '056', name: 'Goro', role: 'stamen', paracapacity: 82, status: 'active' }
      },
      syncRate: 85,
      status: 'active',
      magmaEnergy: 88,
      combatReadiness: 92,
      features: ['Command Systems', 'Tactical Analysis', 'Squad Coordination'],
      description: '翠雀 - 指挥官用近战机，具有领导功能和战术分析能力',
      flowerTheme: '翠雀（Delphinium）',
      specialAbilities: ['Tactical Network', 'Leadership Protocol', 'Enhanced Sensors'],
      boundProductId: 'delphinium'
    },
    {
      id: 'argentea',
      name: 'Argentea',
      code: 'ARG-390',
      type: 'scout',
      classification: 'standard',
      pilots: {
        pistil: { id: '390', code: '390', name: 'Miku', role: 'pistil', paracapacity: 79, status: 'active' },
        stamen: { id: '666', code: '666', name: 'Zorome', role: 'stamen', paracapacity: 75, status: 'active' }
      },
      syncRate: 77,
      status: 'active',
      magmaEnergy: 82,
      combatReadiness: 85,
      features: ['High Speed', 'Stealth Mode', 'Reconnaissance'],
      description: '银莲花 - 近战侦察机，高机动性，擅长快速侦察和近战',
      flowerTheme: '银莲花（Anemone）',
      specialAbilities: ['Stealth Coating', 'High-Speed Movement', 'Advanced Radar'],
      boundProductId: 'argentea'
    },
    {
      id: 'genista',
      name: 'Genista',
      code: 'GEN-556',
      type: 'artillery',
      classification: 'advanced',
      pilots: {
        pistil: { id: '556', code: '556', name: 'Kokoro', role: 'pistil', paracapacity: 81, status: 'active' },
        stamen: { id: '214', code: '214', name: 'Futoshi', role: 'stamen', paracapacity: 78, status: 'active' }
      },
      syncRate: 80,
      status: 'maintenance',
      magmaEnergy: 0,
      combatReadiness: 65,
      features: ['Heavy Artillery', 'Long Range', 'Siege Capability'],
      description: '报春花 - 攻城炮击机，重型火力支援，擅长远程攻击',
      flowerTheme: '报春花（Genista）',
      specialAbilities: ['Siege Mode', 'Heavy Cannon', 'Fortification Buster']
    },
    {
      id: 'chlorophytum',
      name: 'Chlorophytum',
      code: 'CHL-196',
      type: 'support',
      classification: 'advanced',
      pilots: {
        pistil: { id: '196', code: '196', name: 'Ikuno', role: 'pistil', paracapacity: 84, status: 'active' },
        stamen: { id: '326', code: '326', name: 'Mitsuru', role: 'stamen', paracapacity: 80, status: 'active' }
      },
      syncRate: 82,
      status: 'standby',
      magmaEnergy: 70,
      combatReadiness: 88,
      features: ['Fire Support', 'Shield Generation', 'Energy Distribution'],
      description: '绿萝 - 远程火力支援机，提供火力支援和能量分配',
      flowerTheme: '绿萝（Spider Plant）',
      specialAbilities: ['Energy Shield', 'Support Fire', 'Power Distribution']
    }
  ]);

  const [pilots, setPilots] = useState<Pilot[]>([
    { id: '002', code: '002', name: 'Zero Two', role: 'pistil', paracapacity: 100, status: 'active' },
    { id: '016', code: '016', name: 'Hiro', role: 'stamen', paracapacity: 95, status: 'active' },
    { id: '015', code: '015', name: 'Ichigo', role: 'pistil', paracapacity: 88, status: 'active' },
    { id: '056', code: '056', name: 'Goro', role: 'stamen', paracapacity: 82, status: 'active' },
    { id: '390', code: '390', name: 'Miku', role: 'pistil', paracapacity: 79, status: 'active' },
    { id: '666', code: '666', name: 'Zorome', role: 'stamen', paracapacity: 75, status: 'active' },
    { id: '556', code: '556', name: 'Kokoro', role: 'pistil', paracapacity: 81, status: 'active' },
    { id: '214', code: '214', name: 'Futoshi', role: 'stamen', paracapacity: 78, status: 'active' },
    { id: '196', code: '196', name: 'Ikuno', role: 'pistil', paracapacity: 84, status: 'active' },
    { id: '326', code: '326', name: 'Mitsuru', role: 'stamen', paracapacity: 80, status: 'active' }
  ]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFranxx, setEditingFranxx] = useState<Partial<FranxxUnit>>({});

  const getStatusColor = (status: FranxxUnit['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'standby': return 'bg-blue-100 text-blue-800';
      case 'damaged': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: FranxxUnit['status']) => {
    switch (status) {
      case 'active': return '运行中';
      case 'maintenance': return '维护中';
      case 'standby': return '待命';
      case 'damaged': return '受损';
      default: return status;
    }
  };

  const getClassificationColor = (classification: FranxxUnit['classification']) => {
    switch (classification) {
      case 'legendary': return 'bg-red-100 text-red-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClassificationText = (classification: FranxxUnit['classification']) => {
    switch (classification) {
      case 'legendary': return '传奇级';
      case 'advanced': return '高级型';
      case 'standard': return '标准型';
      default: return classification;
    }
  };

  const getTypeIcon = (type: FranxxUnit['type']) => {
    switch (type) {
      case 'ace': return Crown;
      case 'commander': return Shield;
      case 'scout': return Zap;
      case 'artillery': return Target;
      case 'support': return Heart;
      case 'standard': return Bot;
      default: return Bot;
    }
  };

  const getTypeText = (type: FranxxUnit['type']) => {
    switch (type) {
      case 'ace': return '王牌机';
      case 'commander': return '指挥官机';
      case 'scout': return '侦察机';
      case 'artillery': return '炮击机';
      case 'support': return '支援机';
      case 'standard': return '标准机';
      default: return type;
    }
  };

  const getBoundProduct = (productId?: string) => {
    if (!productId) return null;
    return packages.find(pkg => pkg.id === productId);
  };

  const getAvailableProducts = () => {
    const boundProductIds = franxxUnits
      .filter(f => f.boundProductId)
      .map(f => f.boundProductId);
    
    return packages.filter(pkg => !boundProductIds.includes(pkg.id));
  };

  const handleEditFranxx = (franxx: FranxxUnit) => {
    setEditingFranxx(franxx);
    setIsEditDialogOpen(true);
  };

  const handleSaveFranxx = () => {
    if (editingFranxx.id) {
      setFranxxUnits(franxxUnits.map(f => 
        f.id === editingFranxx.id 
          ? { ...f, ...editingFranxx }
          : f
      ));
    }
    setIsEditDialogOpen(false);
    setEditingFranxx({});
  };

  const handleToggleStatus = (franxxId: string) => {
    setFranxxUnits(franxxUnits.map(f => 
      f.id === franxxId 
        ? { ...f, status: f.status === 'active' ? 'standby' : 'active' }
        : f
    ));
  };

  const handleBindProduct = (franxxId: string, productId: string | null) => {
    setFranxxUnits(franxxUnits.map(f => 
      f.id === franxxId 
        ? { ...f, boundProductId: productId || undefined }
        : f
    ));
  };

  const totalStats = {
    totalUnits: franxxUnits.length,
    activeUnits: franxxUnits.filter(f => f.status === 'active').length,
    maintenanceUnits: franxxUnits.filter(f => f.status === 'maintenance').length,
    avgSyncRate: franxxUnits.reduce((sum, f) => sum + f.syncRate, 0) / franxxUnits.length,
    activePilots: pilots.filter(p => p.status === 'active').length,
    avgParacapacity: pilots.reduce((sum, p) => sum + p.paracapacity, 0) / pilots.length,
    boundUnits: franxxUnits.filter(f => f.boundProductId).length
  };

  return (
    <div className="space-y-6 p-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">FRANXX 总数</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalUnits}</div>
            <p className="text-xs text-muted-foreground">
              {totalStats.activeUnits} 台运行中
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均同步率</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.avgSyncRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              神经连接稳定性
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">商品绑定</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.boundUnits}</div>
            <p className="text-xs text-muted-foreground">
              已绑定商品的机体
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">驾驶员状态</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.activePilots}</div>
            <p className="text-xs text-muted-foreground">
              平均适应性 {totalStats.avgParacapacity.toFixed(1)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="franxx-list" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="franxx-list">FRANXX 机体</TabsTrigger>
            <TabsTrigger value="pilots">驾驶员管理</TabsTrigger>
            <TabsTrigger value="product-binding">商品绑定</TabsTrigger>
          </TabsList>
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingFranxx({
                  name: '',
                  code: '',
                  type: 'standard',
                  classification: 'standard',
                  syncRate: 0,
                  status: 'standby',
                  magmaEnergy: 0,
                  combatReadiness: 0,
                  features: [],
                  description: ''
                });
              }}>
                <Plus className="w-4 h-4 mr-2" />
                新增 FRANXX
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingFranxx.id ? '编辑 FRANXX' : '新增 FRANXX'}
                </DialogTitle>
                <DialogDescription>
                  配置 FRANXX 机体信息和作战参数
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <Label htmlFor="name">机体名称</Label>
                  <Input
                    id="name"
                    value={editingFranxx.name || ''}
                    onChange={(e) => setEditingFranxx({ ...editingFranxx, name: e.target.value })}
                    placeholder="如：Strelizia"
                  />
                </div>
                
                <div>
                  <Label htmlFor="code">机体编号</Label>
                  <Input
                    id="code"
                    value={editingFranxx.code || ''}
                    onChange={(e) => setEditingFranxx({ ...editingFranxx, code: e.target.value })}
                    placeholder="如：STR-001"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">机体类型</Label>
                  <Select
                    value={editingFranxx.type}
                    onValueChange={(value) => setEditingFranxx({ ...editingFranxx, type: value as FranxxUnit['type'] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ace">王牌机</SelectItem>
                      <SelectItem value="commander">指挥官机</SelectItem>
                      <SelectItem value="scout">侦察机</SelectItem>
                      <SelectItem value="artillery">炮击机</SelectItem>
                      <SelectItem value="support">支援机</SelectItem>
                      <SelectItem value="standard">标准机</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="classification">机体等级</Label>
                  <Select
                    value={editingFranxx.classification}
                    onValueChange={(value) => setEditingFranxx({ ...editingFranxx, classification: value as FranxxUnit['classification'] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择等级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="legendary">传奇级</SelectItem>
                      <SelectItem value="advanced">高级型</SelectItem>
                      <SelectItem value="standard">标准型</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="syncRate">同步率 (%)</Label>
                  <Input
                    id="syncRate"
                    type="number"
                    min="0"
                    max="100"
                    value={editingFranxx.syncRate || ''}
                    onChange={(e) => setEditingFranxx({ ...editingFranxx, syncRate: Number(e.target.value) })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="magmaEnergy">岩浆能源 (%)</Label>
                  <Input
                    id="magmaEnergy"
                    type="number"
                    min="0"
                    max="100"
                    value={editingFranxx.magmaEnergy || ''}
                    onChange={(e) => setEditingFranxx({ ...editingFranxx, magmaEnergy: Number(e.target.value) })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="flowerTheme">花卉主题</Label>
                  <Input
                    id="flowerTheme"
                    value={editingFranxx.flowerTheme || ''}
                    onChange={(e) => setEditingFranxx({ ...editingFranxx, flowerTheme: e.target.value })}
                    placeholder="如：鹤望兰（Bird of Paradise）"
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">机体状态</Label>
                  <Select
                    value={editingFranxx.status}
                    onValueChange={(value) => setEditingFranxx({ ...editingFranxx, status: value as FranxxUnit['status'] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">运行中</SelectItem>
                      <SelectItem value="maintenance">维护中</SelectItem>
                      <SelectItem value="standby">待命</SelectItem>
                      <SelectItem value="damaged">受损</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="description">机体描述</Label>
                  <Textarea
                    id="description"
                    value={editingFranxx.description || ''}
                    onChange={(e) => setEditingFranxx({ ...editingFranxx, description: e.target.value })}
                    placeholder="描述机体特点和作战能力"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleSaveFranxx}>
                  {editingFranxx.id ? '保存' : '创建'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="franxx-list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>FRANXX 机体管理</CardTitle>
              <CardDescription>
                第13部队 FRANXX 机体状态监控与管理
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>机体信息</TableHead>
                    <TableHead>类型/等级</TableHead>
                    <TableHead>驾驶员配对</TableHead>
                    <TableHead>同步率</TableHead>
                    <TableHead>能源状态</TableHead>
                    <TableHead>绑定商品</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {franxxUnits.map((franxx) => {
                    const TypeIcon = getTypeIcon(franxx.type);
                    const boundProduct = getBoundProduct(franxx.boundProductId);
                    return (
                      <TableRow key={franxx.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium flex items-center gap-2">
                              <TypeIcon className="w-4 h-4 text-primary" />
                              {franxx.name}
                            </div>
                            <div className="text-sm text-muted-foreground">{franxx.code}</div>
                            {franxx.flowerTheme && (
                              <div className="text-xs text-blue-600">{franxx.flowerTheme}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline" className="text-xs">
                              {getTypeText(franxx.type)}
                            </Badge>
                            <Badge variant="outline" className={getClassificationColor(franxx.classification)}>
                              {getClassificationText(franxx.classification)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {franxx.pilots.pistil && (
                              <div className="text-sm flex items-center gap-1">
                                <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                                {franxx.pilots.pistil.name} ({franxx.pilots.pistil.code})
                              </div>
                            )}
                            {franxx.pilots.stamen && (
                              <div className="text-sm flex items-center gap-1">
                                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                {franxx.pilots.stamen.name} ({franxx.pilots.stamen.code})
                              </div>
                            )}
                            {(!franxx.pilots.pistil || !franxx.pilots.stamen) && (
                              <div className="text-xs text-red-500">配对不完整</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Progress value={franxx.syncRate} className="w-16 h-2" />
                              <span className="text-sm font-medium">{franxx.syncRate}%</span>
                            </div>
                            <div className={`text-xs ${franxx.syncRate >= 80 ? 'text-green-600' : franxx.syncRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {franxx.syncRate >= 80 ? '优秀' : franxx.syncRate >= 60 ? '良好' : '需改善'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Gauge className="w-3 h-3 text-blue-500" />
                              <span className="text-sm">{franxx.magmaEnergy}%</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              战备: {franxx.combatReadiness}%
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {boundProduct ? (
                            <div className="space-y-1">
                              <div className="text-sm font-medium flex items-center gap-1">
                                <Link className="w-3 h-3 text-green-500" />
                                {boundProduct.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ${boundProduct.salePrice}
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-red-500 flex items-center gap-1">
                              <Unlink className="w-3 h-3" />
                              未绑定
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(franxx.status)}>
                            {getStatusText(franxx.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditFranxx(franxx)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleStatus(franxx.id)}
                            >
                              {franxx.status === 'active' ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pilots" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>驾驶员管理</CardTitle>
              <CardDescription>
                Parasites 驾驶员状态与适应性监控
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>驾驶员信息</TableHead>
                    <TableHead>角色</TableHead>
                    <TableHead>适应性</TableHead>
                    <TableHead>当前机体</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pilots.map((pilot) => {
                    const assignedFranxx = franxxUnits.find(f => 
                      f.pilots.pistil?.id === pilot.id || f.pilots.stamen?.id === pilot.id
                    );
                    
                    return (
                      <TableRow key={pilot.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{pilot.name}</div>
                            <div className="text-sm text-muted-foreground">Code: {pilot.code}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={pilot.role === 'pistil' ? 'text-pink-600' : 'text-blue-600'}>
                            {pilot.role === 'pistil' ? 'Pistil (雌蕊)' : 'Stamen (雄蕊)'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Progress value={pilot.paracapacity} className="w-16 h-2" />
                              <span className="text-sm font-medium">{pilot.paracapacity}</span>
                            </div>
                            <div className={`text-xs ${pilot.paracapacity >= 90 ? 'text-green-600' : pilot.paracapacity >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {pilot.paracapacity >= 90 ? '精英' : pilot.paracapacity >= 70 ? '合格' : '待提升'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {assignedFranxx ? (
                            <div className="space-y-1">
                              <div className="text-sm font-medium">{assignedFranxx.name}</div>
                              <div className="text-xs text-muted-foreground">{assignedFranxx.code}</div>
                            </div>
                          ) : (
                            <span className="text-sm text-red-500">未分配</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={pilot.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {pilot.status === 'active' ? '就绪' : pilot.status === 'standby' ? '待命' : '离线'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="product-binding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>商品绑定管理</CardTitle>
              <CardDescription>
                管理 FRANXX 机体与商品的关联关系
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {franxxUnits.map((franxx) => {
                  const boundProduct = getBoundProduct(franxx.boundProductId);
                  const availableProducts = getAvailableProducts();
                  const TypeIcon = getTypeIcon(franxx.type);
                  
                  return (
                    <div key={franxx.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <TypeIcon className="w-6 h-6 text-primary" />
                        <div>
                          <div className="font-medium">{franxx.name}</div>
                          <div className="text-sm text-muted-foreground">{franxx.code} • {franxx.flowerTheme}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {boundProduct ? (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-green-600">
                              已绑定: {boundProduct.name}
                            </Badge>
                            <span className="text-sm text-muted-foreground">${boundProduct.salePrice}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleBindProduct(franxx.id, null)}
                            >
                              <Unlink className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Select
                              value=""
                              onValueChange={(value) => handleBindProduct(franxx.id, value)}
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="选择绑定商品" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableProducts.map((product) => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name} - ${product.salePrice}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Badge variant="outline" className="text-red-600">未绑定</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">绑定说明</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 每个机体只能绑定一个商品</li>
                  <li>• 每个商品只能被一个机体绑定</li>
                  <li>• 绑定后，用户购买该商品时将获得对应的机体访问权限</li>
                  <li>• 未绑定的机体将不会出现在商品展示中</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
