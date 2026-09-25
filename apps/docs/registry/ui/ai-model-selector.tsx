"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  ChevronDownIcon,
  CpuIcon,
  SparklesIcon,
} from "lucide-react"

import { cn } from "@/registry/lib/utils"

const glideSpring = {
  type: "spring",
  stiffness: 520,
  damping: 38,
  mass: 0.7,
} as const

type AiModelListContextValue = {
  layoutId: string
  highlighted: string | null
  setHighlighted: (id: string | null) => void
}

const AiModelListContext = React.createContext<AiModelListContextValue | null>(
  null
)

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
  return <PopoverPrimitive.Root {...props}>{children}</PopoverPrimitive.Root>
}

/* -------------------------------------------------------------------------- */
/*                            AiModelSelectorTrigger                          */
/* -------------------------------------------------------------------------- */

const aiModelSelectorTriggerVariants = cva(
  "group inline-flex cursor-pointer select-none items-center justify-between gap-2 rounded-md border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground outline-none transition-colors hover:bg-muted/50 focus-visible:ring-[3px] focus-visible:ring-ring/35 data-[state=open]:bg-muted/50",
  {
    variants: {
      variant: {
        default: "shadow-xs",
        ghost: "border-transparent bg-transparent hover:bg-muted data-[state=open]:bg-muted",
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
  const reduceMotion = useReducedMotion()
  const label = typeof children === "string" ? children : undefined

  return (
    <PopoverPrimitive.Trigger
      data-slot="ai-model-selector-trigger"
      className={cn(aiModelSelectorTriggerVariants({ variant }), className)}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-1.5">
        <span className="flex size-3.5 shrink-0 items-center justify-center [&_svg]:size-3.5">
          {icon ?? <SparklesIcon className="text-muted-foreground" />}
        </span>
        <span className="relative min-w-0 truncate">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={label ?? "custom"}
              className="block truncate"
              initial={reduceMotion ? false : { opacity: 0, y: 6, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -6, filter: "blur(2px)" }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
              }
            >
              {children}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
      <ChevronDownIcon className="size-3 shrink-0 text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[state=open]:rotate-180 motion-reduce:transition-none" />
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
  onKeyDown,
  ...props
}: AiModelSelectorContentProps) {
  const layoutId = React.useId()
  const [highlighted, setHighlighted] = React.useState<string | null>(null)

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="ai-model-selector-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-72 max-w-[calc(100vw-2rem)] origin-(--radix-popover-content-transform-origin) rounded-lg border bg-popover p-1 text-popover-foreground shadow-md outline-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-[0.97] data-[state=open]:zoom-in-[0.97] data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1",
          className
        )}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (event.defaultPrevented) return
          if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return

          const items = Array.from(
            event.currentTarget.querySelectorAll<HTMLButtonElement>(
              '[data-slot="ai-model-item"]:not(:disabled)'
            )
          )
          if (!items.length) return
          event.preventDefault()
          const index = items.indexOf(document.activeElement as HTMLButtonElement)
          const next =
            event.key === "Home"
              ? 0
              : event.key === "End"
                ? items.length - 1
                : index < 0
                  ? 0
                  : (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) %
                    items.length
          items[next]?.focus()
        }}
        onPointerLeave={() => setHighlighted(null)}
        {...props}
      >
        <AiModelListContext.Provider
          value={{ layoutId, highlighted, setHighlighted }}
        >
          {children}
        </AiModelListContext.Provider>
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
  const headingId = React.useId()

  return (
    <div
      role="group"
      aria-labelledby={heading ? headingId : undefined}
      data-slot="ai-model-group"
      className={cn("flex flex-col py-1", className)}
      {...props}
    >
      {heading && (
        <div
          id={headingId}
          className="px-2 pb-1 pt-0.5 text-[11px] font-medium text-muted-foreground"
        >
          {heading}
        </div>
      )}
      <div className="flex flex-col gap-px">{children}</div>
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
  onPointerEnter,
  onFocus,
  ...props
}: AiModelItemProps) {
  const id = React.useId()
  const list = React.useContext(AiModelListContext)
  const reduceMotion = useReducedMotion()
  // The highlight follows the pointer/focus and settles back on the selection.
  const highlighted = list
    ? (list.highlighted ?? (selected ? id : null)) === id
    : selected

  return (
    <button
      type="button"
      data-slot="ai-model-item"
      data-selected={selected ? "true" : "false"}
      data-highlighted={highlighted ? "true" : undefined}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "group relative isolate flex w-full cursor-pointer items-start gap-2.5 rounded-md px-2 py-2 text-left text-xs outline-none transition-colors disabled:pointer-events-none disabled:opacity-50",
        !list && "hover:bg-muted",
        !list && selected && "bg-muted",
        className
      )}
      onPointerEnter={(event) => {
        list?.setHighlighted(id)
        onPointerEnter?.(event)
      }}
      onFocus={(event) => {
        list?.setHighlighted(id)
        onFocus?.(event)
      }}
      {...props}
    >
      {list && highlighted ? (
        <motion.span
          aria-hidden
          layoutId={`${list.layoutId}-highlight`}
          className="absolute inset-0 z-[-1] rounded-md bg-muted"
          transition={reduceMotion ? { duration: 0 } : glideSpring}
        />
      ) : null}
      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center text-muted-foreground transition-colors group-data-[highlighted=true]:text-foreground [&_svg]:size-3.5">
        {icon ?? <CpuIcon />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate font-medium text-foreground">{name}</span>
          {badge}
        </div>
        {description && (
          <p className="mt-0.5 line-clamp-1 text-[11px] font-normal text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <span className="mt-0.5 flex size-3.5 shrink-0 items-center justify-center">
        <AnimatePresence initial={false}>
          {selected ? (
            <motion.svg
              key="check"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-3.5 text-foreground"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.6 }}
              transition={reduceMotion ? { duration: 0 } : glideSpring}
            >
              <motion.path
                d="M20 6 9 17l-5-5"
                initial={reduceMotion ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.28, ease: [0.22, 1, 0.36, 1], delay: 0.05 }
                }
              />
            </motion.svg>
          ) : null}
        </AnimatePresence>
      </span>
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

function formatTokens(num: number) {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}k`
  return num.toString()
}

function AiTokenUsage({
  className,
  used,
  limit,
  label = "Context Window",
  showPercentage = true,
  ...props
}: AiTokenUsageProps) {
  const reduceMotion = useReducedMotion()
  const ratio = limit > 0 ? Math.min(1, Math.max(0, used / limit)) : 0
  const percentage = Math.round(ratio * 100)

  const statusColor =
    percentage >= 95
      ? "bg-destructive"
      : percentage >= 80
        ? "bg-warning"
        : "bg-primary"

  return (
    <div
      data-slot="ai-token-usage"
      className={cn("mt-1 flex flex-col gap-1.5 border-t px-2 pb-1.5 pt-2.5 text-xs", className)}
      {...props}
    >
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono tabular-nums">
          {formatTokens(used)} / {formatTokens(limit)}
          {showPercentage && ` · ${percentage}%`}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-valuenow={used}
        className="h-1 w-full overflow-hidden rounded-full bg-muted"
      >
        <motion.div
          className={cn("h-full origin-left rounded-full transition-colors duration-300", statusColor)}
          initial={reduceMotion ? false : { scaleX: 0 }}
          animate={{ scaleX: ratio }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 180, damping: 26, delay: 0.08 }
          }
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
