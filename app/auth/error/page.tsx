'use client';

import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

export default function AuthError() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">认证错误</h1>
        <p className="text-muted-foreground mb-4">登录过程中出现问题，请重试</p>
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          返回登录
        </button>
      </div>
    </div>
  );
}