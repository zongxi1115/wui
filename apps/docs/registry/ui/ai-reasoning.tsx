"use client"

import * as React from "react"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"
import { cva } from "class-variance-authority"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  CheckIcon,
  ChevronDownIcon,
  CircleIcon,
  LoaderCircleIcon,
} from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { TextShimmer } from "@/registry/ui/text-shimmer"

type AiReasoningStepStatus = "pending" | "active" | "complete"

const easeOut = [0.22, 1, 0.36, 1] as const
const iconSpring = {
  type: "spring",
  stiffness: 520,
  damping: 30,
  mass: 0.6,
} as const

const AiReasoningContext = React.createContext<{
  duration?: number
  elapsed: number
  isOpen: boolean
  isStreaming: boolean
}>({ elapsed: 0, isOpen: false, isStreaming: false })

const aiReasoningStepVariants = cva(
  "relative flex gap-3 pb-4 transition-[color,opacity] duration-300 after:absolute after:left-[7.5px] after:top-5 after:bottom-0 after:w-px after:bg-border last:pb-0 last:after:hidden",
  {
    variants: {
      status: {
        pending: "text-muted-foreground opacity-65",
        active: "text-foreground",
        complete: "text-muted-foreground",
      },
    },
    defaultVariants: { status: "pending" },
  }
)

function formatSeconds(seconds: number) {
  return Number.isInteger(seconds) ? String(seconds) : seconds.toFixed(1)
}

export interface AiReasoningProps extends React.ComponentProps<
  typeof CollapsiblePrimitive.Root
> {
  /** Whether reasoning is still arriving. @default false */
  isStreaming?: boolean
  /**
   * Completed reasoning time in seconds. When omitted, the component measures
   * how long `isStreaming` stayed true and shows that instead.
   */
  duration?: number
}

/** A disclosure for model-provided reasoning summaries and progress steps. */
function AiReasoning({
  className,
  isStreaming = false,
  duration,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  ...props
}: AiReasoningProps) {
  const [internalOpen, setInternalOpen] = React.useState(
    defaultOpen || isStreaming
  )
  const [elapsed, setElapsed] = React.useState(0)
  const [measured, setMeasured] = React.useState<number>()
  const controlled = open !== undefined
  const resolvedOpen = controlled ? open : internalOpen
  const previousStreaming = React.useRef(isStreaming)
  const startedAt = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (controlled) return
    if (isStreaming) setInternalOpen(true)
    if (previousStreaming.current && !isStreaming) setInternalOpen(false)
    previousStreaming.current = isStreaming
  }, [controlled, isStreaming])

  React.useEffect(() => {
    if (!isStreaming) {
      if (startedAt.current !== null) {
        setMeasured(
          Math.round((performance.now() - startedAt.current) / 100) / 10
        )
        startedAt.current = null
      }
      return
    }

    const start = performance.now()
    startedAt.current = start
    setElapsed(0)
    const timer = window.setInterval(() => {
      setElapsed(Math.floor((performance.now() - start) / 1000))
    }, 250)
    return () => window.clearInterval(timer)
  }, [isStreaming])

  return (
    <AiReasoningContext.Provider
      value={{
        duration: duration ?? measured,
        elapsed,
        isOpen: resolvedOpen,
        isStreaming,
      }}
    >
      <CollapsiblePrimitive.Root
        asChild
        open={resolvedOpen}
        onOpenChange={(next) => {
          if (!controlled) setInternalOpen(next)
          onOpenChange?.(next)
        }}
        {...props}
      >
        <div
          data-slot="ai-reasoning"
          data-streaming={isStreaming ? "true" : "false"}
          className={cn("text-sm", className)}
        >
          {children}
        </div>
      </CollapsiblePrimitive.Root>
    </AiReasoningContext.Provider>
  )
}

export interface AiReasoningTriggerProps extends React.ComponentProps<
  typeof CollapsiblePrimitive.Trigger
> {
  /** Customize the trigger summary. */
  getLabel?: (isStreaming: boolean, duration?: number) => React.ReactNode
}

function AiReasoningTrigger({
  className,
  children,
  getLabel,
  ...props
}: AiReasoningTriggerProps) {
  const { duration, elapsed, isOpen, isStreaming } =
    React.useContext(AiReasoningContext)
  const reduceMotion = useReducedMotion()
  const label = getLabel ? (
    getLabel(isStreaming, duration)
  ) : isStreaming ? (
    <span className="inline-flex items-baseline gap-1.5">
      <TextShimmer duration={1.6}>正在思考</TextShimmer>
      {elapsed > 0 ? (
        <span className="text-xs tabular-nums text-muted-foreground/70">
          {elapsed}s
        </span>
      ) : null}
    </span>
  ) : duration ? (
    `思考了 ${formatSeconds(duration)} 秒`
  ) : (
    "查看思考过程"
  )

  return (
    <CollapsiblePrimitive.Trigger
      data-slot="ai-reasoning-trigger"
      className={cn(
        "text-muted-foreground hover:text-foreground focus-visible:ring-ring/35 group relative flex items-center gap-1.5 rounded-md py-1 text-sm outline-none transition-colors focus-visible:ring-[3px]",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={isStreaming ? "streaming" : "settled"}
              className="inline-flex"
              initial={
                reduceMotion ? false : { opacity: 0, y: 4, filter: "blur(2px)" }
              }
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={
                reduceMotion
                  ? undefined
                  : { opacity: 0, y: -4, filter: "blur(2px)" }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.24, ease: easeOut }
              }
            >
              {label}
            </motion.span>
          </AnimatePresence>
          <motion.span
            className="flex size-3.5 items-center justify-center"
            initial={false}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 480, damping: 34 }
            }
          >
            <ChevronDownIcon className="size-3.5" />
          </motion.span>
        </>
      )}
    </CollapsiblePrimitive.Trigger>
  )
}

function AiReasoningContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Content>) {
  return (
    <CollapsiblePrimitive.Content
      data-slot="ai-reasoning-content"
      className={cn(
        "text-muted-foreground overflow-hidden text-sm leading-6 duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down motion-reduce:animate-none",
        className
      )}
      {...props}
    >
      <div data-slot="ai-reasoning-content-inner" className="min-w-0 pt-2">
        {children}
      </div>
    </CollapsiblePrimitive.Content>
  )
}

export interface AiReasoningStepProps extends Omit<
  React.ComponentProps<typeof motion.div>,
  "children"
> {
  /** Progress state for this visible reasoning summary. @default "pending" */
  status?: AiReasoningStepStatus
  /** Short step label. Plain-text labels shimmer while the step is active. */
  label?: React.ReactNode
  /** Optional supporting description. */
  description?: React.ReactNode
  /** Optional icon used for this kind of reasoning activity. */
  icon?: React.ReactNode
  /** Optional metadata aligned to the end of the step. */
  meta?: React.ReactNode
  /** Arbitrary React content rendered in the step body. */
  children?: React.ReactNode
}

function AiReasoningStep({
  className,
  status = "pending",
  label,
  description,
  icon,
  meta,
  children,
  ...props
}: AiReasoningStepProps) {
  const reduceMotion = useReducedMotion()
  const Icon =
    status === "complete"
      ? CheckIcon
      : status === "active"
        ? LoaderCircleIcon
        : CircleIcon

  return (
    <motion.div
      data-slot="ai-reasoning-step"
      data-status={status}
      className={cn(aiReasoningStepVariants({ status }), className)}
      initial={reduceMotion ? false : { opacity: 0, y: 4, filter: "blur(2px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={
        reduceMotion ? { duration: 0 } : { duration: 0.32, ease: easeOut }
      }
      {...props}
    >
      <span className="bg-background relative z-10 mt-1 flex size-4 shrink-0 items-center justify-center">
        {icon ?? (
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={status}
              className="flex items-center justify-center"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.4 }}
              transition={reduceMotion ? { duration: 0 } : iconSpring}
            >
              <Icon
                className={cn(
                  "size-3",
                  status === "active" && "text-info motion-safe:animate-spin",
                  status === "complete" && "text-success"
                )}
              />
            </motion.span>
          </AnimatePresence>
        )}
      </span>
      <div className="min-w-0 flex-1">
        {label || meta ? (
          <div className="flex min-w-0 items-start justify-between gap-4">
            {label ? (
              <div
                data-slot="ai-reasoning-step-label"
                className="min-w-0 font-medium"
              >
                {status === "active" && typeof label === "string" ? (
                  <TextShimmer duration={1.8}>{label}</TextShimmer>
                ) : (
                  label
                )}
              </div>
            ) : null}
            {meta ? (
              <div
                data-slot="ai-reasoning-step-meta"
                className="text-muted-foreground shrink-0 text-xs tabular-nums"
              >
                {meta}
              </div>
            ) : null}
          </div>
        ) : null}
        {description ? (
          <div
            data-slot="ai-reasoning-step-description"
            className="mt-0.5 text-xs leading-5"
          >
            {description}
          </div>
        ) : null}
        {children ? (
          <div data-slot="ai-reasoning-step-content" className="mt-1 min-w-0">
            {children}
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}

export {
  AiReasoning,
  AiReasoningContent,
  AiReasoningStep,
  AiReasoningTrigger,
  aiReasoningStepVariants,
}
