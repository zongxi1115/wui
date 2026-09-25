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

const swapSpring = {
  type: "spring",
  stiffness: 520,
  damping: 32,
  mass: 0.6,
} as const

/* -------------------------------------------------------------------------- */
/*                              AiMessageActions                              */
/* -------------------------------------------------------------------------- */

const aiMessageActionsVariants = cva(
  "inline-flex items-center gap-0.5 text-muted-foreground transition-opacity duration-150",
  {
    variants: {
      variant: {
        ghost: "",
        bordered: "rounded-lg border bg-background p-0.5 shadow-xs",
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
      role="toolbar"
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
        "relative inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-xs text-muted-foreground outline-none transition-[color,background-color,scale] duration-150 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/35 active:scale-90 disabled:pointer-events-none disabled:opacity-40 motion-reduce:active:scale-100",
        active && "bg-muted text-foreground",
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

function FeedbackIcon({
  active,
  direction,
}: {
  active: boolean
  direction: "like" | "dislike"
}) {
  const reduceMotion = useReducedMotion()
  const Icon = direction === "like" ? ThumbsUpIcon : ThumbsDownIcon
  const tilt = direction === "like" ? -16 : 16

  return (
    <motion.span
      className="flex items-center justify-center"
      initial={false}
      animate={
        active && !reduceMotion
          ? {
              scale: [1, 1.3, 1],
              rotate: [0, tilt, 0],
              y: direction === "like" ? [0, -2, 0] : [0, 2, 0],
            }
          : { scale: 1, rotate: 0, y: 0 }
      }
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <Icon
        className={cn(
          "size-3.5 transition-[fill] duration-200",
          active ? "fill-current" : "fill-transparent"
        )}
      />
    </motion.span>
  )
}

function AiMessageFeedback({
  className,
  value: controlledValue,
  defaultValue = null,
  onChange,
  ...props
}: AiMessageFeedbackProps) {
  const [internalValue, setInternalValue] =
    React.useState<AiMessageFeedbackValue>(defaultValue)

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
        aria-pressed={value === "like"}
        active={value === "like"}
        onClick={() => handleVote("like")}
      >
        <FeedbackIcon direction="like" active={value === "like"} />
      </AiMessageAction>

      <AiMessageAction
        label="点踩"
        aria-pressed={value === "dislike"}
        active={value === "dislike"}
        onClick={() => handleVote("dislike")}
      >
        <FeedbackIcon direction="dislike" active={value === "dislike"} />
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
  const reduceMotion = useReducedMotion()
  const previous = React.useRef(current)
  const direction = current >= previous.current ? 1 : -1

  React.useEffect(() => {
    previous.current = current
  }, [current])

  if (total <= 1) return null

  return (
    <div
      data-slot="ai-message-branch"
      className={cn(
        "flex items-center gap-0.5 font-mono text-xs text-muted-foreground",
        className
      )}
      {...props}
    >
      <AiMessageAction
        label="上一个回答"
        disabled={current <= 1}
        onClick={onPrev}
      >
        <ChevronLeftIcon className="size-3.5" />
      </AiMessageAction>

      <span
        aria-live="polite"
        className="flex select-none items-center px-0.5 text-[11px] tabular-nums"
      >
        <span className="sr-only">
          第 {current} 个回答，共 {total} 个
        </span>
        <span
          aria-hidden
          className="relative inline-flex h-4 min-w-[2ch] items-center justify-end overflow-hidden"
        >
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            <motion.span
              key={current}
              custom={direction}
              variants={{
                enter: (d: number) => ({ y: d * 12, opacity: 0 }),
                center: { y: 0, opacity: 1 },
                exit: (d: number) => ({ y: d * -12, opacity: 0 }),
              }}
              initial={reduceMotion ? false : "enter"}
              animate="center"
              exit={reduceMotion ? undefined : "exit"}
              transition={reduceMotion ? { duration: 0 } : swapSpring}
            >
              {current}
            </motion.span>
          </AnimatePresence>
        </span>
        <span aria-hidden className="px-1 text-muted-foreground/60">
          /
        </span>
        <span aria-hidden>{total}</span>
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
  const timerRef = React.useRef<number | undefined>(undefined)
  const reduceMotion = useReducedMotion()

  React.useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content)
    } catch {
      return
    }
    setCopied(true)
    onCopy?.()
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setCopied(false), 2000)
  }, [content, onCopy])

  return (
    <AiMessageAction
      label={copied ? "已复制" : label}
      onClick={handleCopy}
      className={className}
      {...props}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={copied ? "check" : "copy"}
          initial={
            reduceMotion
              ? false
              : { scale: 0.5, opacity: 0, filter: "blur(2px)" }
          }
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          exit={
            reduceMotion
              ? undefined
              : { scale: 0.5, opacity: 0, filter: "blur(2px)" }
          }
          transition={reduceMotion ? { duration: 0 } : swapSpring}
          className={cn(
            "flex items-center justify-center",
            copied && "text-success"
          )}
        >
          {copied ? (
            <CheckIcon className="size-3.5" />
          ) : (
            <CopyIcon className="size-3.5" />
          )}
        </motion.span>
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
  disabled,
  onClick,
  ...props
}: AiMessageRetryProps) {
  return (
    <AiMessageAction
      label={label}
      disabled={isLoading || disabled}
      aria-busy={isLoading || undefined}
      onClick={onClick}
      className={cn("group/retry", className)}
      {...props}
    >
      <RotateCwIcon
        className={cn(
          "size-3.5 transition-transform duration-300 ease-out group-hover/retry:rotate-45 motion-reduce:transition-none",
          isLoading && "text-foreground motion-safe:animate-spin"
        )}
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
