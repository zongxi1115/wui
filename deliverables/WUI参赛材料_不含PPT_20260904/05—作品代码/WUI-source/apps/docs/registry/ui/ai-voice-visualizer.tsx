"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/registry/lib/utils"

export type AiVoiceVisualizerState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"

const aiVoiceVisualizerVariants = cva(
  "inline-flex items-center justify-center select-none",
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

export interface AiVoiceVisualizerProps
  extends Omit<React.ComponentProps<"div">, "children">,
    VariantProps<typeof aiVoiceVisualizerVariants> {
  /** 可视化声波形态（柱状、呼吸光环或正弦曲线）。 @default "bars" */
  variant?: "bars" | "orb" | "wave"
  /** 语音会话当前所处的生命周期状态。 @default "idle" */
  state?: AiVoiceVisualizerState
  /** 实时音频电平归一化数值 [0.0 ~ 1.0]。 */
  audioLevel?: number
  /** 柱状声波模式下的柱子数量。 @default 5 */
  barCount?: number
  /** 尺寸大小。 @default "md" */
  size?: "sm" | "md" | "lg"
}

/** 用于实时语音对话模式的动态声波与光环可视化组件。 */
function AiVoiceVisualizer({
  className,
  size,
  variant = "bars",
  state = "idle",
  audioLevel,
  barCount = 5,
  ...props
}: AiVoiceVisualizerProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div
      data-slot="ai-voice-visualizer"
      data-state={state}
      data-variant={variant}
      className={cn(aiVoiceVisualizerVariants({ size }), className)}
      {...props}
    >
      {variant === "bars" ? (
        <BarsVisualizer
          state={state}
          audioLevel={audioLevel}
          barCount={barCount}
          reduceMotion={reduceMotion}
        />
      ) : variant === "orb" ? (
        <OrbVisualizer
          state={state}
          audioLevel={audioLevel}
          reduceMotion={reduceMotion}
        />
      ) : (
        <WaveVisualizer
          state={state}
          audioLevel={audioLevel}
          reduceMotion={reduceMotion}
        />
      )}
    </div>
  )
}

function BarsVisualizer({
  state,
  audioLevel,
  barCount,
  reduceMotion,
}: {
  state: AiVoiceVisualizerState
  audioLevel?: number
  barCount: number
  reduceMotion: boolean | null
}) {
  const bars = Array.from({ length: barCount })

  return (
    <div className="flex h-full items-center gap-1">
      {bars.map((_, i) => {
        const factor = 1 - Math.abs(i - (barCount - 1) / 2) / (barCount / 2)
        const baseHeight =
          state === "idle"
            ? 20
            : audioLevel !== undefined
              ? Math.max(15, Math.min(100, (audioLevel * 100 * (0.6 + factor * 0.4))))
              : 60

        return (
          <motion.span
            key={i}
            className={cn(
              "w-1 rounded-full transition-colors duration-300",
              state === "idle" && "bg-muted-foreground/40",
              state === "listening" && "bg-info",
              state === "thinking" && "bg-primary",
              state === "speaking" && "bg-primary"
            )}
            style={{ minHeight: "4px" }}
            initial={false}
            animate={
              reduceMotion
                ? { height: `${baseHeight}%` }
                : state === "speaking" || state === "listening"
                  ? {
                      height:
                        audioLevel !== undefined
                          ? `${baseHeight}%`
                          : [`${20 + factor * 20}%`, `${70 + factor * 30}%`, `${20 + factor * 20}%`],
                    }
                  : state === "thinking"
                    ? {
                        height: ["20%", "80%", "20%"],
                      }
                    : { height: "20%" }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : state === "thinking"
                  ? {
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.12,
                      ease: "easeInOut",
                    }
                  : state === "speaking" || state === "listening"
                    ? {
                        duration: 0.5 + i * 0.08,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                    : { duration: 0.2 }
            }
          />
        )
      })}
    </div>
  )
}

function OrbVisualizer({
  state,
  audioLevel = 0,
  reduceMotion,
}: {
  state: AiVoiceVisualizerState
  audioLevel?: number
  reduceMotion: boolean | null
}) {
  const scale =
    state === "idle"
      ? 1
      : state === "thinking"
        ? [1, 1.15, 1]
        : 1 + audioLevel * 0.45

  return (
    <div className="relative flex size-full items-center justify-center">
      {/* Outer subtle glow */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full opacity-40 blur-sm transition-colors duration-300",
          state === "idle" && "bg-muted-foreground/20",
          state === "listening" && "bg-info/50",
          state === "thinking" && "bg-primary/60",
          state === "speaking" && "bg-primary/70"
        )}
        animate={
          reduceMotion
            ? { scale: 1 }
            : state === "thinking" || state === "speaking"
              ? { scale: [0.9, 1.2, 0.9], opacity: [0.3, 0.6, 0.3] }
              : { scale: 1 + audioLevel * 0.6 }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }
      />
      {/* Core orb */}
      <motion.div
        className={cn(
          "size-4/5 rounded-full shadow-inner transition-colors duration-300",
          state === "idle" && "bg-muted-foreground/50",
          state === "listening" && "bg-info shadow-info/30",
          state === "thinking" && "bg-primary shadow-primary/30",
          state === "speaking" && "bg-primary shadow-primary/40"
        )}
        animate={reduceMotion ? { scale: 1 } : { scale }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : state === "thinking"
              ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
              : { type: "spring", stiffness: 350, damping: 25 }
        }
      />
    </div>
  )
}

function WaveVisualizer({
  state,
  audioLevel = 0,
  reduceMotion,
}: {
  state: AiVoiceVisualizerState
  audioLevel?: number
  reduceMotion: boolean | null
}) {
  const amplitude = state === "idle" ? 2 : Math.max(4, audioLevel * 14)

  return (
    <div className="flex h-full w-24 items-center justify-center">
      <svg
        viewBox="0 0 100 30"
        className="h-full w-full overflow-visible"
        fill="none"
      >
        <motion.path
          d={`M 0 15 Q 25 ${15 - amplitude} 50 15 T 100 15`}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className={cn(
            "transition-colors duration-300",
            state === "idle" && "text-muted-foreground/40",
            state === "listening" && "text-info",
            state === "thinking" && "text-primary",
            state === "speaking" && "text-primary"
          )}
          animate={
            reduceMotion || state === "idle"
              ? undefined
              : {
                  d: [
                    `M 0 15 Q 25 ${15 - amplitude} 50 15 T 100 15`,
                    `M 0 15 Q 25 ${15 + amplitude} 50 15 T 100 15`,
                    `M 0 15 Q 25 ${15 - amplitude} 50 15 T 100 15`,
                  ],
                }
          }
          transition={{
            duration: state === "thinking" ? 1 : 0.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  )
}

export { AiVoiceVisualizer, aiVoiceVisualizerVariants }
