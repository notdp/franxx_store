'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, LogOut } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface UserMenuProps {
  onNavigate: (page: string) => void;
}

export function UserMenu({ onNavigate }: UserMenuProps) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!user) return null;

  // 使用角色判断是否为管理员
  const isAdmin = user.role === 'admin' || user.role === 'super_admin';

  const handleSignOut = async () => {
    try {
      await logout();
      onNavigate("home");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <>
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-9 w-9 rounded-full hover:opacity-80 transition-opacity"
      >
        <Avatar className="h-9 w-9">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>
            {user.name?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 z-[9999]">
          <div className="p-3 border-b border-gray-200 dark:border-gray-800">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>

          {isAdmin && (
            <>
              <button
                onClick={() => {
                  onNavigate("admin");
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center"
              >
                <Shield className="mr-2 h-4 w-4" />
                <span>管理后台</span>
              </button>
              <div className="border-t border-gray-200 dark:border-gray-800" />
            </>
          )}

          <button
            onClick={() => setConfirmOpen(true)}
            className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center text-red-600 dark:text-red-400"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>退出登录</span>
          </button>
        </div>
      )}
    </div>
    {/* Confirm Logout Dialog mounted outside menu to avoid unmount */}
    <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认退出登录？</AlertDialogTitle>
          <AlertDialogDescription>
            退出后将返回首页并清除会话。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              setConfirmOpen(false);
              setIsOpen(false);
              await handleSignOut();
            }}
          >
            确认退出
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
