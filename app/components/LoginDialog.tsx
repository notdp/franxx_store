import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Github } from 'lucide-react';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { login } = useAuth();
  const [loading, setLoading] = useState<'google' | 'github' | null>(null);

  const handleLogin = async (provider: 'google' | 'github') => {
    try {
      setLoading(provider);
      await login(provider);
      onOpenChange(false);
    } catch (error) {
      console.error('Login failed:', error);
      // In a real app, you'd show a toast notification here
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>登录到 Ranni</DialogTitle>
          <DialogDescription>
            选择您偏好的登录方式，快速访问您的账户和订单历史
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Button
            onClick={() => handleLogin('google')}
            disabled={loading !== null}
            className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {loading === 'google' ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span>使用 Google 登录</span>
          </Button>

          <Button
            onClick={() => handleLogin('github')}
            disabled={loading !== null}
            className="w-full flex items-center justify-center space-x-2 bg-gray-900 text-white hover:bg-gray-800"
          >
            {loading === 'github' ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Github className="w-5 h-5" />
            )}
            <span>使用 GitHub 登录</span>
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>登录即表示您同意我们的服务条款和隐私政策</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}