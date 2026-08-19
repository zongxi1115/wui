"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  FileCodeIcon,
} from "lucide-react"

import { cn } from "@/registry/lib/utils"

const codeBlockVariants = cva(
  "relative flex flex-col overflow-hidden rounded-xl border font-mono text-xs transition-shadow duration-200",
  {
    variants: {
      variant: {
        default: "border-border bg-muted/40 shadow-xs",
        bordered: "border-border/80 bg-background shadow-none",
        ghost: "border-transparent bg-muted/30 shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface CodeBlockContextValue {
  copied: boolean
  setCopied: React.Dispatch<React.SetStateAction<boolean>>
  activeTab?: string
  setActiveTab?: (tab: string) => void
}

const CodeBlockContext = React.createContext<CodeBlockContextValue | null>(null)

function useCodeBlock() {
  const context = React.useContext(CodeBlockContext)
  if (!context) {
    throw new Error("CodeBlock subcomponents must be used within <CodeBlock />")
  }
  return context
}

export interface CodeBlockProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof codeBlockVariants> {
  /** 代码块外观样式变体。 @default "default" */
  variant?: "default" | "bordered" | "ghost"
  /** 是否展示左侧行号。 @default true */
  showLineNumbers?: boolean
  /** 最大高度，超出时支持垂直滚动。 */
  maxHeight?: number | string
  /** 是否支持超长代码折叠与展开。 @default false */
  expandable?: boolean
  /** 高亮行号列表（例如 [2, 4] 或 ["2-4"]）。 */
  highlightLines?: number[]
}

/** 独立代码展示块，支持多文件 Tab、行号高亮、一键复制与折叠展开。 */
function CodeBlock({
  className,
  variant = "default",
  showLineNumbers = true,
  maxHeight,
  expandable = false,
  highlightLines = [],
  children,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)
  const [isExpanded, setIsExpanded] = React.useState(!expandable)

  return (
    <CodeBlockContext.Provider value={{ copied, setCopied }}>
      <div
        data-slot="code-block"
        data-variant={variant}
        className={cn(codeBlockVariants({ variant }), className)}
        {...props}
      >
        {children}
        {expandable && (
          <div className="flex justify-center border-t border-border/40 bg-muted/60 p-1.5">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-sans font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              {isExpanded ? (
                <>
                  <ChevronUpIcon className="size-3.5" />
                  <span>收起代码</span>
                </>
              ) : (
                <>
                  <ChevronDownIcon className="size-3.5" />
                  <span>展开完整代码</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </CodeBlockContext.Provider>
  )
}

function CodeBlockHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="code-block-header"
      className={cn(
        "flex items-center justify-between gap-2 border-b border-border/70 bg-muted/50 px-3.5 py-2",
        className
      )}
      {...props}
    >
      {children}
    </header>
  )
}

export interface CodeBlockTitleProps extends React.ComponentProps<"div"> {
  /** 文件名或代码段标题左侧图标。 */
  icon?: React.ReactNode
}

function CodeBlockTitle({
  className,
  icon,
  children,
  ...props
}: CodeBlockTitleProps) {
  return (
    <div
      data-slot="code-block-title"
      className={cn(
        "flex items-center gap-2 text-xs font-medium text-foreground",
        className
      )}
      {...props}
    >
      <span className="text-muted-foreground flex size-3.5 shrink-0 items-center justify-center">
        {icon ?? <FileCodeIcon className="size-3.5" />}
      </span>
      <span className="truncate">{children}</span>
    </div>
  )
}

function CodeBlockActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-actions"
      className={cn("flex items-center gap-1 text-muted-foreground", className)}
      {...props}
    />
  )
}

export interface CodeBlockCopyProps extends Omit<React.ComponentProps<"button">, "children"> {
  /** 需要复制的代码字符串内容。 */
  content: string
  /** 复制成功后的回调函数。 */
  onCopy?: () => void
  /** 按钮无障碍提示文案。 @default "复制代码" */
  label?: string
}

function CodeBlockCopy({
  content,
  onCopy,
  label = "复制代码",
  className,
  ...props
}: CodeBlockCopyProps) {
  const { copied, setCopied } = useCodeBlock()
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
    <button
      type="button"
      data-slot="code-block-copy"
      aria-label={copied ? "已复制" : label}
      title={copied ? "已复制" : label}
      onClick={handleCopy}
      className={cn(
        "inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 cursor-pointer",
        className
      )}
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
    </button>
  )
}

export interface CodeBlockBodyProps extends React.ComponentProps<"pre"> {
  /** 纯文本代码内容。 */
  code?: string
  /** 编程语言类型。 */
  language?: string
  /** 是否展示行号。 @default false */
  showLineNumbers?: boolean
  /** 需要高亮的行号列表。 */
  highlightLines?: number[]
}

function CodeBlockBody({
  className,
  code,
  language,
  showLineNumbers = false,
  highlightLines = [],
  children,
  ...props
}: CodeBlockBodyProps) {
  const rawContent = code ?? (typeof children === "string" ? children : "")
  const lines = rawContent ? rawContent.split("\n") : []

  return (
    <pre
      data-slot="code-block-body"
      className={cn(
        "relative overflow-x-auto p-3.5 font-mono text-xs leading-relaxed text-foreground",
        className
      )}
      {...props}
    >
      {language && (
        <span className="absolute right-3 top-3 select-none text-[10px] font-sans uppercase tracking-wider text-muted-foreground/60">
          {language}
        </span>
      )}
      {lines.length > 0 ? (
        <code>
          {lines.map((line, idx) => {
            const lineNum = idx + 1
            const isHighlighted = highlightLines.includes(lineNum)
            return (
              <div
                key={idx}
                data-line={lineNum}
                data-highlighted={isHighlighted ? "true" : "false"}
                className={cn(
                  "flex items-start rounded-xs transition-colors",
                  isHighlighted && "-mx-3.5 bg-primary/10 px-3.5 font-semibold text-primary"
                )}
              >
                {showLineNumbers && (
                  <span className="mr-4 inline-block w-6 select-none text-right font-mono text-xs text-muted-foreground/50">
                    {lineNum}
                  </span>
                )}
                <span className="flex-1 whitespace-pre">{line || " "}</span>
              </div>
            )
          })}
        </code>
      ) : (
        <code>{children}</code>
      )}
    </pre>
  )
}

export {
  CodeBlock,
  CodeBlockActions,
  CodeBlockBody,
  CodeBlockCopy,
  CodeBlockHeader,
  CodeBlockTitle,
  codeBlockVariants,
}
