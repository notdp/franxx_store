import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Menu,
  User,
  LogOut,
  Settings,
  Shield,
} from "lucide-react";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({
  currentPage,
  onNavigate,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  // 检查用户是否为管理员（这里可以根据实际需求修改判断逻辑）
  const isAdmin =
    user?.email?.includes("admin") ||
    user?.email?.includes("franxx");

  const navigation = [
    { name: "首页", page: "home" },
    { name: "仪表盘", page: "orders" },
    { name: "帮助", page: "faq" },
  ];

  const handleSignOut = async () => {
    try {
      await logout();
      onNavigate("home");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const NavItems = () => (
    <>
      {navigation.map((item) => (
        <button
          key={item.page}
          onClick={() => {
            onNavigate(item.page);
            setIsOpen(false);
          }}
          className={`px-3 py-2 transition-colors ${
            currentPage === item.page
              ? "text-primary bg-accent rounded-md"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {item.name}
        </button>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          {/* FRANXX.STORE 文字Logo */}
          <div className="franxx-logo-container franxx-logo-large franxx-logo-normal-outline">
            <span className="franxx-logo">
              FRAN
              <span className="text-blue-600 franxx-x">X</span>
              <span className="text-red-600 franxx-x">X</span>
              .STORE
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavItems />
          {/* 管理员后台按钮 - 只有管理员可见 */}
          {isAdmin && (
            <button
              onClick={() => onNavigate("admin")}
              className={`px-3 py-2 transition-colors ${
                currentPage === "admin"
                  ? "text-primary bg-accent rounded-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              后台
            </button>
          )}
        </nav>

        {/* User Area & Contact Info */}
        <div className="hidden lg:flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.avatar}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                align="end"
                forceMount
              >
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onNavigate("profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>个人</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onNavigate("orders")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>仪表盘</span>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onNavigate("admin")}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      <span>后台</span>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>退出登录</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              onClick={() => onNavigate("login")}
            >
              登录
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col space-y-6 mt-6">
              {user && (
                <div className="flex items-center space-x-3 pb-6 border-b">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.avatar}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}

              <nav className="flex flex-col space-y-4">
                <NavItems />

                {user && (
                  <>
                    <button
                      onClick={() => {
                        onNavigate("profile");
                        setIsOpen(false);
                      }}
                      className="px-3 py-2 text-left transition-colors text-muted-foreground hover:text-foreground"
                    >
                      个人
                    </button>
                    {/* 管理员后台按钮 - 只有管理员可见 */}
                    {isAdmin && (
                      <button
                        onClick={() => {
                          onNavigate("admin");
                          setIsOpen(false);
                        }}
                        className="px-3 py-2 text-left transition-colors text-muted-foreground hover:text-foreground"
                      >
                        后台
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="px-3 py-2 text-left transition-colors text-muted-foreground hover:text-foreground"
                    >
                      退出登录
                    </button>
                  </>
                )}
                {!user && (
                  <button
                    onClick={() => {
                      onNavigate("login");
                      setIsOpen(false);
                    }}
                    className="px-3 py-2 text-left transition-colors text-muted-foreground hover:text-foreground"
                  >
                    登录
                  </button>
                )}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}