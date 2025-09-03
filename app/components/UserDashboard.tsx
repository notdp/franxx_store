import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { 
  Settings, 
  Users, 
  Shield, 
  Calendar, 
  Crown, 
  Heart,
  Zap,
  Copy,
  ExternalLink,
  Plus,
  ArrowRight
} from "lucide-react";

interface UserDashboardProps {
  onLogin: () => void;
}

export function UserDashboard({ onLogin }: UserDashboardProps) {
  const { user } = useAuth();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // 模拟用户订阅数据
  const mockSubscription = {
    id: "sub_franxx_001",
    type: "partner", // solo, partner, squad
    franxx: {
      model: "Delphinium",
      name: "飞燕草",
      code: "FXX-015",
      color: "#3B82F6",
      accentColor: "#DBEAFE",
      tier: "advanced",
      plantation: "Plantation 13",
      magmaOutput: "85%"
    },
    status: "active",
    expiresAt: "2024-09-26",
    partnership: {
      stamenUser: {
        id: "pilot_015",
        name: "Code-015",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face&auto=format",
        role: "stamen"
      },
      pistilUser: {
        id: "pilot_002", 
        name: "驾驶员 002",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=face&auto=format",
        role: "pistil"
      },
      syncCode: "SYNC-FXX-015",
      monthlyFee: 99.5
    },
    squad: null // 当前未加入小队
  };

  const mockOrders = [
    {
      id: "ORD-001",
      date: "2024-08-26",
      franxx: "Chlorophytum",
      type: "双人驾驶启动",
      amount: 99.5,
      status: "completed"
    },
    {
      id: "ORD-002", 
      date: "2024-07-26",
      franxx: "Chlorophytum",
      type: "续费",
      amount: 99.5,
      status: "completed"
    }
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("同步码已复制到剪贴板");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle>需要驾驶员认证</CardTitle>
            <CardDescription>
              访问仪表盘需要先进行驾驶员身份认证
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onLogin} className="w-full">
              开始认证
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 p-4 pt-24">
      <div className="container mx-auto max-w-7xl">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-600">APE 系统连接中 · Plantation 13</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FRANXX 驾驶员仪表盘
          </h1>
          <p className="text-muted-foreground">管理你的机体状态、搭档信息和作战记录</p>
        </div>

        {/* 状态总览卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* FRANXX 状态 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full animate-pulse" 
                  style={{ backgroundColor: mockSubscription.franxx.color }}
                />
                {mockSubscription.franxx.model} ({mockSubscription.franxx.name})
              </CardTitle>
              <CardDescription>机体编号: {mockSubscription.franxx.code}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">驾驶模式</span>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">双人神经连接</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">岩浆核心</span>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    {mockSubscription.franxx.magmaOutput} 输出
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Plantation</span>
                  <span className="text-sm font-medium">{mockSubscription.franxx.plantation}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">作战周期至</span>
                  <span className="text-sm">2024-09-26</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 搭档信息 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                神经连接搭档
              </CardTitle>
              <CardDescription>Stamen & Pistil 双驾驶员系统</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={mockSubscription.partnership.stamenUser.avatar} />
                    <AvatarFallback>S</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{mockSubscription.partnership.stamenUser.name}</p>
                    <p className="text-xs text-muted-foreground">Stamen (主驾驶)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={mockSubscription.partnership.pistilUser.avatar} />
                    <AvatarFallback>P</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{mockSubscription.partnership.pistilUser.name}</p>
                    <p className="text-xs text-muted-foreground">Pistil (副驾驶)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 费用信息 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                岩浆能源费用
              </CardTitle>
              <CardDescription>当月能源分摊成本</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">原价</span>
                  <span className="text-sm line-through text-muted-foreground">¥199</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">双人优惠</span>
                  <span className="text-sm text-green-600">-50%</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">你的分摊</span>
                  <span className="text-lg font-bold text-primary">¥{mockSubscription.partnership.monthlyFee}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主要内容区域 */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="partnership">搭档管理</TabsTrigger>
            <TabsTrigger value="orders">订单历史</TabsTrigger>
            <TabsTrigger value="settings">设置</TabsTrigger>
          </TabsList>

          {/* 概览页面 */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 同步状态 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    同步状态
                  </CardTitle>
                  <CardDescription>与搭档的连接状态</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">同步码</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {mockSubscription.partnership.syncCode}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyCode(mockSubscription.partnership.syncCode)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>本月使用率</span>
                      <span>68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>

                  <div className="pt-2">
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      打开 ChatGPT
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 快速操作 */}
              <Card>
                <CardHeader>
                  <CardTitle>快速操作</CardTitle>
                  <CardDescription>常用功能快捷入口</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Plus className="w-5 h-5" />
                    <span className="text-sm">组建小队</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Users className="w-5 h-5" />
                    <span className="text-sm">寻找搭档</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Crown className="w-5 h-5" />
                    <span className="text-sm">升级机体</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm">续费</span>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* 小队推荐 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  小队推荐
                </CardTitle>
                <CardDescription>加入小队享受85折优惠，独立账号不用抢</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">第13部队</h4>
                      <p className="text-sm text-muted-foreground">还需要 2 台 FRANXX</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">招募中</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">优惠后价格：</span>
                      <span className="font-bold text-primary ml-1">¥169/月</span>
                      <span className="text-green-600 ml-2">省¥30</span>
                    </div>
                    <Button size="sm">
                      加入小队
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 搭档管理 */}
          <TabsContent value="partnership" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>搭档详情</CardTitle>
                <CardDescription>管理你的双人驾驶配置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Stamen */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-blue-600">Stamen (主驾驶)</h4>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={mockSubscription.partnership.stamenUser.avatar} />
                        <AvatarFallback>S</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{mockSubscription.partnership.stamenUser.name}</p>
                        <p className="text-sm text-muted-foreground">负责创建和管理账号</p>
                        <Badge variant="secondary" className="mt-1">已支付</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Pistil */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-pink-600">Pistil (副驾驶)</h4>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={mockSubscription.partnership.pistilUser.avatar} />
                        <AvatarFallback>P</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{mockSubscription.partnership.pistilUser.name}</p>
                        <p className="text-sm text-muted-foreground">共享使用权限</p>
                        <Badge variant="secondary" className="mt-1">已支付</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">使用安排</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <h5 className="font-medium mb-2">建议时间分配</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>周一-周三</span>
                            <span className="text-blue-600">Code-015</span>
                          </div>
                          <div className="flex justify-between">
                            <span>周四-周六</span>
                            <span className="text-pink-600">驾驶员 002</span>
                          </div>
                          <div className="flex justify-between">
                            <span>周日</span>
                            <span className="text-muted-foreground">协商使用</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-4">
                        <h5 className="font-medium mb-2">账号信息</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>邮箱</span>
                            <span className="font-mono">pilot@***.com</span>
                          </div>
                          <div className="flex justify-between">
                            <span>密码</span>
                            <span className="font-mono">***********</span>
                          </div>
                          <Button variant="outline" size="sm" className="w-full mt-2">
                            查看完整信息
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 订单历史 */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>订单历史</CardTitle>
                <CardDescription>查看你的所有驾驶记录</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{order.type}</p>
                          <Badge variant="outline">{order.franxx}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">订单号：{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">¥{order.amount}</p>
                        <Badge className="bg-green-100 text-green-700">已完成</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 设置 */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>账户设置</CardTitle>
                <CardDescription>管理你的驾驶员配置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">通知设置</div>
                      <div className="text-sm text-muted-foreground">管理推送和邮件通知</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">支付方式</div>
                      <div className="text-sm text-muted-foreground">管理自动续费设置</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">隐私设置</div>
                      <div className="text-sm text-muted-foreground">控制信息可见性</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">账户安全</div>
                      <div className="text-sm text-muted-foreground">密码和安全选项</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}