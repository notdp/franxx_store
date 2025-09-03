'use client'

import { LoginPage } from '@/components/LoginPage'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()

  const handleBack = () => {
    router.push('/')
  }

  return <LoginPage onBack={handleBack} />
}