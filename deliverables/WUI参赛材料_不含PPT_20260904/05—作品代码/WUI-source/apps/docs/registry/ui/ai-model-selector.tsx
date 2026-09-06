"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"
import {
  CheckIcon,
  ChevronDownIcon,
  CpuIcon,
  SparklesIcon,
} from "lucide-react"

import { cn } from "@/registry/lib/utils"

/* -------------------------------------------------------------------------- */
/*                               AiModelSelector                              */
/* -------------------------------------------------------------------------- */

export interface AiModelSelectorProps
  extends React.ComponentProps<typeof PopoverPrimitive.Root> {
  /** 默认是否展开模型选择弹层（非受控）。 */
  defaultOpen?: boolean
  /** 是否展开模型选择弹层（受控）。 */
  open?: boolean
  /** 弹层展开或关闭状态改变时的回调函数。 */
  onOpenChange?: (open: boolean) => void
  /** 是否以模态方式呈现。 @default false */
  modal?: boolean
}

/** 专用于大模型切换与参数配置的下拉选择器。 */
function AiModelSelector({ children, ...props }: AiModelSelectorProps) {
  return (
    <PopoverPrimitive.Root data-slot="ai-model-selector" {...props}>
      {children}
    </PopoverPrimitive.Root>
  )
}

/* -------------------------------------------------------------------------- */
/*                            AiModelSelectorTrigger                          */
/* -------------------------------------------------------------------------- */

const aiModelSelectorTriggerVariants = cva(
  "inline-flex items-center justify-between gap-2 rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "shadow-xs",
        ghost: "border-transparent bg-transparent hover:bg-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface AiModelSelectorTriggerProps
  extends React.ComponentProps<typeof PopoverPrimitive.Trigger>,
    VariantProps<typeof aiModelSelectorTriggerVariants> {
  /** Optional icon rendered on the left of the model name. */
  icon?: React.ReactNode
}

function AiModelSelectorTrigger({
  className,
  variant,
  icon,
  children,
  ...props
}: AiModelSelectorTriggerProps) {
  return (
    <PopoverPrimitive.Trigger
      data-slot="ai-model-selector-trigger"
      className={cn(aiModelSelectorTriggerVariants({ variant }), className)}
      {...props}
    >
      <div className="flex items-center gap-1.5 min-w-0">
        {icon ?? <SparklesIcon className="size-3.5 text-primary shrink-0" />}
        <span className="truncate">{children}</span>
      </div>
      <ChevronDownIcon className="size-3 text-muted-foreground shrink-0 opacity-70" />
    </PopoverPrimitive.Trigger>
  )
}

/* -------------------------------------------------------------------------- */
/*                            AiModelSelectorContent                          */
/* -------------------------------------------------------------------------- */

export interface AiModelSelectorContentProps
  extends React.ComponentProps<typeof PopoverPrimitive.Content> {}

function AiModelSelectorContent({
  className,
  align = "start",
  sideOffset = 6,
  children,
  ...props
}: AiModelSelectorContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="ai-model-selector-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-border/80 bg-popover p-1.5 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className
        )}
        {...props}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

/* -------------------------------------------------------------------------- */
/*                                AiModelGroup                                */
/* -------------------------------------------------------------------------- */

export interface AiModelGroupProps extends React.ComponentProps<"div"> {
  /** Group title label. */
  heading?: React.ReactNode
}

function AiModelGroup({
  className,
  heading,
  children,
  ...props
}: AiModelGroupProps) {
  return (
    <div
      data-slot="ai-model-group"
      className={cn("flex flex-col py-1", className)}
      {...props}
    >
      {heading && (
        <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {heading}
        </div>
      )}
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                 AiModelItem                                */
/* -------------------------------------------------------------------------- */

export interface AiModelItemProps
  extends Omit<React.ComponentProps<"button">, "name"> {
  /** 模型名称或标题。 */
  name: React.ReactNode
  /** 模型的简短描述或特性。 */
  description?: React.ReactNode
  /** 当前模型是否处于选中状态。 @default false */
  selected?: boolean
  /** 模型厂商或类型专属图标。 */
  icon?: React.ReactNode
  /** 模型能力或参数标签（如 Vision、Reasoning）。 */
  badge?: React.ReactNode
}

function AiModelItem({
  className,
  name,
  description,
  selected = false,
  icon,
  badge,
  ...props
}: AiModelItemProps) {
  return (
    <button
      type="button"
      data-slot="ai-model-item"
      data-selected={selected ? "true" : "false"}
      className={cn(
        "group relative flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left text-xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 cursor-pointer",
        selected && "bg-muted/80 text-foreground font-medium",
        className
      )}
      {...props}
    >
      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center text-muted-foreground group-hover:text-foreground">
        {icon ?? <CpuIcon className="size-3.5" />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1.5">
          <span className="truncate font-semibold text-foreground">{name}</span>
          {badge}
        </div>
        {description && (
          <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground font-normal">
            {description}
          </p>
        )}
      </div>
      {selected && (
        <CheckIcon className="mt-0.5 size-3.5 text-primary shrink-0" />
      )}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/*                                 AiTokenUsage                               */
/* -------------------------------------------------------------------------- */

export interface AiTokenUsageProps extends React.ComponentProps<"div"> {
  /** Used token count. */
  used: number
  /** Maximum context window limit. */
  limit: number
  /** Label describing the quota. @default "Context Window" */
  label?: string
  /** Whether to show percentage string. @default true */
  showPercentage?: boolean
}

function AiTokenUsage({
  className,
  used,
  limit,
  label = "Context Window",
  showPercentage = true,
  ...props
}: AiTokenUsageProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((used / limit) * 100)))

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `${(num / 1_000).toFixed(0)}k`
    return num.toString()
  }

  const statusColor =
    percentage >= 95
      ? "bg-destructive"
      : percentage >= 80
        ? "bg-warning"
        : "bg-primary"

  return (
    <div
      data-slot="ai-token-usage"
      className={cn("flex flex-col gap-1.5 border-t border-border/60 p-2 text-xs", className)}
      {...props}
    >
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono">
          {formatNumber(used)} / {formatNumber(limit)}
          {showPercentage && ` (${percentage}%)`}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full transition-all duration-300", statusColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export {
  AiModelGroup,
  AiModelItem,
  AiModelSelector,
  AiModelSelectorContent,
  AiModelSelectorTrigger,
  AiTokenUsage,
  aiModelSelectorTriggerVariants,
}
