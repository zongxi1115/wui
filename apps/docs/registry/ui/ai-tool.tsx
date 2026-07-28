"use client"

import * as React from "react"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"
import { cva } from "class-variance-authority"
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  CircleDashedIcon,
  CircleXIcon,
  LoaderCircleIcon,
  ShieldAlertIcon,
  WrenchIcon,
} from "lucide-react"

import { cn } from "@/registry/lib/utils"

export type AiToolStatus =
  | "pending"
  | "approval"
  | "running"
  | "success"
  | "error"
  | "denied"

const AiToolContext = React.createContext<{ status: AiToolStatus }>({
  status: "pending",
})

const aiToolStatusVariants = cva(
  "inline-flex items-center gap-1.5 text-xs font-medium",
  {
    variants: {
      status: {
        pending: "text-muted-foreground",
        approval: "text-warning",
        running: "text-info",
        success: "text-success",
        error: "text-destructive",
        denied: "text-muted-foreground",
      },
    },
    defaultVariants: { status: "pending" },
  }
)

const statusMeta = {
  pending: { label: "等待中", icon: CircleDashedIcon },
  approval: { label: "等待确认", icon: ShieldAlertIcon },
  running: { label: "执行中", icon: LoaderCircleIcon },
  success: { label: "已完成", icon: CheckCircle2Icon },
  error: { label: "执行失败", icon: CircleXIcon },
  denied: { label: "已拒绝", icon: CircleXIcon },
} as const

export interface AiToolProps
  extends React.ComponentProps<typeof CollapsiblePrimitive.Root> {
  /** Tool execution state. @default "pending" */
  status?: AiToolStatus
}

/** A compact disclosure for an AI tool invocation and its input/output. */
function AiTool({
  className,
  status = "pending",
  defaultOpen,
  ...props
}: AiToolProps) {
  return (
    <AiToolContext.Provider value={{ status }}>
      <CollapsiblePrimitive.Root
        data-slot="ai-tool"
        data-status={status}
        className={cn("overflow-hidden rounded-md border bg-background", className)}
        defaultOpen={defaultOpen ?? status === "error"}
        {...props}
      />
    </AiToolContext.Provider>
  )
}

export interface AiToolTriggerProps
  extends React.ComponentProps<typeof CollapsiblePrimitive.Trigger> {
  /** Human-readable tool name. */
  name?: string
}

function AiToolTrigger({
  className,
  name = "工具调用",
  children,
  ...props
}: AiToolTriggerProps) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="ai-tool-trigger"
      className={cn(
        "group flex w-full items-center gap-2.5 px-3 py-2.5 text-left outline-none transition-colors hover:bg-muted/60 focus-visible:ring-[3px] focus-visible:ring-ring/35",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <WrenchIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate font-mono text-sm font-medium">
            {name}
          </span>
          <AiToolStatus />
          <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </>
      )}
    </CollapsiblePrimitive.Trigger>
  )
}

export interface AiToolStatusProps extends React.ComponentProps<"span"> {
  /** Override the state inherited from AiTool. */
  status?: AiToolStatus
  /** Override the localized status label. */
  label?: string
}

function AiToolStatus({
  className,
  status: statusProp,
  label,
  ...props
}: AiToolStatusProps) {
  const context = React.useContext(AiToolContext)
  const status = statusProp ?? context.status
  const meta = statusMeta[status]
  const Icon = meta.icon

  return (
    <span
      data-slot="ai-tool-status"
      data-status={status}
      className={cn(aiToolStatusVariants({ status }), className)}
      {...props}
    >
      <Icon
        className={cn(
          "size-3.5",
          status === "running" && "motion-safe:animate-spin"
        )}
      />
      {label ?? meta.label}
    </span>
  )
}

function AiToolContent({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Content>) {
  return (
    <CollapsiblePrimitive.Content
      data-slot="ai-tool-content"
      className={cn(
        "overflow-hidden border-t text-sm",
        className
      )}
      {...props}
    />
  )
}

function AiToolSection({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-tool-section"
      className={cn("border-b px-3 py-3 last:border-b-0", className)}
      {...props}
    />
  )
}

function AiToolLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-tool-label"
      className={cn(
        "mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function AiToolCode({
  className,
  ...props
}: React.ComponentProps<"pre">) {
  return (
    <pre
      data-slot="ai-tool-code"
      className={cn(
        "overflow-x-auto rounded-md bg-muted/60 p-3 font-mono text-xs leading-5 text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AiToolError({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="alert"
      data-slot="ai-tool-error"
      className={cn(
        "rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive",
        className
      )}
      {...props}
    />
  )
}

export {
  AiTool,
  AiToolCode,
  AiToolContent,
  AiToolError,
  AiToolLabel,
  AiToolSection,
  AiToolStatus,
  AiToolTrigger,
  aiToolStatusVariants,
}
