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

/* -------------------------------------------------------------------------- */
/*                                  AiSources                                 */
/* -------------------------------------------------------------------------- */

export interface AiSourcesProps
  extends Omit<React.ComponentProps<"div">, "onOpenChange"> {
  /** 检索到的参考来源总数。 */
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
    <CollapsiblePrimitive.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      disabled={disabled}
      asChild
    >
      <div
        data-slot="ai-sources"
        className={cn("my-2 flex flex-col gap-1.5 text-xs text-muted-foreground", className)}
        {...props}
      >
        {children}
      </div>
    </CollapsiblePrimitive.Root>
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
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="ai-sources-header"
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 cursor-pointer",
        className
      )}
      {...props}
    >
      <SearchIcon className="size-3.5 text-muted-foreground/80" />
      <span>{label ?? children ?? "参考来源"}</span>
      <ChevronDownIcon className="size-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
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
        "overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1 pt-1",
        className
      )}
      {...props}
    >
      {children}
    </CollapsiblePrimitive.Content>
  )
}

function AiSourcesList({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-sources-list"
      className={cn("grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3", className)}
      {...props}
    />
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
        "group relative flex flex-col gap-1 rounded-lg border border-border/70 bg-card p-2.5 text-left text-xs transition-colors hover:border-border hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1.5">
        {index !== undefined && (
          <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
            {index}
          </span>
        )}
        {favicon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={favicon}
            alt=""
            className="size-3.5 shrink-0 rounded-xs object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
        ) : (
          <GlobeIcon className="size-3.5 shrink-0 text-muted-foreground" />
        )}
        <span className="truncate font-medium text-muted-foreground group-hover:text-foreground">
          {domain ?? (href ? new URL(href).hostname : "参考网页")}
        </span>
        <ExternalLinkIcon className="ml-auto size-3 opacity-0 transition-opacity group-hover:opacity-60" />
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

/** An inline citation badge [1] with a rich HoverCard preview on hover. */
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
  return (
    <HoverCardPrimitive.Root openDelay={150} closeDelay={100}>
      <HoverCardPrimitive.Trigger asChild {...props}>
        <span
          data-slot="ai-citation"
          className={cn(
            "relative -top-0.5 inline-flex select-none items-center justify-center rounded px-1 py-0.2 font-mono text-[10px] font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer align-baseline",
            className
          )}
        >
          {children ?? (
            <span className="inline-flex items-center">
              [{index}]
            </span>
          )}
        </span>
      </HoverCardPrimitive.Trigger>
      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content
          data-slot="ai-citation-popover"
          align="center"
          sideOffset={6}
          className="z-50 w-72 rounded-lg border bg-popover p-3 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        >
          <div className="flex flex-col gap-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                {index}
              </span>
              {favicon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={favicon}
                  alt=""
                  className="size-3.5 shrink-0 rounded-xs object-contain"
                />
              ) : (
                <GlobeIcon className="size-3.5 shrink-0" />
              )}
              <span className="truncate font-medium">{domain ?? (href ? new URL(href).hostname : "来源引用")}</span>
            </div>
            {title && <div className="font-medium text-foreground">{title}</div>}
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
                className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
              >
                <span>打开原始网页</span>
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
