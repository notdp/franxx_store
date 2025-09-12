'use client'

import { useMemo, useRef, useState, useLayoutEffect, type ComponentType } from 'react'
import { DollarSign, Zap, Shield, Users, Heart } from 'lucide-react'

type Slide = {
  key: string
  title: string
  desc: string
  icon: ComponentType<any>
  iconBg: string
  iconColor: string
  chip?: string
  chipClass?: string
}

const INITIAL_SLIDES: Slide[] = [
    {
      key: 'solo',
      title: '单人驾驶',
      desc: '独立操控机体 · 完整权限',
      icon: Shield,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      chip: '精英驾驶员',
      chipClass: 'text-blue-700 bg-blue-50',
    },
    {
      key: 'duo',
      title: '双人驾驶',
      desc: 'Stamen & Pistil 神经连接',
      icon: Heart,
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600',
      chip: '费用减半',
      chipClass: 'text-pink-700 bg-pink-50',
    },
    {
      key: 'squad',
      title: '小队作战',
      desc: '3 台 FRANXX 协同作战',
      icon: Users,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      chip: '85 折 · 独立机体',
      chipClass: 'text-purple-700 bg-purple-50',
    },
    {
      key: 'economy',
      title: '能源经济',
      desc: '优化岩浆能源 · 最高节省 60%',
      icon: DollarSign,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      key: 'speed',
      title: '极速激活',
      desc: '认证通过后 5–30 分钟',
      icon: Zap,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      key: 'security',
      title: '军用级安全',
      desc: 'APE 加密神经连接',
      icon: Shield,
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
    },
    {
      key: 'support',
      title: '战地支援',
      desc: 'APE 维护部 · 24h',
      icon: Users,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
    },
]

export function FeaturesSection() {
  const [slides, setSlides] = useState<Slide[]>(() => INITIAL_SLIDES)
  const [dragging, setDragging] = useState(false)
  const dragFromRef = useRef<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const itemRefs = useRef(new Map<string, HTMLDivElement>())
  const lastPositionsRef = useRef<Map<string, DOMRect> | null>(null)

  const move = <T,>(arr: T[], from: number, to: number) => {
    const copy = arr.slice()
    const [item] = copy.splice(from, 1)
    copy.splice(to, 0, item)
    return copy
  }

  // During dragging, preview an insertion by rendering a temporary order
  const renderOrder = useMemo(() => {
    if (dragging && dragOverIndex != null && dragFromRef.current != null) {
      return move(slides, dragFromRef.current, dragOverIndex)
    }
    return slides
  }, [slides, dragging, dragOverIndex])

  const doubled = useMemo(() => [...renderOrder, ...renderOrder], [renderOrder])

  const measure = () => {
    const map = new Map<string, DOMRect>()
    for (const s of renderOrder) {
      const el = itemRefs.current.get(s.key)
      if (el) map.set(s.key, el.getBoundingClientRect())
    }
    return map
  }

  const animateFlip = (prev: Map<string, DOMRect> | null, next: Map<string, DOMRect>) => {
    if (!prev) return
    next.forEach((toRect, key) => {
      const fromRect = prev.get(key)
      const el = itemRefs.current.get(key)
      if (!fromRect || !el) return
      const dx = fromRect.left - toRect.left
      if (dx === 0) return
      el.style.transform = `translateX(${dx}px)`
      el.style.transition = 'transform 0s'
      // Play to 0 on next frame
      requestAnimationFrame(() => {
        el.style.transition = 'transform 250ms cubic-bezier(0.2,0.65,0.3,1)'
        el.style.transform = 'translateX(0)'
      })
    })
  }

  const clearTransforms = () => {
    renderOrder.forEach(s => {
      const el = itemRefs.current.get(s.key)
      if (el) {
        el.style.transform = ''
        el.style.transition = ''
      }
    })
  }

  const onDragStart = (e: React.DragEvent, from: number) => {
    dragFromRef.current = from
    setDragging(true)
    // capture initial positions
    lastPositionsRef.current = measure()
    e.dataTransfer.setData('text/plain', String(from))
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDragOver = (e: React.DragEvent, over: number) => {
    e.preventDefault()
    // measure before we change render order
    lastPositionsRef.current = measure()
    setDragOverIndex(over)
    e.dataTransfer.dropEffect = 'move'
  }

  const onDrop = (e: React.DragEvent, to: number) => {
    e.preventDefault()
    const from = dragFromRef.current
    if (from == null) return finishDrag()
    if (from !== to) setSlides(prev => move(prev, from, to))
    finishDrag()
  }

  const finishDrag = () => {
    setDragging(false)
    dragFromRef.current = null
    setDragOverIndex(null)
    clearTransforms()
  }

  // Run FLIP after renderOrder changes while dragging
  useLayoutEffect(() => {
    if (!dragging) return
    const next = measure()
    animateFlip(lastPositionsRef.current, next)
    lastPositionsRef.current = next
  }, [renderOrder, dragging])

  return (
    <section
      id="features"
      className="pt-16 pb-24 px-4 bg-gradient-to-br from-blue-50 to-purple-50/30 relative z-10"
    >
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">为什么选择 APE 驾驶员系统？</h2>
          <p className="text-lg text-muted-foreground">最先进的 FRANXX 技术支持和服务</p>
        </div>

        <div className={`relative group ${dragging ? 'dragging' : ''}`}>
          {/* 两侧渐隐遮罩 */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-12 sm:w-16 bg-gradient-to-r from-white/80 to-transparent dark:from-white/10 z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-12 sm:w-16 bg-gradient-to-l from-white/80 to-transparent dark:from-white/10 z-10" />

          <div className="overflow-hidden" aria-label="features marquee" role="region">
            <div className="features-marquee flex gap-4 sm:gap-6">
              {doubled.map((item, idx) => {
                const Icon = item.icon
                const isClone = idx >= renderOrder.length
                const baseIndex = idx % renderOrder.length
                const isDraggingNow = dragging && !isClone && dragFromRef.current === baseIndex
                return (
                  <div
                    key={`${item.key}-${idx}`}
                    className="w-[220px] sm:w-[260px] md:w-[280px] shrink-0"
                    aria-hidden={isClone}
                  >
                    <div
                      className="h-full"
                      ref={el => {
                        if (!isClone) {
                          if (el) itemRefs.current.set(item.key, el)
                          else itemRefs.current.delete(item.key)
                        }
                      }}
                    >
                      <div
                        className={`text-center select-none p-5 sm:p-6 rounded-xl border bg-white/80 dark:bg-white/5 backdrop-blur-sm transition-colors border-foreground/10 hover:border-foreground/20 ${isDraggingNow ? 'scale-105 shadow-2xl' : ''} cursor-grab active:cursor-grabbing transition-transform duration-200 ease-out outline-none focus:outline-none`}
                        draggable
                        onDragStart={e => onDragStart(e, baseIndex)}
                        onDragOver={e => onDragOver(e, baseIndex)}
                        onDrop={e => onDrop(e, baseIndex)}
                        onDragEnd={finishDrag}
                        role={!isClone ? 'listitem' : undefined}
                        aria-grabbed={!isClone && dragging ? 'true' : 'false'}
                      >
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 ${item.iconBg} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                          <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${item.iconColor}`} />
                        </div>
                        <h3 className="font-semibold text-base sm:text-lg mb-1">{item.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 min-h-[2.25rem] sm:min-h-[2.5rem]">{item.desc}</p>
                        {item.chip ? (
                          <div className={`inline-flex items-center text-[11px] sm:text-xs px-2 sm:px-3 py-1 rounded-full ${item.chipClass}`}>
                            {item.chip}
                          </div>
                        ) : (
                          <div className="h-6 sm:h-7" aria-hidden="true" />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
