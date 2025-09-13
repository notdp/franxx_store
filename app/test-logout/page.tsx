'use client'

import { forceLogout } from '@/actions/auth-force-logout'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function TestLogoutPage() {
  const router = useRouter()
  
  const handleForceLogout = async () => {
    try {
      await forceLogout()
    } catch (error) {
      // forceLogout 会 redirect，这里捕获错误避免警告
      console.log('Force logout triggered')
    }
  }
  
  const handleClearLocalStorage = () => {
    // 清理浏览器端存储
    localStorage.clear()
    sessionStorage.clear()
    
    // 清理所有 cookies
    document.cookie.split(";").forEach(c => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
    })
    
    alert('本地存储已清理，请刷新页面')
  }
  
  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">JWT Token 清理测试</h1>
      
      <div className="space-y-6">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">问题说明</h2>
          <p className="text-sm text-gray-600">
            由于 HS256 密钥已被 revoke，但旧的 JWT 仍在缓存中。
            需要强制清理所有认证信息并重新登录。
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <Button 
              onClick={handleClearLocalStorage}
              variant="outline"
              className="w-full"
            >
              1. 清理浏览器本地存储
            </Button>
            <p className="text-xs text-gray-500 mt-1">
              清理 localStorage, sessionStorage 和客户端 cookies
            </p>
          </div>
          
          <div>
            <Button 
              onClick={handleForceLogout}
              variant="destructive"
              className="w-full"
            >
              2. 强制服务端登出
            </Button>
            <p className="text-xs text-gray-500 mt-1">
              清理所有服务端 cookies（包括 httpOnly）并重定向到登录页
            </p>
          </div>
        </div>
        
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-900 mb-2">建议操作顺序：</h3>
          <ol className="list-decimal list-inside text-sm text-yellow-800 space-y-1">
            <li>先点击 &quot;清理浏览器本地存储&quot;</li>
            <li>再点击 &quot;强制服务端登出&quot;</li>
            <li>重新登录获取新的 ES256 签名的 JWT</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
