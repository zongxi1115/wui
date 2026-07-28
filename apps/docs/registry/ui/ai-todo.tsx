"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import {
  BanIcon,
  CheckIcon,
  CircleIcon,
  LoaderCircleIcon,
  ListTodoIcon,
} from "lucide-react"

import { cn } from "@/registry/lib/utils"

export type AiTodoStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "cancelled"

const aiTodoIndicatorVariants = cva(
  "flex size-5 shrink-0 items-center justify-center rounded-full border",
  {
    variants: {
      status: {
        pending: "border-border text-muted-foreground",
        "in-progress": "border-info/40 bg-info/10 text-info",
        completed: "border-success bg-success text-success-foreground",
        cancelled: "border-border bg-muted text-muted-foreground",
      },
    },
    defaultVariants: { status: "pending" },
  }
)

const todoIcons = {
  pending: CircleIcon,
  "in-progress": LoaderCircleIcon,
  completed: CheckIcon,
  cancelled: BanIcon,
} as const

function AiTodo({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="ai-todo"
      className={cn("overflow-hidden rounded-md border bg-background", className)}
      {...props}
    />
  )
}

function AiTodoHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="ai-todo-header"
      className={cn(
        "flex items-center gap-2 border-b px-3 py-2.5 text-sm font-medium",
        className
      )}
      {...props}
    >
      <ListTodoIcon className="size-4 text-muted-foreground" />
      {children}
    </header>
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
  const Icon = todoIcons[status]
  const nextStatus = status === "completed" ? "pending" : "completed"

  return (
    <li
      data-slot="ai-todo-item"
      data-status={status}
      className={cn("flex items-start gap-3 px-3 py-3", className)}
      {...props}
    >
      <button
        type="button"
        data-slot="ai-todo-indicator"
        aria-label={status === "completed" ? "标记为未完成" : "标记为已完成"}
        disabled={!onStatusChange}
        className={cn(
          aiTodoIndicatorVariants({ status }),
          onStatusChange
            ? "cursor-pointer outline-none focus-visible:ring-[3px] focus-visible:ring-ring/35"
            : "cursor-default"
        )}
        onClick={() => onStatusChange?.(nextStatus)}
      >
        <Icon
          className={cn(
            "size-3",
            status === "in-progress" && "motion-safe:animate-spin"
          )}
        />
      </button>
      <div className="min-w-0 flex-1">
        <div
          data-slot="ai-todo-title"
          className={cn(
            "text-sm font-medium leading-5",
            (status === "completed" || status === "cancelled") &&
              "text-muted-foreground line-through"
          )}
        >
          {title}
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
  aiTodoIndicatorVariants,
}
