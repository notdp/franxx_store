'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function forceLogout() {
  const store = cookies()
  
  // 清理所有 cookie（包括 httpOnly）
  const allCookies = store.getAll()
  allCookies.forEach(cookie => {
    // 清理所有 Supabase 相关 cookie
    if (cookie.name.includes('sb-') || 
        cookie.name.includes('sb:') || 
        cookie.name.includes('supabase')) {
      store.delete({
        name: cookie.name,
        path: '/',
        domain: undefined, // 清理所有域
      })
    }
  })
  
  // 确保清理分片 cookie
  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF || 'njfnsiwznqjbjqohuukc'
  for (let i = 0; i < 10; i++) {
    store.delete({
      name: `sb-${projectRef}-auth-token.${i}`,
      path: '/',
    })
  }
  
  // 清理主 token
  store.delete({
    name: `sb-${projectRef}-auth-token`,
    path: '/',
  })
  
  // 清理 code verifier
  store.delete({
    name: `sb-${projectRef}-auth-token-code-verifier`,
    path: '/',
  })
  
  // 重定向到登录页
  redirect('/login')
}