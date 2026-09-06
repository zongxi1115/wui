"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  CodeIcon,
  CopyIcon,
  CheckIcon,
  EyeIcon,
  Maximize2Icon,
  Minimize2Icon,
  SparklesIcon,
  TerminalIcon,
} from "lucide-react"

import { cn } from "@/registry/lib/utils"

type AiArtifactTabType = "code" | "preview" | "diff" | "console" | (string & {})

interface AiArtifactContextValue {
  activeTab: string
  setActiveTab: (tab: string) => void
  isFullscreen: boolean
  setIsFullscreen: (fullscreen: boolean) => void
  isStreaming?: boolean
  copied: boolean
  setCopied: React.Dispatch<React.SetStateAction<boolean>>
}

const AiArtifactContext = React.createContext<AiArtifactContextValue | null>(null)

function useAiArtifact() {
  const context = React.useContext(AiArtifactContext)
  if (!context) {
    throw new Error("AI artifact components must be used within <AiArtifact />")
  }
  return context
}

const aiArtifactVariants = cva(
  "relative flex flex-col overflow-hidden rounded-xl border bg-background transition-shadow duration-200",
  {
    variants: {
      variant: {
        default: "border-border shadow-xs",
        bordered: "border-border/80 shadow-none",
        ghost: "border-transparent shadow-none bg-muted/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface AiArtifactProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof aiArtifactVariants> {
  /** 当前激活的标签页标识（受控模式）。 */
  activeTab?: string
  /** 默认激活的标签页标识（非受控模式）。 @default "preview" */
  defaultTab?: string
  /** 标签页切换时的回调函数。 */
  onTabChange?: (tab: string) => void
  /** 是否处于全屏沉浸模式（受控）。 */
  isFullscreen?: boolean
  /** 默认是否全屏（非受控）。 @default false */
  defaultFullscreen?: boolean
  /** 全屏状态切换时的回调函数。 */
  onFullscreenChange?: (fullscreen: boolean) => void
  /** 是否处于正在流式生成或运行中。 @default false */
  isStreaming?: boolean
  /** 外观样式变体。 @default "default" */
  variant?: "default" | "bordered" | "ghost"
}

/** A container for AI-generated code, interactive widgets, HTML and design previews. */
function AiArtifact({
  className,
  variant,
  activeTab: controlledTab,
  defaultTab = "preview",
  onTabChange,
  isFullscreen: controlledFullscreen,
  defaultFullscreen = false,
  onFullscreenChange,
  isStreaming = false,
  children,
  ...props
}: AiArtifactProps) {
  const [internalTab, setInternalTab] = React.useState(defaultTab)
  const [internalFullscreen, setInternalFullscreen] = React.useState(defaultFullscreen)
  const [copied, setCopied] = React.useState(false)

  const activeTab = controlledTab ?? internalTab
  const isFullscreen = controlledFullscreen ?? internalFullscreen

  const handleTabChange = React.useCallback(
    (tab: string) => {
      if (controlledTab === undefined) {
        setInternalTab(tab)
      }
      onTabChange?.(tab)
    },
    [controlledTab, onTabChange]
  )

  const handleFullscreenChange = React.useCallback(
    (fullscreen: boolean) => {
      if (controlledFullscreen === undefined) {
        setInternalFullscreen(fullscreen)
      }
      onFullscreenChange?.(fullscreen)
    },
    [controlledFullscreen, onFullscreenChange]
  )

  return (
    <AiArtifactContext.Provider
      value={{
        activeTab,
        setActiveTab: handleTabChange,
        isFullscreen,
        setIsFullscreen: handleFullscreenChange,
        isStreaming,
        copied,
        setCopied,
      }}
    >
      <div
        data-slot="ai-artifact"
        data-streaming={isStreaming ? "true" : "false"}
        data-fullscreen={isFullscreen ? "true" : "false"}
        className={cn(
          aiArtifactVariants({ variant }),
          isFullscreen &&
            "fixed inset-4 z-50 rounded-xl shadow-2xl md:inset-8 bg-background",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </AiArtifactContext.Provider>
  )
}

export interface AiArtifactHeaderProps extends React.ComponentProps<"header"> {
  /** Optional badge or tag displayed near title. */
  badge?: React.ReactNode
}

function AiArtifactHeader({
  className,
  badge,
  children,
  ...props
}: AiArtifactHeaderProps) {
  return (
    <header
      data-slot="ai-artifact-header"
      className={cn(
        "flex flex-wrap items-center justify-between gap-2 border-b border-border/70 bg-muted/30 px-3.5 py-2.5 sm:px-4",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        {children}
        {badge}
      </div>
    </header>
  )
}

export interface AiArtifactTitleProps extends React.ComponentProps<"div"> {
  /** Icon displayed to the left of the artifact title. */
  icon?: React.ReactNode
}

function AiArtifactTitle({
  className,
  icon,
  children,
  ...props
}: AiArtifactTitleProps) {
  const { isStreaming } = useAiArtifact()
  return (
    <div
      data-slot="ai-artifact-title"
      className={cn(
        "flex min-w-0 items-center gap-2 text-sm font-medium text-foreground",
        className
      )}
      {...props}
    >
      <span className="text-muted-foreground flex size-4 shrink-0 items-center justify-center">
        {icon ?? (
          <SparklesIcon
            className={cn("size-3.5", isStreaming && "text-info animate-pulse")}
          />
        )}
      </span>
      <span className="truncate">{children}</span>
    </div>
  )
}

function AiArtifactDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="ai-artifact-description"
      className={cn("truncate text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function AiArtifactActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-artifact-actions"
      className={cn("flex items-center gap-1 text-muted-foreground", className)}
      {...props}
    />
  )
}

export interface AiArtifactActionProps extends React.ComponentProps<"button"> {
  /** Visual tooltip or aria-label for accessibility. */
  label?: string
}

function AiArtifactAction({
  className,
  label,
  children,
  ...props
}: AiArtifactActionProps) {
  return (
    <button
      type="button"
      data-slot="ai-artifact-action"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-ring/35 focus-visible:outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export interface AiArtifactCopyProps extends Omit<AiArtifactActionProps, "children"> {
  /** Text or code content to copy to clipboard. */
  content: string
  /** Callback fired upon successful copy. */
  onCopy?: () => void
}

function AiArtifactCopy({
  content,
  onCopy,
  label = "复制代码",
  className,
  ...props
}: AiArtifactCopyProps) {
  const { copied, setCopied } = useAiArtifact()
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
  }, [content, onCopy, setCopied])

  return (
    <AiArtifactAction
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
    </AiArtifactAction>
  )
}

function AiArtifactFullscreenToggle({
  className,
  ...props
}: Omit<AiArtifactActionProps, "children">) {
  const { isFullscreen, setIsFullscreen } = useAiArtifact()
  return (
    <AiArtifactAction
      label={isFullscreen ? "退出全屏" : "全屏查看"}
      onClick={() => setIsFullscreen(!isFullscreen)}
      className={className}
      {...props}
    >
      {isFullscreen ? (
        <Minimize2Icon className="size-3.5" />
      ) : (
        <Maximize2Icon className="size-3.5" />
      )}
    </AiArtifactAction>
  )
}

function AiArtifactTabList({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-artifact-tab-list"
      role="tablist"
      className={cn(
        "inline-flex h-8 items-center rounded-lg bg-muted/60 p-0.5 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export interface AiArtifactTabTriggerProps extends React.ComponentProps<"button"> {
  /** Tab value identifier matching the tab panels. */
  value: AiArtifactTabType
  /** Optional icon rendered next to tab label. */
  icon?: React.ReactNode
}

function AiArtifactTabTrigger({
  value,
  icon,
  className,
  children,
  ...props
}: AiArtifactTabTriggerProps) {
  const { activeTab, setActiveTab } = useAiArtifact()
  const isSelected = activeTab === value
  const layoutId = React.useId()

  const defaultIcon =
    value === "preview" ? (
      <EyeIcon className="size-3.5" />
    ) : value === "code" ? (
      <CodeIcon className="size-3.5" />
    ) : value === "console" ? (
      <TerminalIcon className="size-3.5" />
    ) : null

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      data-slot="ai-artifact-tab-trigger"
      data-state={isSelected ? "active" : "inactive"}
      onClick={() => setActiveTab(value)}
      className={cn(
        "relative inline-flex items-center justify-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35",
        isSelected
          ? "text-foreground font-semibold"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      {isSelected && (
        <motion.span
          layoutId={`artifact-tab-${layoutId}`}
          className="absolute inset-0 z-0 rounded-md bg-background shadow-xs"
          transition={{ type: "spring", stiffness: 500, damping: 38 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">
        {icon ?? defaultIcon}
        {children}
      </span>
    </button>
  )
}

export interface AiArtifactPanelProps extends React.ComponentProps<"div"> {
  /** The tab value this panel corresponds to. */
  value: AiArtifactTabType
}

function AiArtifactPanel({
  value,
  className,
  children,
  ...props
}: AiArtifactPanelProps) {
  const { activeTab } = useAiArtifact()
  if (activeTab !== value) return null

  return (
    <div
      role="tabpanel"
      data-slot="ai-artifact-panel"
      data-tab={value}
      className={cn("min-h-0 flex-1 overflow-auto p-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function AiArtifactBody({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-artifact-body"
      className={cn("relative flex min-h-64 flex-1 flex-col overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface AiArtifactCodeProps extends React.ComponentProps<"pre"> {
  /** Code content string. */
  code?: string
  /** Programming language identifier. */
  language?: string
}

function AiArtifactCode({
  className,
  code,
  language,
  children,
  ...props
}: AiArtifactCodeProps) {
  return (
    <div
      data-slot="ai-artifact-code"
      className="relative flex h-full w-full flex-col font-mono text-xs"
    >
      {language && (
        <span className="text-muted-foreground/70 absolute right-3 top-3 select-none text-[11px] uppercase tracking-wider">
          {language}
        </span>
      )}
      <pre
        className={cn(
          "h-full w-full overflow-auto bg-muted/40 p-4 leading-relaxed text-foreground",
          className
        )}
        {...props}
      >
        <code>{code ?? children}</code>
      </pre>
    </div>
  )
}

function AiArtifactPreview({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-artifact-preview"
      className={cn(
        "flex h-full min-h-64 w-full flex-col items-center justify-center overflow-auto rounded-lg bg-muted/20 p-6",
        className
      )}
      {...props}
    />
  )
}

export {
  AiArtifact,
  AiArtifactAction,
  AiArtifactActions,
  AiArtifactBody,
  AiArtifactCode,
  AiArtifactCopy,
  AiArtifactDescription,
  AiArtifactFullscreenToggle,
  AiArtifactHeader,
  AiArtifactPanel,
  AiArtifactPreview,
  AiArtifactTabList,
  AiArtifactTabTrigger,
  AiArtifactTitle,
  aiArtifactVariants,
  useAiArtifact,
}
