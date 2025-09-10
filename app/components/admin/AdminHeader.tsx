import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { 
  Bell,
  Activity,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { AdminPageType, getCurrentPageTitle } from './constants';

interface AdminHeaderProps {
  currentAdminPage: AdminPageType;
}

export function AdminHeader({ currentAdminPage }: AdminHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-sidebar">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="font-semibold text-lg">{getCurrentPageTitle(currentAdminPage)}</h1>
      </div>
      
      {/* 快速状态指示器 */}
      <div className="flex items-center space-x-4 ml-auto px-4">
        <div className="hidden md:flex items-center space-x-2 text-sm">
          <Activity className="w-4 h-4 text-green-500" />
          <span className="text-muted-foreground">在线用户: 245</span>
        </div>
        
        <div className="hidden lg:flex items-center space-x-2 text-sm">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <span className="text-muted-foreground">今日订单: 18</span>
        </div>
        
        <div className="hidden xl:flex items-center space-x-2 text-sm">
          <DollarSign className="w-4 h-4 text-green-500" />
          <span className="text-muted-foreground">今日收入: ¥1,754</span>
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-4 h-4" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
            3
          </Badge>
        </Button>
      </div>
    </header>
  );
}
