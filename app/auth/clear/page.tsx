'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ClearAuthPage() {
  const router = useRouter()

  useEffect(() => {
    // 清理所有可能的 Supabase cookies
    const clearAllCookies = () => {
      // 获取所有 cookies
      document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
        
        // 清理 Supabase 相关的 cookies
        if (name.includes('sb-') || name.includes('sb:') || name.includes('supabase')) {
          // 尝试不同的路径和域组合来删除 cookie
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost`
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost`
        }
      })

      // 清理 localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.includes('supabase') || key.includes('sb-')) {
          localStorage.removeItem(key)
        }
      })

      // 清理 sessionStorage
      Object.keys(sessionStorage).forEach(key => {
        if (key.includes('supabase') || key.includes('sb-')) {
          sessionStorage.removeItem(key)
        }
      })
    }

    clearAllCookies()
    
    // 延迟后重定向到登录页
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">清理认证信息</h1>
        <p className="text-gray-600">正在清理旧的认证数据...</p>
        <p className="text-sm text-gray-500 mt-2">即将跳转到登录页面</p>
      </div>
    </div>
  )
}