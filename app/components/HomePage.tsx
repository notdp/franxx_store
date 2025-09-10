import { packages } from '@/data/mockData';
import { PackageCard } from '@/components/PackageCard';
import { DollarSign, Zap, Shield, Users, Crown, Heart, MapPin, Activity } from 'lucide-react';

interface HomePageProps {
  onSelectPackage: (packageId: string) => void;
}

export function HomePage({ onSelectPackage }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-red-900/10 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section - 全屏设计 */}
      <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="container mx-auto text-center flex-1 flex flex-col justify-center max-w-7xl">
          {/* APE 状态指示器 */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 sm:gap-4 bg-white/95 backdrop-blur-sm px-4 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700">APE 在线</span>
              </div>
              <div className="w-px h-3 bg-blue-300"></div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-sm text-blue-700">Plantation 13</span>
              </div>
              <div className="w-px h-3 bg-purple-300"></div>
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-sm text-purple-700">岩浆核心就绪</span>
              </div>
            </div>
          </div>
          
          {/* 主标题 */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-500 via-pink-400 to-blue-500 bg-clip-text text-transparent">
                FRANXX
              </span>
              <br />
              <span className="text-xl sm:text-2xl md:text-4xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                驾驶员征募系统
              </span>
            </h1>
            <div className="max-w-4xl mx-auto space-y-4">
              <p className="text-lg sm:text-xl text-blue-700 font-medium">
                APE 特殊兵器管理委员会 · Plantation 13 分部
              </p>
              <p className="text-base sm:text-lg text-muted-foreground px-4 sm:px-0">
                欢迎来到人类最后的堡垒。选择你的专属 FRANXX，与搭档建立神经连接，
                <br className="hidden sm:block" />
                共同对抗叫龙威胁，守护人类文明的最后希望。
              </p>
              <p className="text-sm sm:text-base text-blue-500 font-medium">
                通过优化的岩浆能源供应系统，让更多有潜质的驾驶员加入战斗。
              </p>
            </div>
          </div>
          
          {/* 系统状态指示 */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-sm mb-10">
            <div className="flex items-center space-x-2 bg-green-50 px-3 sm:px-4 py-2 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-600 font-medium text-xs sm:text-sm">岩浆核心：5-30分钟激活</span>
            </div>
            <div className="flex items-center space-x-2 bg-blue-50 px-3 sm:px-4 py-2 rounded-full border border-blue-200">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-600 font-medium text-xs sm:text-sm">神经连接：独立驾驶员系统</span>
            </div>
            <div className="flex items-center space-x-2 bg-purple-50 px-3 sm:px-4 py-2 rounded-full border border-purple-200">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-purple-600 font-medium text-xs sm:text-sm">技术支援：APE 24小时待命</span>
            </div>
          </div>
          
          {/* 驾驶员配置选择 */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">神经连接配置</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
                根据你的驾驶员等级和作战需求，选择最适合的 FRANXX 操控模式
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto px-4 sm:px-0">
              {/* 单人驾驶 */}
              <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 rounded-xl border-2 border-blue-200 hover:border-blue-300 transform hover:scale-105 transition-all duration-300">
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Shield className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600" />
                </div>
                <h4 className="font-bold text-base sm:text-lg mb-2 text-blue-700">单人驾驶</h4>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                  独立操控机体，完整的作战权限
                </p>
                <div className="text-xs text-blue-700 bg-blue-100 px-2 sm:px-3 py-1 rounded-full">
                  适合独行的精英驾驶员
                </div>
              </div>
              
              {/* 双人驾驶 */}
              <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-xl border-2 border-pink-200 relative overflow-hidden transform hover:scale-105 transition-all duration-300">
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Heart className="w-6 sm:w-8 h-6 sm:h-8 text-pink-500" />
                </div>
                <h4 className="font-bold text-base sm:text-lg mb-2 text-pink-600">双人驾驶</h4>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                  Stamen + Pistil 神经连接
                </p>
                <div className="text-xs text-pink-600 bg-pink-100 px-2 sm:px-3 py-1 rounded-full font-medium">
                  费用减半
                </div>
              </div>
              
              {/* 小队作战 */}
              <div className="text-center p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-purple-200 hover:border-purple-300 transform hover:scale-105 transition-all duration-300">
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Users className="w-6 sm:w-8 h-6 sm:h-8 text-purple-500" />
                </div>
                <h4 className="font-bold text-base sm:text-lg mb-2 text-purple-600">小队作战</h4>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                  3台FRANXX 协同作战
                </p>
                <div className="text-xs text-purple-600 bg-purple-100 px-2 sm:px-3 py-1 rounded-full">
                  85折优惠 · 独立机体
                </div>
              </div>
            </div>
          </div>

          {/* 战斗动员区 - 热血战斗风 */}
          <div className="mt-8">
            <div className="text-center space-y-6 sm:space-y-8">
              {/* 紧急通知横幅 */}
              <div className="relative overflow-hidden bg-gradient-to-l from-blue-300/25 via-red-200/20 to-red-300/25 border border-red-200/80 rounded-2xl p-4 sm:p-6 backdrop-blur-sm max-w-5xl mx-auto px-4 sm:px-0">
                <div className="absolute inset-0 bg-gradient-to-l from-blue-200/15 to-red-200/15 animate-pulse"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-red-600 font-medium text-xs sm:text-sm tracking-wider">紧急战况通报</span>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold mb-3 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
                    叫龙威胁等级：高危
                  </h3>
                  <p className="text-sm sm:text-base text-red-700 max-w-2xl mx-auto px-2 sm:px-0">
                    Plantation 13 防线告急！我们急需有勇气的驾驶员加入战斗。
                    <br className="hidden sm:block" />
                    选择你的 FRANXX，与搭档建立神经连接，守护人类最后的希望。
                  </p>
                </div>
              </div>
              
              {/* 战斗动员按钮 */}
              <div className="flex flex-col items-center gap-4 sm:gap-6">
                <button
                  onClick={() => {
                    const franxxSection = document.getElementById('franxx-selection');
                    franxxSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="group relative overflow-hidden px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-400 to-blue-400 text-white font-bold rounded-xl hover:from-red-500 hover:to-blue-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/12 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-2 sm:gap-3">
                    <Activity className="w-4 sm:w-5 h-4 sm:h-5" />
                    <span className="text-sm sm:text-base">立即加入战斗序列</span>
                    <div className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform duration-300">
                      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </button>
                
                {/* 战斗状态指示 */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-600">机体状态：就绪</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-blue-600">岩浆核心：充能中</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-purple-600">支援：24h待命</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FRANXX 展示区 - 全屏设计 */}
      <section id="franxx-selection" className="min-h-screen flex flex-col justify-center px-4 relative z-10 bg-gradient-to-br from-blue-50 to-purple-50/30">
        <div className="container mx-auto py-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Crown className="w-8 h-8 text-red-400" />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
                选择你的 FRANXX
              </h2>
              <Crown className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              每台 FRANXX 都经过 APE 严格测试，配备最先进的岩浆能源核心和神经连接系统。
              <br />
              从量产型到传奇型，总有一台适合你的驾驶风格和作战需求。
            </p>
          </div>
          
          {/* FRANXX 卡片网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                onSelect={onSelectPackage}
              />
            ))}
          </div>



        </div>
      </section>

      {/* 特色功能区 */}
      <section className="py-16 px-4 bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-sm relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">为什么选择 APE 驾驶员系统？</h2>
            <p className="text-lg text-muted-foreground">最先进的 FRANXX 技术支持和服务</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 经济高效 */}
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <DollarSign className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">经济高效</h3>
              <p className="text-sm text-muted-foreground">
                通过优化岩浆能源供应
                <br />
                <span className="font-medium text-green-500">最高节省60%成本</span>
              </p>
            </div>
            
            {/* 极速激活 */}
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Zap className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">极速激活</h3>
              <p className="text-sm text-muted-foreground">
                驾驶员认证通过后
                <br />
                <span className="font-medium text-blue-500">5-30分钟启动FRANXX</span>
              </p>
            </div>
            
            {/* 军用安全 */}
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                <Shield className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">军用安全</h3>
              <p className="text-sm text-muted-foreground">
                APE级加密神经连接
                <br />
                <span className="font-medium text-red-500">独立驾驶员系统</span>
              </p>
            </div>
            
            {/* 专业支援 */}
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Users className="w-10 h-10 text-purple-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">专业支援</h3>
              <p className="text-sm text-muted-foreground">
                APE技术维护部
                <br />
                <span className="font-medium text-purple-500">24小时战地支援</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
