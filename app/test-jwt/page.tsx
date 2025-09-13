'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function TestJWTPage() {
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [decodedToken, setDecodedToken] = useState<any>(null)

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        setSessionInfo({
          user_id: session.user?.id,
          email: session.user?.email,
          access_token: session.access_token,
          expires_at: session.expires_at,
          token_type: session.token_type
        })

        // 解码 JWT（不验证签名，仅查看内容）
        try {
          const parts = session.access_token.split('.')
          const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')))
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
          
          setDecodedToken({
            header,
            payload,
            role_found: payload.user_role || payload.app_metadata?.app_role || 'NOT FOUND'
          })
        } catch (e) {
          console.error('Failed to decode JWT:', e)
        }
      }
    }

    checkSession()
  }, [supabase])

  const refreshSession = async () => {
    const { data, error } = await supabase.auth.refreshSession()
    if (error) {
      alert('刷新失败: ' + error.message)
    } else {
      alert('Session 已刷新，请刷新页面查看新 token')
      window.location.reload()
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">JWT Token 诊断</h1>
      
      {!sessionInfo ? (
        <p>未登录或 session 未找到</p>
      ) : (
        <div className="space-y-6">
          <div className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Session 信息</h2>
            <pre className="text-xs overflow-auto bg-gray-100 p-2 rounded">
              {JSON.stringify(sessionInfo, null, 2)}
            </pre>
          </div>

          {decodedToken && (
            <>
              <div className="p-4 border rounded-lg">
                <h2 className="text-lg font-semibold mb-2">JWT Header</h2>
                <pre className="text-xs overflow-auto bg-gray-100 p-2 rounded">
                  {JSON.stringify(decodedToken.header, null, 2)}
                </pre>
              </div>

              <div className="p-4 border rounded-lg">
                <h2 className="text-lg font-semibold mb-2">JWT Payload</h2>
                <pre className="text-xs overflow-auto bg-gray-100 p-2 rounded">
                  {JSON.stringify(decodedToken.payload, null, 2)}
                </pre>
              </div>

              <div className={`p-4 border rounded-lg ${decodedToken.role_found === 'NOT FOUND' ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
                <h2 className="text-lg font-semibold mb-2">角色检测</h2>
                <p className="text-sm">
                  角色值: <strong>{decodedToken.role_found}</strong>
                </p>
                {decodedToken.role_found === 'NOT FOUND' && (
                  <p className="text-sm text-red-600 mt-2">
                    ⚠️ JWT 中未找到角色信息，需要配置 Auth Hook
                  </p>
                )}
              </div>
            </>
          )}

          <button 
            onClick={refreshSession}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            强制刷新 Session
          </button>
        </div>
      )}
    </div>
  )
}
