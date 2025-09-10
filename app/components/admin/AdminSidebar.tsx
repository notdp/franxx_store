import { useAuth } from '../../contexts/AuthContext';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarSeparator
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Home, LogOut } from 'lucide-react';
import { menuItems, AdminPageType } from './constants';

interface AdminSidebarProps {
  currentAdminPage: AdminPageType;
  setCurrentAdminPage: (page: AdminPageType) => void;
  onBackToMain: () => void;
  onSignOut: () => void;
}

export function AdminSidebar({ 
  currentAdminPage, 
  setCurrentAdminPage, 
  onBackToMain, 
  onSignOut 
}: AdminSidebarProps) {
  const { user } = useAuth();

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r bg-sidebar">
      <SidebarHeader className="border-b px-2 py-2 bg-sidebar">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              size="lg" 
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer hover:bg-sidebar-accent/50 transition-colors group-data-[collapsible=icon]:justify-center"
              onClick={onBackToMain}
            >
              {/* 侧边栏收起时显示的F图标 */}
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar text-sidebar-foreground group-data-[collapsible=icon]:flex hidden shrink-0">
                <div className="franxx-logo-container franxx-logo-small">
                  <span className="franxx-logo">F</span>
                </div>
              </div>
              
              {/* 侧边栏展开时显示的完整FRANXX PANEL Logo */}
              <div className="group-data-[collapsible=icon]:hidden flex items-center flex-1">
                <div className="franxx-logo-container franxx-logo-medium">
                  <span className="franxx-logo whitespace-nowrap">
                    FRAN
                    <span className="text-blue-600 franxx-x">X</span>
                    <span className="text-red-600 franxx-x">X</span>
                    <span className="ml-4">PANEL</span>
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent className="overflow-hidden px-0 py-0 gap-0 bg-sidebar">
        {menuItems.map((group, index) => (
          <div key={index} className="bg-sidebar">
            {index > 0 && (
              <SidebarSeparator className="my-1 group-data-[collapsible=icon]:my-1 group-data-[collapsible=icon]:mx-2" />
            )}
            <SidebarGroup className="px-2 py-1 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-1 bg-sidebar">
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden px-0 mb-0.5">
                {group.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-0">
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.page}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        onClick={() => setCurrentAdminPage(item.page)}
                        isActive={currentAdminPage === item.page}
                        className="w-full mx-0"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        ))}
      </SidebarContent>
      
      <SidebarFooter className="px-2 py-2 bg-sidebar">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage 
                      src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Admin'}`} 
                      alt={user?.name || '管理员'} 
                    />
                    <AvatarFallback className="rounded-lg">
                      {(user?.name || '管理员').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.name || '演示用户'}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email || 'demo@franxx.ai'}
                    </span>
                  </div>
                  <div className="ml-auto flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage 
                        src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Admin'}`} 
                        alt={user?.name || '管理员'} 
                      />
                      <AvatarFallback className="rounded-lg">
                        {(user?.name || '管理员').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.name || '演示用户'}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user?.email || 'demo@franxx.ai'}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onBackToMain}>
                  <Home className="w-4 h-4 mr-2" />
                  返回首页
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  {user ? '退出登录' : '返回首页'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
