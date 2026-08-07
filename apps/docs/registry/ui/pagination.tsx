import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"
import { Slot } from "radix-ui"

import { cn } from "@/registry/lib/utils"
import { buttonVariants } from "@/registry/ui/button"

/** 分页导航容器。 */
function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="分页导航"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

/** 分页项目列表。 */
function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

/** 单个分页项目。 */
function PaginationItem(props: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

export interface PaginationLinkProps extends React.ComponentProps<"a"> {
  /** 当前链接是否对应正在查看的页面。 */
  isActive?: boolean
  /** 分页按钮尺寸。 */
  size?: "default" | "sm" | "lg" | "icon"
  /** 将样式与属性合并到唯一子元素，适合组合路由链接。 */
  asChild?: boolean
}

/** 页码链接，激活时自动添加当前页语义。 */
function PaginationLink({
  className,
  isActive,
  size = "icon",
  asChild = false,
  ...props
}: PaginationLinkProps) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive || undefined}
      className={cn(
        buttonVariants({ variant: isActive ? "outline" : "ghost", size }),
        isActive && "pointer-events-none",
        className
      )}
      {...props}
    />
  )
}

/** 上一页链接。 */
function PaginationPrevious({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="前往上一页"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-3", className)}
      {...props}
    >
      <ChevronLeftIcon />
      {children ?? <span className="hidden sm:inline">上一页</span>}
    </PaginationLink>
  )
}

/** 下一页链接。 */
function PaginationNext({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="前往下一页"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-3", className)}
      {...props}
    >
      {children ?? <span className="hidden sm:inline">下一页</span>}
      <ChevronRightIcon />
    </PaginationLink>
  )
}

/** 表示一段页码被折叠。 */
function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">更多页面</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
