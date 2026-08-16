"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  PencilIcon,
  RotateCwIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react"

import { cn } from "@/registry/lib/utils"

/* -------------------------------------------------------------------------- */
/*                              AiMessageActions                              */
/* -------------------------------------------------------------------------- */

const aiMessageActionsVariants = cva(
  "inline-flex items-center gap-1 text-muted-foreground transition-opacity duration-150",
  {
    variants: {
      variant: {
        ghost: "",
        bordered: "rounded-lg border border-border/80 bg-background/80 px-1 py-0.5 shadow-xs backdrop-blur-xs",
      },
    },
    defaultVariants: {
      variant: "ghost",
    },
  }
)

export interface AiMessageActionsProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof aiMessageActionsVariants> {
  /** 外观样式变体。 @default "ghost" */
  variant?: "ghost" | "bordered"
}

/** 专用于消息底部的快捷操作工具栏。 */
function AiMessageActions({
  className,
  variant,
  children,
  ...props
}: AiMessageActionsProps) {
  return (
    <div
      data-slot="ai-message-actions"
      className={cn(aiMessageActionsVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                               AiMessageAction                              */
/* -------------------------------------------------------------------------- */

export interface AiMessageActionProps extends React.ComponentProps<"button"> {
  /** Accessible label and browser tooltip. */
  label?: string
  /** Active / selected visual highlight. @default false */
  active?: boolean
}

function AiMessageAction({
  className,
  label,
  active = false,
  children,
  ...props
}: AiMessageActionProps) {
  return (
    <button
      type="button"
      data-slot="ai-message-action"
      aria-label={label}
      title={label}
      data-active={active ? "true" : "false"}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-md text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
        active && "bg-muted/80 text-foreground font-medium",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/*                              AiMessageFeedback                             */
/* -------------------------------------------------------------------------- */

export type AiMessageFeedbackValue = "like" | "dislike" | null

export interface AiMessageFeedbackProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  /** 当前点赞/点踩反馈状态。 */
  value?: AiMessageFeedbackValue
  /** 默认点赞/点踩反馈状态。 */
  defaultValue?: AiMessageFeedbackValue
  /** 反馈状态切换时的回调函数。 */
  onChange?: (value: AiMessageFeedbackValue) => void
}

function AiMessageFeedback({
  className,
  value: controlledValue,
  defaultValue = null,
  onChange,
  ...props
}: AiMessageFeedbackProps) {
  const [internalValue, setInternalValue] = React.useState<AiMessageFeedbackValue>(defaultValue)
  const reduceMotion = useReducedMotion()

  const value = controlledValue !== undefined ? controlledValue : internalValue

  const handleVote = (target: "like" | "dislike") => {
    const next = value === target ? null : target
    if (controlledValue === undefined) {
      setInternalValue(next)
    }
    onChange?.(next)
  }

  return (
    <div
      data-slot="ai-message-feedback"
      className={cn("flex items-center gap-0.5", className)}
      {...props}
    >
      <AiMessageAction
        label="点赞"
        active={value === "like"}
        onClick={() => handleVote("like")}
        className={cn(value === "like" && "text-primary hover:text-primary")}
      >
        <motion.span
          animate={value === "like" && !reduceMotion ? { scale: [1, 1.25, 1] } : undefined}
          transition={{ duration: 0.2 }}
        >
          <ThumbsUpIcon className="size-3.5" />
        </motion.span>
      </AiMessageAction>

      <AiMessageAction
        label="点踩"
        active={value === "dislike"}
        onClick={() => handleVote("dislike")}
        className={cn(value === "dislike" && "text-destructive hover:text-destructive")}
      >
        <motion.span
          animate={value === "dislike" && !reduceMotion ? { scale: [1, 1.25, 1] } : undefined}
          transition={{ duration: 0.2 }}
        >
          <ThumbsDownIcon className="size-3.5" />
        </motion.span>
      </AiMessageAction>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                               AiMessageBranch                              */
/* -------------------------------------------------------------------------- */

export interface AiMessageBranchProps extends React.ComponentProps<"div"> {
  /** 1-based current branch index. @default 1 */
  current?: number
  /** Total count of generated branches/versions. @default 1 */
  total?: number
  /** Callback fired when navigating to previous branch. */
  onPrev?: () => void
  /** Callback fired when navigating to next branch. */
  onNext?: () => void
}

function AiMessageBranch({
  className,
  current = 1,
  total = 1,
  onPrev,
  onNext,
  ...props
}: AiMessageBranchProps) {
  if (total <= 1) return null

  return (
    <div
      data-slot="ai-message-branch"
      className={cn("flex items-center gap-0.5 font-mono text-xs text-muted-foreground", className)}
      {...props}
    >
      <AiMessageAction
        label="上一个回答"
        disabled={current <= 1}
        onClick={onPrev}
      >
        <ChevronLeftIcon className="size-3.5" />
      </AiMessageAction>

      <span className="select-none px-1 text-[11px]">
        {current} / {total}
      </span>

      <AiMessageAction
        label="下一个回答"
        disabled={current >= total}
        onClick={onNext}
      >
        <ChevronRightIcon className="size-3.5" />
      </AiMessageAction>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                AiMessageCopy                               */
/* -------------------------------------------------------------------------- */

export interface AiMessageCopyProps
  extends Omit<AiMessageActionProps, "children"> {
  /** Content string to copy into clipboard. */
  content: string
  /** Callback fired after successfully copying content. */
  onCopy?: () => void
}

function AiMessageCopy({
  content,
  onCopy,
  label = "复制回答",
  className,
  ...props
}: AiMessageCopyProps) {
  const [copied, setCopied] = React.useState(false)
  const reduceMotion = useReducedMotion()

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }, [content, onCopy])

  return (
    <AiMessageAction
      label={copied ? "已复制" : label}
      onClick={handleCopy}
      className={className}
      {...props}
    >
      <AnimatePresence initial={false} mode="wait">
        {copied ? (
          <motion.span
            key="check"
            initial={reduceMotion ? false : { scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reduceMotion ? undefined : { scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center text-success"
          >
            <CheckIcon className="size-3.5" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={reduceMotion ? false : { scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reduceMotion ? undefined : { scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center"
          >
            <CopyIcon className="size-3.5" />
          </motion.span>
        )}
      </AnimatePresence>
    </AiMessageAction>
  )
}

/* -------------------------------------------------------------------------- */
/*                                AiMessageRetry                              */
/* -------------------------------------------------------------------------- */

export interface AiMessageRetryProps extends AiMessageActionProps {
  /** Indicates whether regenerate request is loading. @default false */
  isLoading?: boolean
}

function AiMessageRetry({
  className,
  isLoading = false,
  label = "重新生成",
  onClick,
  ...props
}: AiMessageRetryProps) {
  return (
    <AiMessageAction
      label={label}
      disabled={isLoading}
      onClick={onClick}
      className={className}
      {...props}
    >
      <RotateCwIcon
        className={cn("size-3.5", isLoading && "animate-spin text-info")}
      />
    </AiMessageAction>
  )
}

/* -------------------------------------------------------------------------- */
/*                                AiMessageEdit                               */
/* -------------------------------------------------------------------------- */

function AiMessageEdit({
  label = "编辑提问",
  className,
  ...props
}: AiMessageActionProps) {
  return (
    <AiMessageAction label={label} className={className} {...props}>
      <PencilIcon className="size-3.5" />
    </AiMessageAction>
  )
}

export {
  AiMessageAction,
  AiMessageActions,
  AiMessageBranch,
  AiMessageCopy,
  AiMessageEdit,
  AiMessageFeedback,
  AiMessageRetry,
  aiMessageActionsVariants,
}
