"use client"

import * as React from "react"
import { Collapsible as CollapsiblePrimitive, HoverCard as HoverCardPrimitive } from "radix-ui"
import {
  ChevronDownIcon,
  ExternalLinkIcon,
  GlobeIcon,
  SearchIcon,
} from "lucide-react"

import { cn } from "@/registry/lib/utils"

/** Extracts the host from an absolute http(s) URL; relative links have none. */
function getHostname(href?: string) {
  return href?.match(/^https?:\/\/([^/?#:]+)/i)?.[1]
}

const AiSourcesContext = React.createContext<{ count?: number }>({})

/* -------------------------------------------------------------------------- */
/*                                  AiSources                                 */
/* -------------------------------------------------------------------------- */

export interface AiSourcesProps
  extends Omit<React.ComponentProps<"div">, "onOpenChange"> {
  /** 检索到的参考来源总数，未自定义标题时显示在折叠按钮中。 */
  count?: number
  /** 默认是否展开参考来源列表。 @default false */
  defaultOpen?: boolean
  /** 是否展开参考来源列表（受控）。 */
  open?: boolean
  /** 展开/折叠状态改变时的回调函数。 */
  onOpenChange?: (open: boolean) => void
  /** 是否禁用折叠展开交互。 */
  disabled?: boolean
}

/** 专用于搜索或 RAG 知识库参考来源的折叠卡片组。 */
function AiSources({
  className,
  defaultOpen = false,
  open,
  onOpenChange,
  disabled,
  count,
  children,
  ...props
}: AiSourcesProps) {
  return (
    <AiSourcesContext.Provider value={{ count }}>
      <CollapsiblePrimitive.Root
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
        disabled={disabled}
        asChild
      >
        <div
          data-slot="ai-sources"
          className={cn("flex flex-col gap-1 text-xs text-muted-foreground", className)}
          {...props}
        >
          {children}
        </div>
      </CollapsiblePrimitive.Root>
    </AiSourcesContext.Provider>
  )
}

export interface AiSourcesHeaderProps
  extends React.ComponentProps<typeof CollapsiblePrimitive.Trigger> {
  /** Custom count or header label. */
  label?: React.ReactNode
}

function AiSourcesHeader({
  className,
  label,
  children,
  ...props
}: AiSourcesHeaderProps) {
  const { count } = React.useContext(AiSourcesContext)
  const custom = label ?? children

  return (
    <CollapsiblePrimitive.Trigger
      data-slot="ai-sources-header"
      className={cn(
        "group inline-flex w-fit items-center gap-1.5 rounded-md px-1.5 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/35 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SearchIcon className="size-3.5 text-muted-foreground/80" />
      <span>{custom ?? "参考来源"}</span>
      {custom === undefined && count !== undefined ? (
        <span className="rounded-sm bg-muted px-1 font-mono text-[10px] leading-4 tabular-nums">
          {count}
        </span>
      ) : null}
      <ChevronDownIcon className="size-3 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[state=open]:rotate-180 motion-reduce:transition-none" />
    </CollapsiblePrimitive.Trigger>
  )
}

function AiSourcesContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Content>) {
  return (
    <CollapsiblePrimitive.Content
      data-slot="ai-sources-content"
      className={cn(
        "overflow-hidden duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down motion-reduce:animate-none",
        className
      )}
      {...props}
    >
      <div className="pt-1">{children}</div>
    </CollapsiblePrimitive.Content>
  )
}

/** Staggers the entrance of each source every time the list mounts. */
function AiSourcesList({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  let order = 0

  return (
    <div
      data-slot="ai-sources-list"
      className={cn("grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3", className)}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement<{ style?: React.CSSProperties }>(child)) {
          return child
        }
        const delay = `${Math.min(order++, 8) * 45}ms`
        return React.cloneElement(child, {
          style: {
            "--tw-animation-delay": delay,
            ...child.props.style,
          } as React.CSSProperties,
        })
      })}
    </div>
  )
}

export interface AiSourceItemProps extends React.ComponentProps<"a"> {
  /** Numerical index/citation identifier (1, 2, 3...). */
  index?: number | string
  /** Source website title or document name. */
  title: string
  /** Domain name or source category. */
  domain?: string
  /** Optional snippet or excerpt from the source. */
  snippet?: string
  /** Optional icon or favicon URL. */
  favicon?: string
}

function SourceFavicon({ src }: { src?: string }) {
  const [failed, setFailed] = React.useState(false)

  if (!src || failed) {
    return <GlobeIcon className="size-3.5 shrink-0 text-muted-foreground" />
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="size-3.5 shrink-0 rounded-xs object-contain"
      onError={() => setFailed(true)}
    />
  )
}

function AiSourceItem({
  className,
  index,
  title,
  domain,
  snippet,
  favicon,
  href,
  target = "_blank",
  rel = "noreferrer noopener",
  ...props
}: AiSourceItemProps) {
  return (
    <a
      data-slot="ai-source-item"
      href={href}
      target={target}
      rel={rel}
      className={cn(
        "group relative flex flex-col gap-1 rounded-md border bg-background p-2.5 text-left text-xs outline-none transition-colors hover:bg-muted/50 focus-visible:ring-[3px] focus-visible:ring-ring/35",
        "fill-mode-both animation-duration-300 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1.5">
        {index !== undefined && (
          <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-sm bg-muted px-1 font-mono text-[10px] font-medium tabular-nums text-muted-foreground">
            {index}
          </span>
        )}
        <SourceFavicon src={favicon} />
        <span className="truncate text-muted-foreground transition-colors group-hover:text-foreground">
          {domain ?? getHostname(href) ?? "参考网页"}
        </span>
        <ExternalLinkIcon className="ml-auto size-3 shrink-0 -translate-x-0.5 opacity-0 transition-[opacity,translate] duration-200 group-hover:translate-x-0 group-hover:opacity-60" />
      </div>
      <div className="line-clamp-1 font-medium text-foreground">{title}</div>
      {snippet && (
        <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
          {snippet}
        </p>
      )}
    </a>
  )
}

/* -------------------------------------------------------------------------- */
/*                                 AiCitation                                 */
/* -------------------------------------------------------------------------- */

export interface AiCitationProps
  extends React.ComponentProps<typeof HoverCardPrimitive.Trigger> {
  /** Numeric reference or source index (e.g. 1, 2). */
  index: number | string
  /** Source title. */
  title?: string
  /** Domain or publisher name. */
  domain?: string
  /** Brief excerpt or highlight. */
  snippet?: string
  /** Link URL to original source. */
  href?: string
  /** Favicon or logo image URL. */
  favicon?: string
}

/** An inline citation badge with a rich HoverCard preview on hover or focus. */
function AiCitation({
  className,
  index,
  title,
  domain,
  snippet,
  href,
  favicon,
  children,
  ...props
}: AiCitationProps) {
  const source = domain ?? getHostname(href) ?? "来源引用"

  return (
    <HoverCardPrimitive.Root openDelay={120} closeDelay={80}>
      <HoverCardPrimitive.Trigger asChild {...props}>
        <button
          type="button"
          data-slot="ai-citation"
          aria-label={`引用 ${index}${title ? `：${title}` : ""}`}
          className={cn(
            "relative -top-0.5 mx-0.5 inline-flex h-4 min-w-4 cursor-pointer select-none items-center justify-center rounded-sm bg-muted px-1 align-baseline font-mono text-[10px] font-medium leading-none tabular-nums text-muted-foreground outline-none transition-colors hover:bg-foreground hover:text-background focus-visible:ring-2 focus-visible:ring-ring/50 data-[state=open]:bg-foreground data-[state=open]:text-background",
            className
          )}
        >
          {children ?? index}
        </button>
      </HoverCardPrimitive.Trigger>
      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content
          data-slot="ai-citation-popover"
          align="center"
          sideOffset={6}
          className="z-50 w-72 rounded-lg border bg-popover p-3 text-popover-foreground shadow-md outline-none duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.97] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.97] data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1"
        >
          <div className="flex flex-col gap-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-sm bg-muted px-1 font-mono text-[10px] font-medium tabular-nums">
                {index}
              </span>
              <SourceFavicon src={favicon} />
              <span className="truncate font-medium">{source}</span>
            </div>
            {title && <div className="font-medium leading-5 text-foreground">{title}</div>}
            {snippet && (
              <p className="line-clamp-3 text-[11px] leading-relaxed text-muted-foreground">
                {snippet}
              </p>
            )}
            {href && (
              <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-1 inline-flex w-fit items-center gap-1 text-[11px] font-medium text-foreground underline-offset-4 hover:underline"
              >
                <span>打开原文</span>
                <ExternalLinkIcon className="size-3" />
              </a>
            )}
          </div>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    </HoverCardPrimitive.Root>
  )
}

export {
  AiCitation,
  AiSourceItem,
  AiSources,
  AiSourcesContent,
  AiSourcesHeader,
  AiSourcesList,
}
