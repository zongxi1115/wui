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
  /** Stable per-instance id used for tab/panel relationships and the tab indicator. */
  baseId: string
}

const AiArtifactContext = React.createContext<AiArtifactContextValue | null>(null)

const swapSpring = {
  type: "spring",
  stiffness: 520,
  damping: 32,
  mass: 0.6,
} as const

function useAiArtifact() {
  const context = React.useContext(AiArtifactContext)
  if (!context) {
    throw new Error("AI artifact components must be used within <AiArtifact />")
  }
  return context
}

function toDomId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-")
}

const aiArtifactVariants = cva(
  "relative flex flex-col overflow-hidden rounded-lg border bg-background",
  {
    variants: {
      variant: {
        default: "border-border shadow-xs",
        bordered: "border-border shadow-none",
        ghost: "border-transparent bg-muted/30 shadow-none",
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
  const baseId = React.useId()

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

  React.useEffect(() => {
    if (!isFullscreen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleFullscreenChange(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [handleFullscreenChange, isFullscreen])

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
        baseId,
      }}
    >
      {isFullscreen ? (
        <div
          aria-hidden
          data-slot="ai-artifact-backdrop"
          className="fixed inset-0 z-50 bg-overlay duration-200 animate-in fade-in-0"
          onClick={() => handleFullscreenChange(false)}
        />
      ) : null}
      <div
        data-slot="ai-artifact"
        data-streaming={isStreaming ? "true" : "false"}
        data-fullscreen={isFullscreen ? "true" : "false"}
        role={isFullscreen ? "dialog" : undefined}
        aria-modal={isFullscreen || undefined}
        className={cn(
          aiArtifactVariants({ variant }),
          isFullscreen &&
            "fixed inset-4 z-50 bg-background shadow-lg duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] animate-in fade-in-0 zoom-in-[0.98] md:inset-8",
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
  const { isStreaming } = useAiArtifact()
  const reduceMotion = useReducedMotion()

  return (
    <header
      data-slot="ai-artifact-header"
      className={cn(
        "relative flex flex-wrap items-center justify-between gap-2 border-b bg-muted/30 px-3.5 py-2.5 sm:px-4",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        {children}
        {badge}
      </div>
      <AnimatePresence>
        {isStreaming && !reduceMotion ? (
          <motion.span
            key="streaming"
            aria-hidden
            data-slot="ai-artifact-progress"
            className="pointer-events-none absolute inset-x-0 -bottom-px h-px overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              className="block h-full w-1/4 bg-info"
              initial={{ x: "-100%" }}
              animate={{ x: "400%" }}
              transition={{
                duration: 1.5,
                ease: [0.45, 0, 0.55, 1],
                repeat: Infinity,
              }}
            />
          </motion.span>
        ) : null}
      </AnimatePresence>
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
            className={cn(
              "size-3.5 transition-colors",
              isStreaming && "text-info motion-safe:animate-pulse"
            )}
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
        "relative inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-[color,background-color,scale] duration-150 hover:bg-muted hover:text-foreground focus-visible:ring-ring/35 focus-visible:outline-none focus-visible:ring-[3px] active:scale-90 disabled:pointer-events-none disabled:opacity-50 motion-reduce:active:scale-100",
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
  const timerRef = React.useRef<number | undefined>(undefined)

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
  }, [content, onCopy, setCopied])

  return (
    <AiArtifactAction
      label={copied ? "已复制" : label}
      onClick={handleCopy}
      className={className}
      {...props}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={copied ? "check" : "copy"}
          initial={
            reduceMotion ? false : { scale: 0.5, opacity: 0, filter: "blur(2px)" }
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
    </AiArtifactAction>
  )
}

function AiArtifactFullscreenToggle({
  className,
  ...props
}: Omit<AiArtifactActionProps, "children">) {
  const { isFullscreen, setIsFullscreen } = useAiArtifact()
  const reduceMotion = useReducedMotion()

  return (
    <AiArtifactAction
      label={isFullscreen ? "退出全屏" : "全屏查看"}
      aria-pressed={isFullscreen}
      onClick={() => setIsFullscreen(!isFullscreen)}
      className={className}
      {...props}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={isFullscreen ? "min" : "max"}
          className="flex items-center justify-center"
          initial={reduceMotion ? false : { scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={reduceMotion ? undefined : { scale: 0.5, opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : swapSpring}
        >
          {isFullscreen ? (
            <Minimize2Icon className="size-3.5" />
          ) : (
            <Maximize2Icon className="size-3.5" />
          )}
        </motion.span>
      </AnimatePresence>
    </AiArtifactAction>
  )
}

function AiArtifactTabList({
  className,
  onKeyDown,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-artifact-tab-list"
      role="tablist"
      className={cn(
        "inline-flex h-8 items-center rounded-md bg-muted p-0.5 text-muted-foreground",
        className
      )}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented) return
        const keys = ["ArrowLeft", "ArrowRight", "Home", "End"]
        if (!keys.includes(event.key)) return

        const tabs = Array.from(
          event.currentTarget.querySelectorAll<HTMLButtonElement>(
            '[role="tab"]:not(:disabled)'
          )
        )
        const index = tabs.indexOf(document.activeElement as HTMLButtonElement)
        if (index < 0) return

        event.preventDefault()
        const next =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? tabs.length - 1
              : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) %
                tabs.length
        tabs[next]?.focus()
        tabs[next]?.click()
      }}
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
  onClick,
  ...props
}: AiArtifactTabTriggerProps) {
  const { activeTab, setActiveTab, baseId } = useAiArtifact()
  const reduceMotion = useReducedMotion()
  const isSelected = activeTab === value

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
      id={`${baseId}-tab-${toDomId(value)}`}
      aria-selected={isSelected}
      aria-controls={`${baseId}-panel-${toDomId(value)}`}
      tabIndex={isSelected ? 0 : -1}
      data-slot="ai-artifact-tab-trigger"
      data-state={isSelected ? "active" : "inactive"}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) setActiveTab(value)
      }}
      className={cn(
        "relative isolate inline-flex h-7 items-center justify-center gap-1.5 rounded-sm px-2.5 text-xs font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/35",
        isSelected
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      {isSelected && (
        <motion.span
          aria-hidden
          data-slot="ai-artifact-tab-indicator"
          layoutId={`${baseId}-tab-indicator`}
          className="absolute inset-0 z-[-1] rounded-sm bg-background shadow-xs"
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 520, damping: 38, mass: 0.7 }
          }
        />
      )}
      <span className="flex items-center gap-1.5">
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
  const { activeTab, baseId } = useAiArtifact()
  if (activeTab !== value) return null

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${toDomId(value)}`}
      aria-labelledby={`${baseId}-tab-${toDomId(value)}`}
      data-slot="ai-artifact-panel"
      data-tab={value}
      className={cn(
        "min-h-0 flex-1 overflow-auto p-4 duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:animate-in motion-safe:fade-in-0 motion-safe:blur-in-[2px]",
        className
      )}
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
        "flex h-full min-h-64 w-full flex-col items-center justify-center overflow-auto bg-muted/20 p-6",
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
