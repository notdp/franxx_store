import { packages } from '@/data/mockData'
import { HeroSection } from '@/components/home/HeroSection'
import { FranxxSelection } from '@/components/home/FranxxSelection'
import { FeaturesSection } from '@/components/home/FeaturesSection'

interface HomePageProps {
  onSelectPackage: (packageId: string) => void
}

export function HomePage({ onSelectPackage }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-red-900/10 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* 顶部 Hero */}
      <HeroSection
        onPrimaryClick={() => {
          const target = document.querySelector('#franxx-selection') as HTMLElement | null
          if (!target) return
          const rect = target.getBoundingClientRect()
          const absoluteTop = window.scrollY + rect.top
          window.scrollTo({ top: Math.max(0, absoluteTop), behavior: 'smooth' })
        }}
      />

      {/* FRANXX 展示区 */}
      <FranxxSelection packages={packages} onSelectPackage={onSelectPackage} />

      {/* 特色功能区 */}
      <FeaturesSection />
    </div>
  )
}
