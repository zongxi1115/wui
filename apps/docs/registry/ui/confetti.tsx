"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"
import { cn } from "@/registry/lib/utils"

export type ConfettiShape = "square" | "circle" | "strip"

export interface ConfettiOptions {
  /** 粒子数量。 @default 60 */
  particleCount?: number
  /** 扩散角度范围（0 ~ 360 度）。 @default 70 */
  spread?: number
  /** 发射方向角度，90 为正上方，0 为向右，180 为向左。 @default 90 */
  angle?: number
  /** 发射原点坐标 [0.0 ~ 1.0]，相对视口。 @default { x: 0.5, y: 0.65 } */
  origin?: { x?: number; y?: number }
  /** 粒子颜色数组。 */
  colors?: string[]
  /** 粒子形状，随机从数组中取值。 @default ["square", "strip", "circle"] */
  shapes?: ConfettiShape[]
  /** 粒子尺寸缩放系数。 @default 1 */
  scalar?: number
  /** 初始发射速度（像素 / 帧，以 60fps 为基准）。 @default 40 */
  startVelocity?: number
  /** 重力加速度。 @default 1.2 */
  gravity?: number
  /** 每帧速度衰减系数（空气阻力），越小停得越快。 @default 0.92 */
  decay?: number
  /** 横向漂移，正值向右飘。 @default 0 */
  drift?: number
  /** @deprecated 未使用，请改用 `decay`。 */
  ticks?: number
  /** 持续时间（毫秒），粒子在此期间逐渐淡出。 @default 2500 */
  duration?: number
  /** 画布层级。 @default 9999 */
  zIndex?: number
  /** 用户开启“减少动态效果”时不播放。 @default true */
  disableForReducedMotion?: boolean
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  shape: ConfettiShape
  rotation: number
  rotationSpeed: number
  tilt: number
  tiltSpeed: number
  wobble: number
  wobbleSpeed: number
}

const DEFAULT_COLORS = [
  "#2563eb", // wui-token-audit-allow
  "#7c3aed", // wui-token-audit-allow
  "#db2777", // wui-token-audit-allow
  "#ea580c", // wui-token-audit-allow
  "#16a34a", // wui-token-audit-allow
  "#eab308", // wui-token-audit-allow
]

const DEFAULT_SHAPES: ConfettiShape[] = ["square", "strip", "circle"]

/**
 * 触发全屏五彩纸屑庆祝动效。物理计算按真实帧间隔归一化，在 60Hz 与 120Hz
 * 屏幕上速度一致。返回一个可提前停止并清理画布的函数。
 */
export function fireConfetti(options: ConfettiOptions = {}) {
  const noop = () => {}
  if (typeof window === "undefined") return noop

  const {
    particleCount = 60,
    spread = 70,
    angle = 90,
    origin = { x: 0.5, y: 0.65 },
    colors = DEFAULT_COLORS,
    shapes = DEFAULT_SHAPES,
    scalar = 1,
    startVelocity = 40,
    gravity = 1.2,
    decay = 0.92,
    drift = 0,
    duration = 2500,
    zIndex = 9999,
    disableForReducedMotion = true,
  } = options

  if (
    disableForReducedMotion &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return noop
  }

  const width = window.innerWidth
  const height = window.innerHeight
  const ox = (origin.x ?? 0.5) * width
  const oy = (origin.y ?? 0.65) * height

  const canvas = document.createElement("canvas")
  canvas.setAttribute("aria-hidden", "true")
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
    zIndex: String(zIndex),
  })
  document.body.appendChild(canvas)

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    canvas.remove()
    return noop
  }

  const dpr = window.devicePixelRatio || 1
  canvas.width = width * dpr
  canvas.height = height * dpr
  ctx.scale(dpr, dpr)

  const radSpread = (spread * Math.PI) / 180
  const baseAngle = (-angle * Math.PI) / 180

  const particles: Particle[] = Array.from({ length: particleCount }, () => {
    const direction = baseAngle + (Math.random() - 0.5) * radSpread
    const velocity = startVelocity * (0.55 + Math.random() * 0.6)
    return {
      x: ox,
      y: oy,
      vx: Math.cos(direction) * velocity,
      vy: Math.sin(direction) * velocity,
      size: (Math.random() * 5 + 6) * scalar,
      color: colors[Math.floor(Math.random() * colors.length)] ?? "#2563eb", // wui-token-audit-allow
      shape: shapes[Math.floor(Math.random() * shapes.length)] ?? "square",
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      tilt: Math.random() * Math.PI * 2,
      tiltSpeed: 0.08 + Math.random() * 0.12,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.05 + Math.random() * 0.08,
    }
  })

  let frame = 0
  let stopped = false
  const startTime = performance.now()
  let lastTime = startTime

  const cleanup = () => {
    stopped = true
    cancelAnimationFrame(frame)
    canvas.remove()
  }

  const render = (now: number) => {
    if (stopped) return
    // Normalise to 60fps steps so high refresh-rate screens are not faster.
    const step = Math.min((now - lastTime) / (1000 / 60), 3)
    lastTime = now
    const elapsed = now - startTime
    const fade = Math.max(0, 1 - Math.max(0, elapsed - duration * 0.6) / (duration * 0.4))
    const drag = Math.pow(decay, step)

    ctx.clearRect(0, 0, width, height)
    let alive = 0

    for (const p of particles) {
      p.vx = p.vx * drag + drift * 0.05 * step
      p.vy = p.vy * drag + gravity * step
      p.wobble += p.wobbleSpeed * step
      p.x += (p.vx + Math.cos(p.wobble) * 1.2) * step
      p.y += p.vy * step
      p.rotation += p.rotationSpeed * step
      p.tilt += p.tiltSpeed * step

      if (p.y > height + 40 || fade <= 0) continue
      alive++

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      // Squash one axis over time so flat pieces appear to flip in 3D.
      ctx.scale(1, Math.cos(p.tilt))
      ctx.globalAlpha = fade
      ctx.fillStyle = p.color
      if (p.shape === "circle") {
        ctx.beginPath()
        ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2)
        ctx.fill()
      } else if (p.shape === "strip") {
        ctx.fillRect(-p.size * 0.15, -p.size * 0.6, p.size * 0.3, p.size * 1.2)
      } else {
        ctx.fillRect(-p.size / 2, -p.size * 0.3, p.size, p.size * 0.6)
      }
      ctx.restore()
    }

    if (alive > 0 && elapsed < duration) {
      frame = requestAnimationFrame(render)
    } else {
      cleanup()
    }
  }

  frame = requestAnimationFrame(render)
  return cleanup
}

export interface ConfettiProps extends React.ComponentProps<"div"> {
  /** 挂载时使用的纸屑粒子选项。 */
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
  const optionsRef = React.useRef(options)

  React.useEffect(() => {
    optionsRef.current = options
  })

  React.useEffect(() => {
    if (!fireOnMount || reduceMotion) return
    return fireConfetti(optionsRef.current)
  }, [fireOnMount, reduceMotion])

  return (
    <div data-slot="confetti" className={cn("inline-block", className)} {...props}>
      {children}
    </div>
  )
}

export { Confetti }
