"use client"

import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"
import { Slot } from "radix-ui"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { cn } from "@/registry/lib/utils"
import { buttonVariants } from "@/registry/ui/button"

const INDICATOR_SPRING = {
  type: "spring",
  stiffness: 520,
  damping: 38,
  mass: 0.7,
} as const

const EASE_OUT = [0.22, 1, 0.36, 1] as const

type PaginationContextValue = {
  /** Shared-layout id for the sliding active-page indicator. */
  layoutId: string
  /** Items mounted after the first paint animate in; the initial set does not. */
  ready: boolean
}

const PaginationContext = React.createContext<PaginationContextValue | null>(
  null
)

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

/** 分页项目列表，同时为当前页指示器提供独立的共享布局作用域。 */
function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  const layoutId = React.useId()
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => setReady(true), [])

  return (
    <PaginationContext.Provider value={{ layoutId, ready }}>
      <ul
        data-slot="pagination-content"
        className={cn("flex flex-row items-center gap-1", className)}
        {...props}
      />
    </PaginationContext.Provider>
  )
}

/**
 * 单个分页项目。页码窗口滚动（如 4 5 [6] 7 8 → 5 6 [7] 8 9）时，
 * 保留下来的项目会平滑滑到新位置，新加入的项目淡入。
 */
function PaginationItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  const context = React.useContext(PaginationContext)
  const reduceMotion = useReducedMotion()
  const animateIn = Boolean(context?.ready) && !reduceMotion

  return (
    <motion.li
      data-slot="pagination-item"
      layout={reduceMotion ? false : "position"}
      initial={animateIn ? { opacity: 0, scale: 0.85 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        layout: INDICATOR_SPRING,
        default: { duration: 0.2, ease: EASE_OUT },
      }}
      className={className}
      {...(props as React.ComponentProps<typeof motion.li>)}
    />
  )
}

export interface PaginationLinkProps extends React.ComponentProps<"a"> {
  /** 当前链接是否对应正在查看的页面。 */
  isActive?: boolean
  /** 分页按钮尺寸。 */
  size?: "default" | "sm" | "lg" | "icon"
  /** 将样式与属性合并到唯一子元素，适合组合路由链接。 */
  asChild?: boolean
  /** 禁用链接：移出 Tab 序列、阻止点击并标记 `aria-disabled`。 */
  disabled?: boolean
}

/** 页码链接，激活时自动添加当前页语义，并由滑动指示器标出当前页。 */
function PaginationLink({
  className,
  isActive,
  size = "icon",
  asChild = false,
  disabled = false,
  children,
  onClick,
  ...props
}: PaginationLinkProps) {
  const context = React.useContext(PaginationContext)
  const reduceMotion = useReducedMotion()
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      aria-current={isActive ? "page" : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      data-slot="pagination-link"
      data-active={isActive || undefined}
      className={cn(
        buttonVariants({ variant: "ghost", size }),
        // The indicator travels outside the link box while it slides between
        // pages, so this link must not clip it.
        "isolate overflow-visible tabular-nums aria-disabled:pointer-events-none aria-disabled:opacity-50",
        isActive && "pointer-events-none text-foreground",
        className
      )}
      onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
        if (disabled) {
          event.preventDefault()
          return
        }
        onClick?.(event)
      }}
      {...props}
    >
      {isActive ? (
        <motion.span
          aria-hidden
          data-slot="pagination-indicator"
          layoutId={context ? `${context.layoutId}-indicator` : undefined}
          className="absolute inset-0 -z-10 rounded-md border bg-background shadow-xs dark:border-input dark:bg-input/30"
          transition={reduceMotion ? { duration: 0 } : INDICATOR_SPRING}
        />
      ) : null}
      <Slot.Slottable>{children}</Slot.Slottable>
    </Comp>
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
      data-slot="pagination-ellipsis"
      className={cn(
        "text-muted-foreground flex size-9 items-center justify-center",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon aria-hidden="true" className="size-4" />
      <span className="sr-only">更多页面</span>
    </span>
  )
}

export interface PaginationCounterProps
  extends Omit<React.ComponentProps<"span">, "children"> {
  /** 当前页码，从 1 开始。 */
  page: number
  /** 总页数。 */
  total: number
}

/**
 * 紧凑的「当前页 / 总页数」读数。页码变化时数字按翻页方向滚动，
 * 适合移动端或空间受限的简洁分页。
 */
function PaginationCounter({
  className,
  page,
  total,
  ...props
}: PaginationCounterProps) {
  const reduceMotion = useReducedMotion()
  const [previous, setPrevious] = React.useState(page)
  const [direction, setDirection] = React.useState(1)

  if (previous !== page) {
    setDirection(page > previous ? 1 : -1)
    setPrevious(page)
  }

  return (
    <span
      data-slot="pagination-counter"
      aria-live="polite"
      className={cn(
        "text-muted-foreground inline-flex h-9 items-center gap-1 px-2 text-sm tabular-nums",
        className
      )}
      {...props}
    >
      <span className="sr-only">
        第 {page} 页，共 {total} 页
      </span>
      <span
        aria-hidden="true"
        className="text-foreground relative inline-flex h-5 min-w-[1ch] items-center justify-end overflow-hidden font-medium"
      >
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.span
            key={page}
            custom={direction}
            variants={{
              enter: (dir: number) => ({ y: reduceMotion ? 0 : dir * 14, opacity: 0 }),
              center: { y: 0, opacity: 1 },
              exit: (dir: number) => ({ y: reduceMotion ? 0 : dir * -14, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={
              reduceMotion ? { duration: 0 } : { duration: 0.24, ease: EASE_OUT }
            }
            className="block"
          >
            {page}
          </motion.span>
        </AnimatePresence>
      </span>
      <span aria-hidden="true">/</span>
      <span aria-hidden="true">{total}</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationCounter,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
