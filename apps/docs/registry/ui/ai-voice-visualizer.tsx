"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { useAnimationFrame, useReducedMotion } from "motion/react"

import { cn } from "@/registry/lib/utils"

export type AiVoiceVisualizerState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"

const aiVoiceVisualizerVariants = cva(
  "group/voice inline-flex select-none items-center justify-center transition-colors duration-300 data-[state=idle]:text-muted-foreground/50 data-[state=listening]:text-info data-[state=speaking]:text-foreground data-[state=thinking]:text-foreground",
  {
    variants: {
      size: {
        sm: "h-6 min-w-6",
        md: "h-10 min-w-10",
        lg: "h-16 min-w-16",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const stateLabels: Record<AiVoiceVisualizerState, string> = {
  idle: "语音空闲",
  listening: "正在聆听",
  thinking: "正在思考",
  speaking: "正在回复",
}

const waveWidths = { sm: "w-12", md: "w-24", lg: "w-36" } as const

export interface AiVoiceVisualizerProps
  extends Omit<React.ComponentProps<"div">, "children">,
    VariantProps<typeof aiVoiceVisualizerVariants> {
  /** 可视化声波形态（柱状、呼吸光环或正弦曲线）。 @default "bars" */
  variant?: "bars" | "orb" | "wave"
  /** 语音会话当前所处的生命周期状态。 @default "idle" */
  state?: AiVoiceVisualizerState
  /** 实时音频电平归一化数值 [0.0 ~ 1.0]。省略时根据状态生成自然的模拟起伏。 */
  audioLevel?: number
  /** 柱状声波模式下的柱子数量。 @default 5 */
  barCount?: number
  /** 尺寸大小。 @default "md" */
  size?: "sm" | "md" | "lg"
}

type Signal = {
  state: AiVoiceVisualizerState
  audioLevel?: number
}

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max)

/** Target energy for the current state, shared by every variant. */
function targetLevel({ state, audioLevel }: Signal, time: number, seed = 0) {
  if (state === "idle") return 0
  if (state === "thinking") return 0.35 + 0.2 * Math.sin(time * 2.6 + seed)
  if (audioLevel !== undefined) return clamp(audioLevel)
  return 0.45 + 0.22 * Math.sin(time * 2.1 + seed) + 0.1 * Math.sin(time * 5.3)
}

/**
 * Real-time voice visualizer. Animation runs on the frame loop and writes
 * styles directly, so frequent `audioLevel` updates never trigger re-render
 * driven keyframe restarts and the motion stays continuous.
 */
function AiVoiceVisualizer({
  className,
  size = "md",
  variant = "bars",
  state = "idle",
  audioLevel,
  barCount = 5,
  ...props
}: AiVoiceVisualizerProps) {
  const reduceMotion = !!useReducedMotion()
  const signal = React.useRef<Signal>({ state, audioLevel })
  signal.current = { state, audioLevel }

  return (
    <div
      role="img"
      aria-label={stateLabels[state]}
      data-slot="ai-voice-visualizer"
      data-state={state}
      data-variant={variant}
      className={cn(aiVoiceVisualizerVariants({ size }), className)}
      {...props}
    >
      {variant === "bars" ? (
        <BarsVisualizer
          signal={signal}
          snapshot={{ state, audioLevel }}
          barCount={barCount}
          reduceMotion={reduceMotion}
        />
      ) : variant === "orb" ? (
        <OrbVisualizer
          signal={signal}
          snapshot={{ state, audioLevel }}
          reduceMotion={reduceMotion}
        />
      ) : (
        <WaveVisualizer
          signal={signal}
          snapshot={{ state, audioLevel }}
          reduceMotion={reduceMotion}
          widthClassName={waveWidths[size ?? "md"]}
        />
      )}
    </div>
  )
}

function barShape(index: number, count: number) {
  const center = (count - 1) / 2
  return count > 1 ? 1 - Math.abs(index - center) / (center + 1) : 1
}

function staticBarHeight(signal: Signal, index: number, count: number) {
  const level = targetLevel(signal, 0, index)
  return 0.14 + level * (0.5 + 0.5 * barShape(index, count)) * 0.86
}

function BarsVisualizer({
  signal,
  snapshot,
  barCount,
  reduceMotion,
}: {
  signal: React.RefObject<Signal>
  snapshot: Signal
  barCount: number
  reduceMotion: boolean
}) {
  const bars = React.useRef<Array<HTMLSpanElement | null>>([])
  const heights = React.useRef<number[]>([])

  useAnimationFrame((time) => {
    if (reduceMotion) return
    const t = time / 1000
    const current = signal.current

    for (let i = 0; i < barCount; i++) {
      const bar = bars.current[i]
      if (!bar) continue

      let target: number
      if (current.state === "thinking") {
        // A travelling crest reads as "processing" rather than "hearing".
        target = 0.16 + 0.62 * Math.max(0, Math.sin(t * 5 - i * 0.75)) ** 2
      } else {
        const level = targetLevel(current, t, i * 1.3)
        const jitter = 0.7 + 0.3 * Math.sin(t * (7 + i * 1.9) + i * 2.1)
        target = 0.14 + level * (0.45 + 0.55 * barShape(i, barCount)) * jitter
      }

      const previous = heights.current[i] ?? target
      const next = previous + (clamp(target) - previous) * 0.22
      heights.current[i] = next
      bar.style.height = `${(next * 100).toFixed(2)}%`
    }
  })

  return (
    <div className="flex h-full items-center gap-[3px]">
      {Array.from({ length: barCount }, (_, i) => (
        <span
          key={i}
          ref={(node) => {
            bars.current[i] = node
          }}
          className="block min-h-1 w-1 rounded-full bg-current"
          style={{
            height: `${(
              (reduceMotion
                ? staticBarHeight(snapshot, i, barCount)
                : 0.14) * 100
            ).toFixed(2)}%`,
          }}
        />
      ))}
    </div>
  )
}

function OrbVisualizer({
  signal,
  snapshot,
  reduceMotion,
}: {
  signal: React.RefObject<Signal>
  snapshot: Signal
  reduceMotion: boolean
}) {
  const core = React.useRef<HTMLSpanElement>(null)
  const ring = React.useRef<HTMLSpanElement>(null)
  const level = React.useRef(0)

  useAnimationFrame((time) => {
    if (reduceMotion || !core.current || !ring.current) return
    const target = targetLevel(signal.current, time / 1000)
    level.current += (target - level.current) * 0.12
    const value = level.current

    core.current.style.transform = `scale(${(0.78 + value * 0.22).toFixed(4)})`
    ring.current.style.transform = `scale(${(0.86 + value * 0.3).toFixed(4)})`
    ring.current.style.opacity = (0.12 + value * 0.4).toFixed(3)
  })

  const staticLevel = targetLevel(snapshot, 0)

  return (
    <div className="relative flex aspect-square h-full items-center justify-center">
      <span
        ref={ring}
        aria-hidden
        className="absolute inset-0 rounded-full border-2 border-current"
        style={
          reduceMotion
            ? {
                transform: `scale(${0.86 + staticLevel * 0.3})`,
                opacity: 0.12 + staticLevel * 0.4,
              }
            : { transform: "scale(0.86)", opacity: 0.12 }
        }
      />
      <span
        aria-hidden
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-current opacity-0 transition-opacity duration-300 motion-safe:animate-spin [animation-duration:1.4s] group-data-[state=thinking]/voice:opacity-60"
      />
      <span
        ref={core}
        aria-hidden
        className="block size-3/5 rounded-full bg-current"
        style={{
          transform: `scale(${reduceMotion ? 0.78 + staticLevel * 0.22 : 0.78})`,
        }}
      />
    </div>
  )
}

const WAVE_POINTS = 40

function wavePath(amplitude: number, phase: number, frequency: number) {
  let d = ""
  for (let i = 0; i <= WAVE_POINTS; i++) {
    const x = (i / WAVE_POINTS) * 100
    // Taper both ends so the line always rests on the baseline.
    const envelope = Math.sin((Math.PI * i) / WAVE_POINTS)
    const y =
      15 +
      amplitude * envelope * Math.sin((i / WAVE_POINTS) * Math.PI * 2 * frequency + phase)
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)} `
  }
  return d
}

function WaveVisualizer({
  signal,
  snapshot,
  reduceMotion,
  widthClassName,
}: {
  signal: React.RefObject<Signal>
  snapshot: Signal
  reduceMotion: boolean
  widthClassName: string
}) {
  const primary = React.useRef<SVGPathElement>(null)
  const secondary = React.useRef<SVGPathElement>(null)
  const level = React.useRef(0)

  useAnimationFrame((time) => {
    if (reduceMotion || !primary.current || !secondary.current) return
    const t = time / 1000
    const target = targetLevel(signal.current, t)
    level.current += (target - level.current) * 0.14
    const amplitude = 1 + level.current * 12
    const speed = signal.current.state === "thinking" ? 2.4 : 6

    primary.current.setAttribute("d", wavePath(amplitude, t * speed, 1.5))
    secondary.current.setAttribute(
      "d",
      wavePath(amplitude * 0.6, -t * speed * 0.7 + 1.2, 2.2)
    )
  })

  const staticAmplitude = 1 + targetLevel(snapshot, 0) * 12

  return (
    <div className={cn("flex h-full items-center justify-center", widthClassName)}>
      <svg
        viewBox="0 0 100 30"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
        fill="none"
        aria-hidden
      >
        <path
          ref={secondary}
          d={wavePath(staticAmplitude * 0.6, 1.2, 2.2)}
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={1.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          ref={primary}
          d={wavePath(staticAmplitude, 0, 1.5)}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}

export { AiVoiceVisualizer, aiVoiceVisualizerVariants }
