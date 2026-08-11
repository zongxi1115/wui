"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

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

function resolveStatus(index: number, current: number): StepStatus {
  if (index < current) return "finish"
  if (index === current) return "process"
  return "wait"
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
  return (
    <ol
      data-slot="steps"
      data-orientation={orientation}
      aria-label={props["aria-label"] ?? "步骤进度"}
      className={cn(
        "flex w-full list-none p-0",
        orientation === "horizontal" ? "flex-row" : "max-w-md flex-col gap-0",
        className
      )}
      {...props}
    >
      {items.map((item, index) => {
        const status = item.status ?? resolveStatus(index, current)
        const interactive = Boolean(onCurrentChange) && !item.disabled
        const content = (
          <>
            <span
              data-slot="step-indicator"
              aria-hidden="true"
              className={cn(
                "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                status === "wait" &&
                  "border-border bg-background text-muted-foreground",
                status === "process" &&
                  "border-primary bg-primary text-primary-foreground",
                status === "finish" &&
                  "border-primary bg-primary/10 text-primary",
                status === "error" &&
                  "border-destructive bg-destructive/10 text-destructive"
              )}
            >
              {item.icon ??
                (status === "finish" ? (
                  <CheckIcon className="size-4" />
                ) : (
                  index + 1
                ))}
            </span>
            <span className="min-w-0 pt-0.5">
              <span
                data-slot="step-title"
                className={cn(
                  "block text-sm font-medium leading-6",
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
              orientation === "horizontal"
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
                  "bg-border absolute",
                  orientation === "horizontal"
                    ? "left-9 top-3.5 h-px w-[calc(100%-2.75rem)]"
                    : "bottom-1 left-3.5 top-8 w-px",
                  status === "finish" && "bg-primary/60"
                )}
              />
            ) : null}
            {interactive ? (
              <button
                type="button"
                data-slot="step-trigger"
                className="focus-visible:ring-ring bg-background relative z-10 flex min-w-0 items-start gap-3 pr-3 text-left outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-offset-2"
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
