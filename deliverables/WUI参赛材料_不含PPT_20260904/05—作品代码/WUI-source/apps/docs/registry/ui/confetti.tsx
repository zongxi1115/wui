"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"
import { cn } from "@/registry/lib/utils"

export interface ConfettiOptions {
  /** 粒子数量。 @default 50 */
  particleCount?: number
  /** 扩散角度范围（0 ~ 360 度）。 @default 60 */
  spread?: number
  /** 发射原点坐标 [0.0 ~ 1.0]。 @default { x: 0.5, y: 0.7 } */
  origin?: { x?: number; y?: number }
  /** 粒子颜色数组。 */
  colors?: string[]
  /** 初始发射速度。 @default 35 */
  startVelocity?: number
  /** 重力加速度。 @default 1 */
  gravity?: number
  /** 衰减系数。 @default 0.94 */
  ticks?: number
  /** 持续时间（毫秒）。 @default 3000 */
  duration?: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  rotationSpeed: number
  opacity: number
  life: number
  maxLife: number
}

const DEFAULT_COLORS = [
  "#2563eb", // wui-token-audit-allow
  "#7c3aed", // wui-token-audit-allow
  "#db2777", // wui-token-audit-allow
  "#ea580c", // wui-token-audit-allow
  "#16a34a", // wui-token-audit-allow
  "#eab308", // wui-token-audit-allow
]

/** 触发全屏或局部五彩纸屑庆祝动效。 */
export function fireConfetti(options: ConfettiOptions = {}) {
  if (typeof window === "undefined") return

  const {
    particleCount = 60,
    spread = 70,
    origin = { x: 0.5, y: 0.65 },
    colors = DEFAULT_COLORS,
    startVelocity = 40,
    gravity = 1.2,
    duration = 2500,
  } = options

  const ox = (origin.x ?? 0.5) * window.innerWidth
  const oy = (origin.y ?? 0.65) * window.innerHeight

  const canvas = document.createElement("canvas")
  canvas.style.position = "fixed"
  canvas.style.top = "0"
  canvas.style.left = "0"
  canvas.style.width = "100vw"
  canvas.style.height = "100vh"
  canvas.style.pointerEvents = "none"
  canvas.style.zIndex = "9999"
  document.body.appendChild(canvas)

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    document.body.removeChild(canvas)
    return
  }

  const dpr = window.devicePixelRatio || 1
  canvas.width = window.innerWidth * dpr
  canvas.height = window.innerHeight * dpr
  ctx.scale(dpr, dpr)

  const particles: Particle[] = []
  const radSpread = (spread * Math.PI) / 180
  const baseAngle = -Math.PI / 2

  for (let i = 0; i < particleCount; i++) {
    const angle = baseAngle + (Math.random() - 0.5) * radSpread
    const velocity = startVelocity * (0.6 + Math.random() * 0.8)
    const maxLife = duration / 16.6

    particles.push({
      x: ox,
      y: oy,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      size: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)] ?? "#2563eb", // wui-token-audit-allow
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
      life: 0,
      maxLife,
    })
  }

  let animId: number
  const startTime = performance.now()

  const render = (now: number) => {
    const elapsed = now - startTime
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

    let aliveCount = 0

    for (const p of particles) {
      p.life++
      p.x += p.vx
      p.y += p.vy
      p.vy += gravity
      p.vx *= 0.98
      p.rotation += p.rotationSpeed

      const progress = p.life / p.maxLife
      p.opacity = Math.max(0, 1 - progress)

      if (p.opacity > 0 && p.y < window.innerHeight + 50) {
        aliveCount++
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        ctx.restore()
      }
    }

    if (aliveCount > 0 && elapsed < duration + 1000) {
      animId = requestAnimationFrame(render)
    } else {
      cancelAnimationFrame(animId)
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas)
      }
    }
  }

  animId = requestAnimationFrame(render)
}

export interface ConfettiProps extends React.ComponentProps<"div"> {
  /** 手动触发纸屑粒子选项。 */
  options?: ConfettiOptions
  /** 是否在组件挂载时立即触发一次。 @default false */
  fireOnMount?: boolean
}

/** 五彩纸屑庆祝动效组件，支持声明式渲染与命令式函数触发。 */
function Confetti({
  className,
  options,
  fireOnMount = false,
  children,
  ...props
}: ConfettiProps) {
  const reduceMotion = useReducedMotion()

  React.useEffect(() => {
    if (fireOnMount && !reduceMotion) {
      fireConfetti(options)
    }
  }, [fireOnMount, options, reduceMotion])

  return (
    <div data-slot="confetti" className={cn("inline-block", className)} {...props}>
      {children}
    </div>
  )
}

export { Confetti }
