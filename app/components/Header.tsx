import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { SimpleUserMenu } from "./simple-user-menu";
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

  // 使用角色判断是否为管理员
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  // 根据用户状态和角色动态生成导航菜单
  const navigation = [
    { name: "首页", page: "home" },
    { name: "FAQ", page: "faq" },
  ];
  
  // 登录用户显示个人中心
  if (user) {
    navigation.splice(1, 0, { name: "个人中心", page: "orders" });
  }
  
  // 管理员添加后台入口
  if (isAdmin) {
    navigation.push({ name: "后台", page: "admin" });
  }

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        {/* Logo - 左侧 */}
        <div className="flex items-center flex-1">
          <div className="franxx-logo-container franxx-logo-large franxx-logo-normal-outline">
            <span className="franxx-logo">
              FRAN
              <span className="text-blue-600 franxx-x">X</span>
              <span className="text-red-600 franxx-x">X</span>
              .STORE
            </span>
          </div>
        </div>

        {/* Desktop Navigation - 居中 */}
        <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
          <NavItems />
        </nav>

        {/* User Area & Contact Info - 右侧 */}
        <div className="hidden lg:flex items-center space-x-4 flex-1 justify-end">
          {user ? (
            <SimpleUserMenu onNavigate={onNavigate} />
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
                      onClick={async () => {
                        try {
                          await logout();
                          onNavigate("home");
                          setIsOpen(false);
                        } catch (error) {
                          console.error("Sign out error:", error);
                        }
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