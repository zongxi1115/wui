"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { cn } from "@/registry/lib/utils"

export type StepStatus = "wait" | "process" | "finish" | "error"

export interface StepItem {
  /** 步骤标题。 */
  title: React.ReactNode
  /** 标题下方的补充说明。 */
  description?: React.ReactNode
  /** 自定义步骤图标；未提供时显示序号或完成标记。 */
  icon?: React.ReactNode
  /** 覆盖由 current 自动推导的步骤状态。 */
  status?: StepStatus
  /** 禁止点击此步骤。 */
  disabled?: boolean
}

export interface StepsProps extends Omit<
  React.ComponentProps<"ol">,
  "children"
> {
  /** 按顺序展示的步骤。 */
  items: StepItem[]
  /** 当前步骤的索引，从 0 开始。@default 0 */
  current?: number
  /** 步骤排列方向。@default "horizontal" */
  orientation?: "horizontal" | "vertical"
  /** 点击可用步骤时触发；提供后步骤标题会呈现为按钮。 */
  onCurrentChange?: (current: number) => void
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const

function resolveStatus(index: number, current: number): StepStatus {
  if (index < current) return "finish"
  if (index === current) return "process"
  return "wait"
}

/** 完成标记：切换到完成态时以描边动画「画」出对勾。 */
function StepCheck({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5"
    >
      <motion.path
        d="M20 6 9 17l-5-5"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.32, delay: 0.08, ease: EASE_OUT }}
      />
    </svg>
  )
}

/** 错误标记：两笔依次画出的叉号。 */
function StepCross({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.75}
      strokeLinecap="round"
      className="size-3.5"
    >
      {["M18 6 6 18", "m6 6 12 12"].map((d, index) => (
        <motion.path
          key={d}
          d={d}
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.2, delay: 0.06 + index * 0.12, ease: EASE_OUT }}
        />
      ))}
    </svg>
  )
}

/** 以有序列表呈现流程进度，支持横向、纵向与自定义状态。 */
function Steps({
  className,
  items,
  current = 0,
  orientation = "horizontal",
  onCurrentChange,
  ...props
}: StepsProps) {
  const reduceMotion = useReducedMotion()
  const horizontal = orientation === "horizontal"

  return (
    <ol
      data-slot="steps"
      data-orientation={orientation}
      aria-label={props["aria-label"] ?? "步骤进度"}
      className={cn(
        "flex w-full list-none p-0",
        horizontal ? "flex-row" : "max-w-md flex-col gap-0",
        className
      )}
      {...props}
    >
      {items.map((item, index) => {
        const status = item.status ?? resolveStatus(index, current)
        const interactive = Boolean(onCurrentChange) && !item.disabled
        const glyph = item.icon ? "icon" : status === "finish" || status === "error" ? status : "index"

        const content = (
          <>
            <span
              data-slot="step-indicator"
              aria-hidden="true"
              className={cn(
                "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold tabular-nums transition-[color,background-color,border-color,box-shadow] duration-300",
                status === "wait" &&
                  "border-border bg-background text-muted-foreground",
                status === "process" &&
                  "border-primary bg-primary text-primary-foreground ring-4 ring-primary/15",
                status === "finish" &&
                  "border-primary bg-primary/10 text-primary",
                status === "error" &&
                  "border-destructive bg-destructive/10 text-destructive ring-4 ring-destructive/10"
              )}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={glyph}
                  className="flex items-center justify-center [&_svg]:size-3.5"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
                  transition={
                    reduceMotion ? { duration: 0 } : { duration: 0.2, ease: EASE_OUT }
                  }
                >
                  {glyph === "icon" ? (
                    item.icon
                  ) : glyph === "finish" ? (
                    <StepCheck reduceMotion={reduceMotion} />
                  ) : glyph === "error" ? (
                    <StepCross reduceMotion={reduceMotion} />
                  ) : (
                    index + 1
                  )}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="min-w-0 pt-0.5">
              <span
                data-slot="step-title"
                className={cn(
                  "block text-sm font-medium leading-6 transition-colors duration-300",
                  status === "wait" && "text-muted-foreground",
                  status === "error" && "text-destructive"
                )}
              >
                {item.title}
              </span>
              {item.description ? (
                <span
                  data-slot="step-description"
                  className="text-muted-foreground mt-0.5 block text-sm leading-5"
                >
                  {item.description}
                </span>
              ) : null}
            </span>
          </>
        )

        return (
          <li
            key={index}
            data-slot="step"
            data-status={status}
            aria-current={status === "process" ? "step" : undefined}
            className={cn(
              "relative flex min-w-0",
              horizontal
                ? "flex-1 items-start gap-3 pr-5 last:flex-none last:pr-0"
                : "min-h-20 items-start gap-3 pb-6 last:min-h-0 last:pb-0",
              item.disabled && "opacity-50"
            )}
          >
            {index < items.length - 1 ? (
              <span
                data-slot="step-separator"
                aria-hidden="true"
                className={cn(
                  "bg-border absolute overflow-hidden rounded-full",
                  horizontal
                    ? "left-9 top-3.5 h-px w-[calc(100%-2.75rem)]"
                    : "bottom-1 left-3.5 top-8 w-px"
                )}
              >
                <motion.span
                  data-slot="step-separator-fill"
                  className={cn(
                    "bg-primary absolute inset-0",
                    horizontal ? "origin-left" : "origin-top"
                  )}
                  initial={false}
                  animate={
                    horizontal
                      ? { scaleX: status === "finish" ? 1 : 0 }
                      : { scaleY: status === "finish" ? 1 : 0 }
                  }
                  transition={
                    reduceMotion ? { duration: 0 } : { duration: 0.42, ease: EASE_OUT }
                  }
                />
              </span>
            ) : null}
            {interactive ? (
              <button
                type="button"
                data-slot="step-trigger"
                className="bg-background focus-visible:ring-ring/40 group relative z-10 flex min-w-0 items-start gap-3 rounded-md pr-3 text-left outline-none focus-visible:ring-[3px] [&:hover_[data-slot=step-title]]:text-foreground"
                onClick={() => onCurrentChange?.(index)}
              >
                {content}
              </button>
            ) : (
              <div
                data-slot="step-content"
                className="bg-background relative z-10 flex min-w-0 items-start gap-3 pr-3"
              >
                {content}
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}

export { Steps }
