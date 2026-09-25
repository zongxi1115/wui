"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  BanIcon,
  ListTodoIcon,
  LoaderCircleIcon,
} from "lucide-react"

import { cn } from "@/registry/lib/utils"

export type AiTodoStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "cancelled"

const easeOut = [0.22, 1, 0.36, 1] as const
const popSpring = {
  type: "spring",
  stiffness: 520,
  damping: 30,
  mass: 0.6,
} as const

const aiTodoIndicatorVariants = cva(
  "relative flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
  {
    variants: {
      status: {
        pending: "border-border text-muted-foreground",
        "in-progress": "border-info-border bg-info-subtle text-info",
        completed: "border-success bg-success text-success-foreground",
        cancelled: "border-border bg-muted text-muted-foreground",
      },
    },
    defaultVariants: { status: "pending" },
  }
)

const statusLabels: Record<AiTodoStatus, string> = {
  pending: "待处理",
  "in-progress": "进行中",
  completed: "已完成",
  cancelled: "已取消",
}

function AiTodo({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="ai-todo"
      className={cn("overflow-hidden rounded-md border bg-background", className)}
      {...props}
    />
  )
}

export interface AiTodoHeaderProps extends React.ComponentProps<"header"> {
  /** Leading icon. Pass `null` to hide it. Defaults to a checklist icon. */
  icon?: React.ReactNode
}

function AiTodoHeader({
  className,
  icon,
  children,
  ...props
}: AiTodoHeaderProps) {
  return (
    <header
      data-slot="ai-todo-header"
      className={cn(
        "flex items-center gap-2 border-b px-3 py-2.5 text-sm font-medium",
        className
      )}
      {...props}
    >
      {icon === undefined ? (
        <ListTodoIcon className="size-4 shrink-0 text-muted-foreground" />
      ) : (
        icon
      )}
      {children}
    </header>
  )
}

export interface AiTodoProgressProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** Completed amount. */
  value: number
  /** Total amount. @default 100 */
  max?: number
}

/** A hairline progress bar that springs to the latest completion ratio. */
function AiTodoProgress({
  className,
  value,
  max = 100,
  ...props
}: AiTodoProgressProps) {
  const reduceMotion = useReducedMotion()
  const ratio = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      data-slot="ai-todo-progress"
      data-complete={ratio === 1 ? "true" : "false"}
      className={cn("h-0.5 w-full overflow-hidden bg-muted", className)}
      {...props}
    >
      <motion.div
        className={cn(
          "h-full origin-left transition-colors duration-300",
          ratio === 1 ? "bg-success" : "bg-primary"
        )}
        initial={false}
        animate={{ scaleX: ratio }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 260, damping: 32 }
        }
      />
    </div>
  )
}

function AiTodoList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="ai-todo-list"
      className={cn("divide-y", className)}
      {...props}
    />
  )
}

function TodoStatusIcon({
  status,
  reduceMotion,
}: {
  status: AiTodoStatus
  reduceMotion: boolean
}) {
  if (status === "completed") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-3"
        aria-hidden
      >
        <motion.path
          d="M20 6 9 17l-5-5"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.32, ease: easeOut, delay: 0.08 }
          }
        />
      </svg>
    )
  }

  if (status === "pending") return null

  const Icon = status === "in-progress" ? LoaderCircleIcon : BanIcon

  return (
    <Icon
      className={cn(
        "size-3",
        status === "in-progress" && "motion-safe:animate-spin"
      )}
    />
  )
}

export interface AiTodoItemProps
  extends Omit<React.ComponentProps<"li">, "title"> {
  /** Main task label. */
  title: React.ReactNode
  /** Optional supporting detail. */
  description?: React.ReactNode
  /** Task progression state. @default "pending" */
  status?: AiTodoStatus
  /** Called when the status control is pressed. */
  onStatusChange?: (status: AiTodoStatus) => void
}

/** A readable task row with optional status interaction. */
function AiTodoItem({
  className,
  title,
  description,
  status = "pending",
  onStatusChange,
  ...props
}: AiTodoItemProps) {
  const reduceMotion = !!useReducedMotion()
  const nextStatus = status === "completed" ? "pending" : "completed"
  const done = status === "completed" || status === "cancelled"

  const indicatorContent = (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span
        key={status}
        className="flex items-center justify-center"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, scale: 0.5 }}
        transition={reduceMotion ? { duration: 0 } : popSpring}
      >
        <TodoStatusIcon status={status} reduceMotion={reduceMotion} />
      </motion.span>
    </AnimatePresence>
  )

  return (
    <li
      data-slot="ai-todo-item"
      data-status={status}
      className={cn(
        "flex items-start gap-3 px-3 py-3 transition-colors duration-300 data-[status=in-progress]:bg-muted/40",
        className
      )}
      {...props}
    >
      {onStatusChange ? (
        <button
          type="button"
          data-slot="ai-todo-indicator"
          aria-label={status === "completed" ? "标记为未完成" : "标记为已完成"}
          className={cn(
            aiTodoIndicatorVariants({ status }),
            "cursor-pointer outline-none hover:border-foreground/40 focus-visible:ring-[3px] focus-visible:ring-ring/35 active:scale-90 motion-safe:transition-[color,background-color,border-color,scale]"
          )}
          onClick={() => onStatusChange(nextStatus)}
        >
          {indicatorContent}
        </button>
      ) : (
        <span
          role="img"
          data-slot="ai-todo-indicator"
          aria-label={statusLabels[status]}
          className={aiTodoIndicatorVariants({ status })}
        >
          {indicatorContent}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div
          data-slot="ai-todo-title"
          className={cn(
            "text-sm font-medium leading-5 transition-colors duration-300",
            done && "text-muted-foreground"
          )}
        >
          <span
            className="box-decoration-clone transition-[background-size] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{
              backgroundImage: "linear-gradient(currentColor, currentColor)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "0 55%",
              backgroundSize: done ? "100% 1px" : "0% 1px",
            }}
          >
            {title}
          </span>
        </div>
        {description ? (
          <div
            data-slot="ai-todo-description"
            className="mt-0.5 text-xs leading-5 text-muted-foreground"
          >
            {description}
          </div>
        ) : null}
      </div>
    </li>
  )
}

export {
  AiTodo,
  AiTodoHeader,
  AiTodoItem,
  AiTodoList,
  AiTodoProgress,
  aiTodoIndicatorVariants,
}
