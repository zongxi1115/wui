"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Tabs as TabsPrimitive } from "radix-ui"
import { CheckIcon, ChevronDownIcon, CopyIcon, FileCodeIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

const spring = { type: "spring", stiffness: 520, damping: 38, mass: 0.7 } as const
const ease = [0.22, 1, 0.36, 1] as const
/** Row height in px — matches `leading-5` so highlight bands can be positioned by line index. */
const LINE_HEIGHT = 20
const BODY_PADDING_Y = 14

const codeBlockVariants = cva(
  "group/code-block relative flex flex-col overflow-hidden rounded-lg border font-mono text-xs",
  {
    variants: {
      variant: {
        default: "border-border bg-muted/40",
        bordered: "border-border bg-background",
        ghost: "border-transparent bg-muted/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type HighlightLines = ReadonlyArray<number | string>

interface CodeBlockContextValue {
  copied: boolean
  markCopied: () => void
  readCode: React.RefObject<() => string>
  value?: string
  layoutId: string
  bodyId: string
  showLineNumbers: boolean
  highlightLines: HighlightLines
  maxHeight?: number | string
  expandable: boolean
  expanded: boolean
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
  overflowing: boolean
  setOverflowing: (overflowing: boolean) => void
}

const CodeBlockContext = React.createContext<CodeBlockContextValue | null>(null)

function useCodeBlock() {
  const context = React.useContext(CodeBlockContext)
  if (!context) {
    throw new Error("CodeBlock subcomponents must be used within <CodeBlock />")
  }
  return context
}

function parseHighlightLines(lines: HighlightLines) {
  const result = new Set<number>()
  for (const entry of lines) {
    if (typeof entry === "number") {
      result.add(entry)
      continue
    }
    const [start, end = start] = entry.split("-").map((part) => Number(part.trim()))
    for (let line = start; line <= end; line += 1) result.add(line)
  }
  return result
}

function toPixels(value: number | string, container: HTMLElement) {
  if (typeof value === "number") return value
  const probe = document.createElement("div")
  probe.style.height = value
  container.appendChild(probe)
  const pixels = probe.offsetHeight
  probe.remove()
  return pixels
}

function toRanges(lines: Set<number>) {
  const sorted = [...lines].sort((a, b) => a - b)
  const ranges: { start: number; count: number }[] = []
  for (const line of sorted) {
    const last = ranges[ranges.length - 1]
    if (last && last.start + last.count === line) last.count += 1
    else ranges.push({ start: line, count: 1 })
  }
  return ranges
}

export interface CodeBlockProps
  extends Omit<
      React.ComponentProps<typeof TabsPrimitive.Root>,
      "orientation" | "activationMode"
    >,
    VariantProps<typeof codeBlockVariants> {
  /** 代码块外观样式变体。 @default "default" */
  variant?: "default" | "bordered" | "ghost"
  /** 是否为内部的 CodeBlockBody 展示行号。 @default true */
  showLineNumbers?: boolean
  /** 代码区最大高度，超出时垂直滚动；开启 expandable 时作为折叠高度。 */
  maxHeight?: number | string
  /** 是否支持超长代码折叠与展开，内容超过折叠高度时显示切换按钮。 @default false */
  expandable?: boolean
  /** 高亮行，支持行号与区间（例如 [2, "5-7"]），高亮带会在行之间平滑滑动。 */
  highlightLines?: HighlightLines
  /** 多文件模式下当前激活的文件（受控）。 */
  value?: string
  /** 多文件模式下默认激活的文件（非受控）。 */
  defaultValue?: string
  /** 激活文件变化时的回调。 */
  onValueChange?: (value: string) => void
}

/** 独立代码展示块，支持多文件 Tab、行号高亮、一键复制与折叠展开。 */
function CodeBlock({
  className,
  variant = "default",
  showLineNumbers = true,
  maxHeight,
  expandable = false,
  highlightLines = [],
  value,
  defaultValue,
  onValueChange,
  children,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)
  const [expanded, setExpanded] = React.useState(false)
  const [overflowing, setOverflowing] = React.useState(expandable)
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const timer = React.useRef<number | undefined>(undefined)
  const readCode = React.useRef<() => string>(() => "")
  const layoutId = React.useId()
  const bodyId = React.useId()
  const reduceMotion = useReducedMotion()

  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  const markCopied = React.useCallback(() => {
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 2000)
  }, [])

  function handleValueChange(next: string) {
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  return (
    <CodeBlockContext.Provider
      value={{
        copied,
        markCopied,
        readCode,
        value: value ?? internalValue,
        layoutId,
        bodyId,
        showLineNumbers,
        highlightLines,
        maxHeight,
        expandable,
        expanded,
        setExpanded,
        overflowing,
        setOverflowing,
      }}
    >
      <TabsPrimitive.Root
        data-slot="code-block"
        data-variant={variant}
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        className={cn(codeBlockVariants({ variant }), className)}
        {...props}
      >
        {children}
        {expandable && overflowing ? (
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={bodyId}
            onClick={() => setExpanded((current) => !current)}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/60 focus-visible:ring-ring/35 flex h-8 w-full items-center justify-center gap-1.5 border-t font-sans text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset"
          >
            <motion.span
              aria-hidden
              className="flex"
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={reduceMotion ? { duration: 0 } : spring}
            >
              <ChevronDownIcon className="size-3.5" />
            </motion.span>
            {expanded ? "收起代码" : "展开完整代码"}
          </button>
        ) : null}
      </TabsPrimitive.Root>
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
        "flex min-h-10 items-center justify-between gap-2 border-b bg-muted/50 px-3.5 py-2",
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
        "flex min-w-0 items-center gap-2 text-xs font-medium text-foreground",
        className
      )}
      {...props}
    >
      <span className="text-muted-foreground flex size-3.5 shrink-0 items-center justify-center [&_svg]:size-3.5">
        {icon ?? <FileCodeIcon />}
      </span>
      <span className="truncate">{children}</span>
    </div>
  )
}

function CodeBlockTabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="code-block-tabs"
      className={cn(
        "-my-2 -ml-1.5 flex min-w-0 items-stretch self-stretch overflow-x-auto [scrollbar-width:none]",
        className
      )}
      {...props}
    />
  )
}

function CodeBlockTab({
  className,
  value,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const context = useCodeBlock()
  const reduceMotion = useReducedMotion()
  const active = context.value === value

  return (
    <TabsPrimitive.Trigger
      data-slot="code-block-tab"
      value={value}
      className={cn(
        "text-muted-foreground hover:text-foreground focus-visible:ring-ring/35 data-[state=active]:text-foreground relative flex shrink-0 items-center gap-1.5 px-2.5 font-sans text-xs font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-3.5",
        className
      )}
      {...props}
    >
      {children}
      {active ? (
        <motion.span
          aria-hidden
          data-slot="code-block-tab-indicator"
          layoutId={`${context.layoutId}-tab`}
          className="bg-foreground absolute inset-x-2 -bottom-px h-0.5"
          transition={reduceMotion ? { duration: 0 } : spring}
        />
      ) : null}
    </TabsPrimitive.Trigger>
  )
}

function CodeBlockActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-actions"
      className={cn(
        "ml-auto flex shrink-0 items-center gap-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export interface CodeBlockCopyProps
  extends Omit<React.ComponentProps<"button">, "children"> {
  /** 需要复制的代码字符串；省略时复制当前显示的 CodeBlockBody 内容。 */
  content?: string
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
  const { copied, markCopied, readCode } = useCodeBlock()
  const reduceMotion = useReducedMotion()

  function handleCopy() {
    void navigator.clipboard
      .writeText(content ?? readCode.current())
      .then(() => {
        markCopied()
        onCopy?.()
      })
  }

  const iconMotion = reduceMotion
    ? { initial: false as const }
    : {
        initial: { opacity: 0, scale: 0.5, filter: "blur(4px)" },
        animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
        exit: { opacity: 0, scale: 0.5, filter: "blur(4px)" },
        transition: { duration: 0.2, ease },
      }

  return (
    <button
      type="button"
      data-slot="code-block-copy"
      data-copied={copied || undefined}
      aria-label={label}
      title={copied ? "已复制" : label}
      onClick={handleCopy}
      className={cn(
        "grid size-7 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/35 data-[copied]:text-success [&>*]:[grid-area:1/1]",
        className
      )}
      {...props}
    >
      <AnimatePresence initial={false}>
        {copied ? (
          <motion.span key="check" className="flex" {...iconMotion}>
            <CheckIcon className="size-3.5" />
          </motion.span>
        ) : (
          <motion.span key="copy" className="flex" {...iconMotion}>
            <CopyIcon className="size-3.5" />
          </motion.span>
        )}
      </AnimatePresence>
      <span role="status" className="sr-only">
        {copied ? "已复制到剪贴板" : ""}
      </span>
    </button>
  )
}

export interface CodeBlockBodyProps extends React.ComponentProps<"pre"> {
  /** 纯文本代码内容。 */
  code?: string
  /** 编程语言类型，未使用 CodeBlockHeader 时显示在右上角。 */
  language?: string
  /** 是否展示行号，默认继承 CodeBlock 的 showLineNumbers。 */
  showLineNumbers?: boolean
  /** 需要高亮的行，默认继承 CodeBlock 的 highlightLines。 */
  highlightLines?: HighlightLines
  /** 多文件模式下对应 CodeBlockTab 的 value，仅在该文件激活时渲染。 */
  value?: string
}

function CodeBlockBody({ value, ...props }: CodeBlockBodyProps) {
  const reduceMotion = useReducedMotion()

  if (value === undefined) return <CodeBlockBodyView {...props} />

  return (
    <TabsPrimitive.Content
      value={value}
      data-slot="code-block-panel"
      className="outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/35"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, filter: "blur(3px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.22, ease }}
      >
        <CodeBlockBodyView {...props} />
      </motion.div>
    </TabsPrimitive.Content>
  )
}

function CodeBlockBodyView({
  className,
  code,
  language,
  showLineNumbers,
  highlightLines,
  children,
  style,
  ...props
}: Omit<CodeBlockBodyProps, "value">) {
  const context = React.useContext(CodeBlockContext)
  const reduceMotion = useReducedMotion()
  const codeRef = React.useRef<HTMLElement>(null)
  const preRef = React.useRef<HTMLPreElement>(null)
  // Measurement-driven height changes snap; only user toggles animate.
  const toggled = React.useRef(false)
  if (context?.expanded) toggled.current = true

  const rawContent = code ?? (typeof children === "string" ? children : "")
  const lines = rawContent ? rawContent.replace(/\n$/, "").split("\n") : []
  const lineNumbers = showLineNumbers ?? context?.showLineNumbers ?? false
  const highlighted = parseHighlightLines(
    highlightLines ?? context?.highlightLines ?? []
  )
  const ranges = toRanges(highlighted)
  const gutterWidth = `${String(lines.length).length}ch`

  const expandable = context?.expandable ?? false
  const collapsedHeight = context?.maxHeight ?? 240
  const collapsed = expandable && context?.overflowing && !context.expanded
  const setOverflowing = context?.setOverflowing

  React.useEffect(() => {
    if (!context) return
    context.readCode.current = () =>
      rawContent || codeRef.current?.textContent || ""
  })

  React.useLayoutEffect(() => {
    const pre = preRef.current
    if (!expandable || !setOverflowing || !pre) return
    const limit = toPixels(collapsedHeight, pre)
    setOverflowing(pre.scrollHeight > limit + LINE_HEIGHT)
  }, [expandable, collapsedHeight, rawContent, setOverflowing])

  return (
    <motion.div
      id={context?.bodyId}
      data-slot="code-block-viewport"
      className={cn(
        "relative overflow-hidden",
        collapsed &&
          "[mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
      )}
      initial={false}
      animate={expandable ? { height: collapsed ? collapsedHeight : "auto" } : undefined}
      transition={
        reduceMotion || !toggled.current
          ? { duration: 0 }
          : { duration: 0.3, ease }
      }
    >
      {language ? (
        <span className="text-muted-foreground/70 pointer-events-none absolute right-3 top-3 z-10 select-none font-sans text-[10px] uppercase tracking-wider group-has-[[data-slot=code-block-header]]/code-block:hidden">
          {language}
        </span>
      ) : null}
      <pre
        ref={preRef}
        data-slot="code-block-body"
        data-language={language}
        className={cn(
          "text-foreground overflow-auto font-mono text-xs leading-5",
          className
        )}
        style={{
          paddingBlock: BODY_PADDING_Y,
          maxHeight: expandable ? undefined : context?.maxHeight,
          ...style,
        }}
        {...props}
      >
        {lines.length > 0 ? (
          <code ref={codeRef} className="relative block w-max min-w-full">
            <AnimatePresence initial={false}>
              {ranges.map((range, index) => (
                <motion.span
                  key={index}
                  aria-hidden
                  data-slot="code-block-highlight"
                  className="border-primary bg-primary/10 pointer-events-none absolute inset-x-0 border-l-2"
                  initial={{
                    opacity: 0,
                    top: (range.start - 1) * LINE_HEIGHT,
                    height: range.count * LINE_HEIGHT,
                  }}
                  animate={{
                    opacity: 1,
                    top: (range.start - 1) * LINE_HEIGHT,
                    height: range.count * LINE_HEIGHT,
                  }}
                  exit={{ opacity: 0 }}
                  transition={reduceMotion ? { duration: 0 } : spring}
                />
              ))}
            </AnimatePresence>
            {lines.map((line, index) => {
              const lineNumber = index + 1
              return (
                <span
                  key={index}
                  data-line={lineNumber}
                  data-highlighted={highlighted.has(lineNumber) || undefined}
                  className="relative flex h-5 px-4"
                >
                  {lineNumbers ? (
                    <span
                      className="text-muted-foreground/60 mr-4 shrink-0 select-none text-right tabular-nums"
                      style={{ width: gutterWidth }}
                    >
                      {lineNumber}
                    </span>
                  ) : null}
                  <span className="whitespace-pre">{line || " "}</span>
                </span>
              )
            })}
          </code>
        ) : (
          <code ref={codeRef} className="block px-4">
            {children}
          </code>
        )}
      </pre>
    </motion.div>
  )
}

export {
  CodeBlock,
  CodeBlockActions,
  CodeBlockBody,
  CodeBlockCopy,
  CodeBlockHeader,
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTitle,
  codeBlockVariants,
}
