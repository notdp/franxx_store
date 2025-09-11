'use client'

import { DollarSign, Zap, Shield, Users } from 'lucide-react'

export function FeaturesSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-sm relative z-10">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">为什么选择 APE 驾驶员系统？</h2>
          <p className="text-lg text-muted-foreground">最先进的 FRANXX 技术支持和服务</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              <DollarSign className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">经济高效</h3>
            <p className="text-sm text-muted-foreground">通过优化岩浆能源供应<br /><span className="font-medium text-green-500">最高节省60%成本</span></p>
          </div>

          <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <Zap className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">极速激活</h3>
            <p className="text-sm text-muted-foreground">驾驶员认证通过后<br /><span className="font-medium text-blue-500">5-30分钟启动FRANXX</span></p>
          </div>

          <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
              <Shield className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">军用安全</h3>
            <p className="text-sm text-muted-foreground">APE级加密神经连接<br /><span className="font-medium text-red-500">独立驾驶员系统</span></p>
          </div>

          <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
              <Users className="w-10 h-10 text-purple-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">专业支援</h3>
            <p className="text-sm text-muted-foreground">APE技术维护部<br /><span className="font-medium text-purple-500">24小时战地支援</span></p>
          </div>
        </div>
      </div>
    </section>
  )
}

