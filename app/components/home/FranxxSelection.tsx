'use client'

import { Crown } from 'lucide-react'
import { Package } from '@/types'
import { PackageCard } from '@/components/PackageCard'

interface FranxxSelectionProps {
  packages: Package[]
  onSelectPackage: (packageId: string) => void
}

export function FranxxSelection({ packages, onSelectPackage }: FranxxSelectionProps) {
  return (
    <section id="franxx-selection" className="min-h-screen flex flex-col justify-center px-4 relative z-10 bg-gradient-to-br from-blue-50 to-purple-50/30">
      <div className="container mx-auto py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-red-400" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">选择你的 FRANXX</h2>
            <Crown className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            每台 FRANXX 都经过 APE 严格测试，配备最先进的岩浆能源核心和神经连接系统。
            <br />从量产型到传奇型，总有一台适合你的驾驶风格和作战需求。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} onSelect={onSelectPackage} />
          ))}
        </div>
      </div>
    </section>
  )
}

