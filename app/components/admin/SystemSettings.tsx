import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Settings, Zap, Bell, Shield } from 'lucide-react';

export function SystemSettings() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">支付配置</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">正常</div>
            <p className="text-xs text-muted-foreground">支付接口状态</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">通知服务</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">运行中</div>
            <p className="text-xs text-muted-foreground">邮件/短信服务</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">安全设置</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">高</div>
            <p className="text-xs text-muted-foreground">安全等级</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">系统版本</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">v1.0.0</div>
            <p className="text-xs text-muted-foreground">当前版本</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>系统设置</CardTitle>
          <CardDescription>管理系统配置和基础设置</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">系统设置功能开发中...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}