'use client'

import Image from 'next/image'
import type React from 'react'
import { Activity, MapPin } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface HeroSectionProps {
  onPrimaryClick?: () => void
}

export function HeroSection({ onPrimaryClick }: HeroSectionProps) {
  const src = '/images/franxx/4k/wallpaperflare.com_wallpaper (4).jpg'
  const handleEngage = useCallback(() => {
    if (onPrimaryClick) onPrimaryClick()
    else document.querySelector('#franxx-selection')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [onPrimaryClick])

  // Hold-to-engage state
  const DURATION = 1100 // ms (slight ceremony)
  const [progress, setProgress] = useState(0)
  const [holding, setHolding] = useState(false)
  const startTsRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const holdRef = useRef(false)
  const completedRef = useRef(false) // 防止按住结束后因 key repeat 重新触发
  // 移除满格白点闪光效果（用户反馈“难看”）
  // Title vibration offsets (px)
  const [vibX, setVibX] = useState(0)
  const [vibY, setVibY] = useState(0)
  // 背景平移 parallax（相对 Hero 区域中心，低灵敏 + 平滑跟随）
  const bgRef = useRef<HTMLDivElement | null>(null)
  const parPosRef = useRef({ x: 0, y: 0 })
  const parTargetRef = useRef({ x: 0, y: 0 })
  const parAnimRef = useRef<number | null>(null)

  const startParAnim = useCallback(() => {
    if (parAnimRef.current) return
    const tick = () => {
      const pos = parPosRef.current
      const target = parTargetRef.current
      // 低通滤波（阻尼跟随）
      const lerp = 0.12
      const nx = pos.x + (target.x - pos.x) * lerp
      const ny = pos.y + (target.y - pos.y) * lerp
      parPosRef.current = { x: nx, y: ny }
      // 仅平移，由内层包裹承担恒定放大，避免首次进入时的“突然放大”
      if (bgRef.current) bgRef.current.style.transform = `translate3d(${nx.toFixed(2)}px, ${ny.toFixed(2)}px, 0)`
      if (Math.abs(target.x - nx) > 0.1 || Math.abs(target.y - ny) > 0.1) {
        parAnimRef.current = requestAnimationFrame(tick)
      } else {
        parAnimRef.current = null
      }
    }
    parAnimRef.current = requestAnimationFrame(tick)
  }, [])

  const handleParallaxMove = useCallback((e: React.PointerEvent) => {
    if (window.innerWidth < 768) return // 小屏禁用
    const host = e.currentTarget as HTMLElement
    const rect = host.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width - 0.5 // -0.5..0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5 // -0.5..0.5
    const AMP_X = 8  // ≈ ±4px
    const AMP_Y = 6  // ≈ ±3px
    parTargetRef.current = { x: nx * AMP_X, y: ny * AMP_Y }
    startParAnim()
  }, [startParAnim])

  const handleParallaxLeave = useCallback(() => {
    parTargetRef.current = { x: 0, y: 0 }
    startParAnim()
  }, [startParAnim])

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

  const reset = useCallback(() => {
    holdRef.current = false
    setHolding(false)
    startTsRef.current = null
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    setProgress(0)
    setVibX(0)
    setVibY(0)
    // 无闪光效果，无需处理定时器
  }, [])

  const startHold = useCallback(() => {
    if (holdRef.current || completedRef.current) return
    holdRef.current = true
    setHolding(true)
    startTsRef.current = null
    const tick = (ts: number) => {
      if (!holdRef.current) return
      if (startTsRef.current == null) startTsRef.current = ts
      const elapsed = ts - (startTsRef.current ?? ts)
      const raw = Math.min(1, elapsed / DURATION)
      const eased = easeOutCubic(raw)
      setProgress(eased * 100)
      // Whole-title subtle vibration (amplitude grows with progress)
      const MAX_AMP = 2.4
      const amp = MAX_AMP * Math.pow(eased, 1.25)
      setVibX(Math.sin(ts * 0.045) * amp)
      setVibY(Math.cos(ts * 0.038) * amp)
      if (raw < 1 && holdRef.current) rafRef.current = requestAnimationFrame(tick)
      else if (raw >= 1) {
        // 完成：锁定100%，直到松开Enter再复位
        completedRef.current = true
        holdRef.current = false
        setHolding(false)
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = null
        setProgress(100)
        setVibX(0); setVibY(0)
        handleEngage()
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [DURATION, handleEngage, reset])

  const cancelHold = useCallback(() => {
    if (!holdRef.current) return
    reset()
  }, [reset])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (e.repeat) return
        e.preventDefault()
        startHold()
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        cancelHold()
        completedRef.current = false
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [startHold, cancelHold])

  // 点击页面等杂散交互时，若未在按住状态，则归零，避免视觉残留/错位
  useEffect(() => {
    const onAnyPointer = () => { if (!holding && !holdRef.current && progress < 100) setProgress(0) }
    window.addEventListener('mousedown', onAnyPointer)
    window.addEventListener('touchstart', onAnyPointer)
    return () => {
      window.removeEventListener('mousedown', onAnyPointer)
      window.removeEventListener('touchstart', onAnyPointer)
    }
  }, [holding, progress])
  
  // 回到该页或回到顶部时重置显示，避免旧进度残留
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible') reset()
    }
    const onScrollTop = () => {
      if (window.scrollY < 40 && !holding) setProgress(0)
    }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('scroll', onScrollTop, { passive: true })
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('scroll', onScrollTop)
    }
  }, [holding, reset])
  return (
    <section
      className="relative isolate -mt-16 min-h-[100svh] flex items-center overflow-hidden"
      onPointerMove={handleParallaxMove}
      onPointerLeave={handleParallaxLeave}
    >
      {/* 背景 4K 插画：右侧主体，左侧留白放文案
          外层仅作平移；内层恒定轻度放大，避免初次指针进入时突兀的缩放跳变 */}
      <div ref={bgRef} className="absolute inset-0 -z-10 will-change-transform">
        <div className="absolute inset-0 transform scale-[1.02] [transform-origin:center]">
          <Image
            src={src}
            alt="FRANXX 线稿插画背景"
            fill
            priority
            className="object-cover [object-position:85%_center] md:[object-position:90%_center]"
            sizes="100vw"
          />
          {/* 左侧轻度暗化渐变，保证白字可读；尽量不影响整体红白风格 */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/10 to-transparent" />
        </div>
      </div>

      {/* 全宽 12 栅格，让文案严格占左 1/3 */}
      <div className="w-full px-4 md:px-8 pt-24 md:pt-28 pb-10">
        <div className="grid grid-cols-12 items-center">
          <div className="col-span-12 md:col-span-4 pr-4 md:pr-6 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
            {/* 状态胶囊 */}
            <div className="mb-6 md:mb-8">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full ring-1 ring-white/20">
                <span className="flex items-center gap-2 text-xs md:text-sm">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> APE 在线
                </span>
                <span className="w-px h-4 bg-white/25" />
                <span className="flex items-center gap-1.5 text-xs md:text-sm">
                  <MapPin className="w-3.5 h-3.5" /> Plantation 13
                </span>
                <span className="w-px h-4 bg-white/25" />
                <span className="flex items-center gap-1.5 text-xs md:text-sm">
                  <Activity className="w-3.5 h-3.5" /> 岩浆核心就绪
                </span>
              </div>
            </div>

          {/* 标题 + 与标题同宽的引擎条（方角、较高） */}
          <div className="inline-block">
            <h1 className="relative font-bold leading-tight tracking-tight text-4xl sm:text-5xl md:text-6xl 2xl:text-7xl" style={{ transform: `translate3d(${vibX}px, ${vibY}px, 0)` }}>
              <span className="text-white/60">FRANXX 驾驶计划</span>
              {/* 渐变填充，根据进度从左到右染色 */}
              <span
                aria-hidden
                className="absolute inset-0 text-transparent bg-gradient-to-r from-red-500 via-pink-400 to-blue-600 bg-clip-text"
                style={{ backgroundSize: `${Math.max(0, Math.min(100, progress))}% 100%`, backgroundRepeat: 'no-repeat', backgroundPosition: 'left top' }}
              >
                FRANXX 驾驶计划
              </span>
            </h1>
            {/* 引擎条放在标题正下方，宽度继承 inline-block 宽度 */}
            <div className="mt-3 select-none" title="按住 Enter 点火">
              <div className="relative h-3 md:h-4 w-full overflow-hidden ring-1 ring-white/40 bg-white/5">
                {/* 轨道刻度（方角） */}
                <div className="absolute inset-0 opacity-30" style={{backgroundImage:'repeating-linear-gradient(to right, rgba(255,255,255,0.6) 0, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 10px)'}} />
                {/* 进度填充 */}
                <div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 via-pink-500 to-blue-600 ${holding ? 'shadow-[0_0_24px_rgba(255,0,90,0.35)]' : ''}`}
                  style={{ width: `${progress}%` }}
                />
                {/* 斜纹流动（仅在按住时显示） */}
                {holding && (
                  <div className="absolute inset-y-0 left-0 mix-blend-screen" style={{ width: `${progress}%`, backgroundImage:'repeating-linear-gradient(45deg, rgba(255,255,255,0.35) 0, rgba(255,255,255,0.35) 6px, rgba(255,255,255,0.12) 6px, rgba(255,255,255,0.12) 12px)', backgroundSize:'24px 24px', animation:'moveStripes 0.6s linear infinite'}} />
                )}
                {/* 满格闪光已移除 */}
              </div>
              {/* 提示放在条下方 */}
              <div className="flex items-center gap-2 text-white/85 text-xs md:text-sm mt-1.5">
                <span>按住</span>
                <kbd className="px-1.5 py-0.5 border border-white/30 bg-white/10 text-white/95">Enter</kbd>
                <span>点火 · 松开取消</span>
              </div>
            </div>
          </div>

          {/* 副文案 */}
          <p className="text-lg sm:text-xl text-white/90 mt-4 mb-0">
            接入神经连接，即刻入列 13 号战斗序列。
          </p>

            {/* 战斗状态指示移动到左下角覆盖层 */}
          </div>
          {/* 右侧空列以对齐 1/3-2/3 结构（背景图在下层不受限） */}
          <div className="hidden md:block md:col-span-8" />
        </div>
      </div>

      {/* 左下角：战斗状态指示（笔记本屏幕更友好） */}
      <div className="absolute left-4 bottom-6 md:left-8 md:bottom-8 z-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-5 text-[11px] sm:text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-white">机体状态：就绪</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-white">岩浆核心：5-30分钟激活</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-white">支援：24h待命</span>
          </div>
        </div>
      </div>
    </section>
  )
}
