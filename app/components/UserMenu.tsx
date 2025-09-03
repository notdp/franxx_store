import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User, ShoppingBag, LogOut, Settings } from 'lucide-react';

interface UserMenuProps {
  onNavigateToOrders: () => void;
}

export function UserMenu({ onNavigateToOrders }: UserMenuProps) {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onNavigateToOrders}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          <span>我的订单</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <User className="mr-2 h-4 w-4" />
          <span>个人资料</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Settings className="mr-2 h-4 w-4" />
          <span>设置</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={loading}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{loading ? '退出中...' : '退出登录'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}