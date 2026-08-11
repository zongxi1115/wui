import * as React from "react"
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
import { Slot } from "radix-ui"

import { cn } from "@/registry/lib/utils"

/** 面包屑导航容器，默认提供可访问名称。 */
function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="面包屑导航" data-slot="breadcrumb" {...props} />
}

/** 面包屑项目列表。 */
function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "text-muted-foreground m-0 flex list-none flex-wrap items-center gap-1.5 p-0 text-sm sm:gap-2.5",
        className
      )}
      {...props}
    />
  )
}

/** 单个面包屑项目。 */
function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn(
        "m-0 inline-flex min-w-0 items-center gap-1.5 p-0",
        className
      )}
      {...props}
    />
  )
}

export interface BreadcrumbLinkProps extends React.ComponentProps<"a"> {
  /** 将样式与属性合并到唯一子元素，适合组合路由链接。 */
  asChild?: boolean
}

/** 可跳转的面包屑链接。 */
function BreadcrumbLink({
  asChild = false,
  className,
  ...props
}: BreadcrumbLinkProps) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(
        "hover:text-foreground focus-visible:ring-ring/40 rounded-sm no-underline outline-none transition-colors focus-visible:ring-[3px]",
        className
      )}
      {...props}
    />
  )
}

/** 当前页面，自动标记 `aria-current="page"`。 */
function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-current="page"
      data-slot="breadcrumb-page"
      className={cn("text-foreground font-medium", className)}
      {...props}
    />
  )
}

/** 相邻面包屑之间的装饰性分隔符。 */
function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      aria-hidden="true"
      data-slot="breadcrumb-separator"
      role="presentation"
      className={cn("m-0 p-0 [&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </li>
  )
}

/** 表示中间路径被折叠的省略项。 */
function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      className={cn("flex size-7 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">更多层级</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
}
