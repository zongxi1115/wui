"use client"

import * as React from "react"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"
import { cva } from "class-variance-authority"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  BrainCircuitIcon,
  CheckIcon,
  ChevronDownIcon,
  CircleIcon,
  LoaderCircleIcon,
} from "lucide-react"

import { cn } from "@/registry/lib/utils"
import {
  AiStream,
  AiStreamDeltas,
  type AiStreamDeltasProps,
  type AiStreamProps,
} from "@/registry/ui/ai-stream"

type AiReasoningStepStatus = "pending" | "active" | "complete"

const AiReasoningContext = React.createContext<{
  duration?: number
  isOpen: boolean
  isStreaming: boolean
}>({ isOpen: false, isStreaming: false })

const aiReasoningStepVariants = cva("relative flex gap-3 pb-4 last:pb-0", {
  variants: {
    status: {
      pending: "text-muted-foreground opacity-65",
      active: "text-foreground",
      complete: "text-muted-foreground",
    },
  },
  defaultVariants: { status: "pending" },
})

export interface AiReasoningProps
  extends React.ComponentProps<typeof CollapsiblePrimitive.Root> {
  /** Whether reasoning is still arriving. @default false */
  isStreaming?: boolean
  /** Completed reasoning time in seconds. */
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
  const controlled = open !== undefined
  const resolvedOpen = controlled ? open : internalOpen
  const previousStreaming = React.useRef(isStreaming)

  React.useEffect(() => {
    if (controlled) return
    if (isStreaming) setInternalOpen(true)
    if (previousStreaming.current && !isStreaming) setInternalOpen(false)
    previousStreaming.current = isStreaming
  }, [controlled, isStreaming])

  return (
    <AiReasoningContext.Provider
      value={{ duration, isOpen: resolvedOpen, isStreaming }}
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

export interface AiReasoningTriggerProps
  extends React.ComponentProps<typeof CollapsiblePrimitive.Trigger> {
  /** Customize the trigger summary. */
  getLabel?: (isStreaming: boolean, duration?: number) => React.ReactNode
}

function AiReasoningTrigger({
  className,
  children,
  getLabel,
  ...props
}: AiReasoningTriggerProps) {
  const { duration, isOpen, isStreaming } =
    React.useContext(AiReasoningContext)
  const reduceMotion = useReducedMotion()
  const label = getLabel
    ? getLabel(isStreaming, duration)
    : isStreaming
      ? "正在思考…"
      : duration
        ? `思考完成 · ${duration.toFixed(1)} 秒`
        : "查看思考过程"

  return (
    <CollapsiblePrimitive.Trigger
      data-slot="ai-reasoning-trigger"
      className={cn(
        "group flex items-center gap-2 rounded-md py-1 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/35",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={isStreaming ? "streaming" : "complete"}
              className="flex size-4 items-center justify-center"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.72 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.72 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 520, damping: 32 }
              }
            >
              {isStreaming ? (
                <LoaderCircleIcon className="size-4 motion-safe:animate-spin" />
              ) : (
                <BrainCircuitIcon className="size-4" />
              )}
            </motion.span>
          </AnimatePresence>
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={String(label)}
              initial={reduceMotion ? false : { opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -3 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
              }
            >
              {label}
            </motion.span>
          </AnimatePresence>
          <motion.span
            className="flex size-3.5 items-center justify-center"
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
        "mt-2 overflow-hidden border-l pl-4 text-sm leading-6 text-muted-foreground data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1 motion-reduce:animate-none",
        className
      )}
      {...props}
    >
      <div data-slot="ai-reasoning-content-inner" className="min-w-0">
        {children}
      </div>
    </CollapsiblePrimitive.Content>
  )
}

export interface AiReasoningStreamProps
  extends Omit<AiStreamProps, "isStreaming"> {}

/** Renders cumulative stream text with a soft live edge instead of a cursor. */
function AiReasoningStream({
  ...props
}: AiReasoningStreamProps) {
  const { isStreaming } = React.useContext(AiReasoningContext)

  return <AiStream data-slot="ai-reasoning-stream" isStreaming={isStreaming} {...props} />
}

export interface AiReasoningDeltasProps
  extends Omit<AiStreamDeltasProps, "isStreaming"> {}

/** Renders each incoming delta as a short, independent fade-in segment. */
function AiReasoningDeltas({
  ...props
}: AiReasoningDeltasProps) {
  const { isStreaming } = React.useContext(AiReasoningContext)

  return (
    <AiStreamDeltas
      data-slot="ai-reasoning-deltas"
      isStreaming={isStreaming}
      {...props}
    />
  )
}

export interface AiReasoningStepProps extends React.ComponentProps<"div"> {
  /** Progress state for this visible reasoning summary. @default "pending" */
  status?: AiReasoningStepStatus
  /** Short step label. */
  label?: React.ReactNode
  /** Optional supporting description. */
  description?: React.ReactNode
}

function AiReasoningStep({
  className,
  status = "pending",
  label,
  description,
  children,
  ...props
}: AiReasoningStepProps) {
  const Icon =
    status === "complete"
      ? CheckIcon
      : status === "active"
        ? LoaderCircleIcon
        : CircleIcon

  return (
    <div
      data-slot="ai-reasoning-step"
      data-status={status}
      className={cn(aiReasoningStepVariants({ status }), className)}
      {...props}
    >
      <span className="relative z-10 mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-background">
        <Icon
          className={cn(
            "size-3",
            status === "active" && "text-info motion-safe:animate-spin",
            status === "complete" && "text-success"
          )}
        />
      </span>
      <div className="min-w-0 flex-1">
        {label ? (
          <div data-slot="ai-reasoning-step-label" className="font-medium">
            {label}
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
        {children}
      </div>
    </div>
  )
}

export {
  AiReasoning,
  AiReasoningContent,
  AiReasoningDeltas,
  AiReasoningStep,
  AiReasoningStream,
  AiReasoningTrigger,
  aiReasoningStepVariants,
}
