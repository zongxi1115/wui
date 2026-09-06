"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"

type CarouselContextValue = {
  orientation: "horizontal" | "vertical"
  viewport: HTMLDivElement | null
  setViewport: (viewport: HTMLDivElement | null) => void
  updateState: () => void
  scrollPrevious: () => void
  scrollNext: () => void
  canScrollPrevious: boolean
  canScrollNext: boolean
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) throw new Error("Carousel 子组件必须在 <Carousel> 内使用。")
  return context
}

export interface CarouselProps extends React.ComponentProps<"div"> {
  /** 轮播内容的滚动方向。@default "horizontal" */
  orientation?: "horizontal" | "vertical"
  /** 到达末端后是否允许循环到另一端。@default false */
  loop?: boolean
  /** 初次渲染时显示的项目索引。@default 0 */
  defaultIndex?: number
  /** 当前项目变化时触发。 */
  onIndexChange?: (index: number) => void
}

/** 使用原生滚动和 scroll-snap 展示一组可逐项浏览的内容。 */
function Carousel({
  className,
  orientation = "horizontal",
  loop = false,
  defaultIndex = 0,
  onIndexChange,
  children,
  ...props
}: CarouselProps) {
  const [viewport, setViewport] = React.useState<HTMLDivElement | null>(null)
  const [currentIndex, setCurrentIndex] = React.useState(defaultIndex)
  const [itemCount, setItemCount] = React.useState(0)
  const initializedRef = React.useRef(false)
  const currentIndexRef = React.useRef(defaultIndex)

  const updateState = React.useCallback(() => {
    if (!viewport) return
    const items = Array.from(viewport.children) as HTMLElement[]
    const position =
      orientation === "horizontal" ? viewport.scrollLeft : viewport.scrollTop
    const nextIndex = items.reduce((closest, item, index) => {
      const itemPosition =
        orientation === "horizontal" ? item.offsetLeft : item.offsetTop
      const closestPosition =
        orientation === "horizontal"
          ? (items[closest]?.offsetLeft ?? 0)
          : (items[closest]?.offsetTop ?? 0)
      return Math.abs(itemPosition - position) <
        Math.abs(closestPosition - position)
        ? index
        : closest
    }, 0)

    setItemCount(items.length)
    if (nextIndex !== currentIndexRef.current) {
      currentIndexRef.current = nextIndex
      setCurrentIndex(nextIndex)
      onIndexChange?.(nextIndex)
    }
  }, [onIndexChange, orientation, viewport])

  const scrollToIndex = React.useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      if (!viewport) return
      const items = Array.from(viewport.children) as HTMLElement[]
      const item = items[index]
      if (!item) return
      viewport.scrollTo({
        left: orientation === "horizontal" ? item.offsetLeft : 0,
        top: orientation === "vertical" ? item.offsetTop : 0,
        behavior,
      })
    },
    [orientation, viewport]
  )

  React.useLayoutEffect(() => {
    if (!viewport) return
    if (!initializedRef.current) {
      initializedRef.current = true
      scrollToIndex(defaultIndex, "auto")
    }
    updateState()
    const observer = new ResizeObserver(updateState)
    observer.observe(viewport)
    for (const item of Array.from(viewport.children)) observer.observe(item)
    return () => observer.disconnect()
  }, [defaultIndex, scrollToIndex, updateState, viewport])

  const canScrollPrevious = itemCount > 1 && (loop || currentIndex > 0)
  const canScrollNext = itemCount > 1 && (loop || currentIndex < itemCount - 1)

  function scrollPrevious() {
    const nextIndex =
      currentIndex > 0 ? currentIndex - 1 : loop ? itemCount - 1 : 0
    scrollToIndex(nextIndex)
  }

  function scrollNext() {
    const nextIndex =
      currentIndex < itemCount - 1 ? currentIndex + 1 : loop ? 0 : currentIndex
    scrollToIndex(nextIndex)
  }

  return (
    <CarouselContext.Provider
      value={{
        orientation,
        viewport,
        setViewport,
        updateState,
        scrollPrevious,
        scrollNext,
        canScrollPrevious,
        canScrollNext,
      }}
    >
      <div
        data-slot="carousel"
        data-orientation={orientation}
        role="region"
        aria-roledescription="carousel"
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

/** 轮播项目的可滚动视口。 */
function CarouselContent({
  className,
  onScroll,
  ...props
}: React.ComponentProps<"div">) {
  const { orientation, setViewport, updateState } = useCarousel()

  return (
    <div
      ref={setViewport}
      data-slot="carousel-content"
      className={cn(
        "flex overscroll-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        orientation === "horizontal"
          ? "snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
          : "h-72 snap-y snap-mandatory flex-col overflow-y-auto overflow-x-hidden",
        className
      )}
      onScroll={(event) => {
        onScroll?.(event)
        if (!event.defaultPrevented) updateState()
      }}
      {...props}
    />
  )
}

/** 单个轮播项目。 */
function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel()

  return (
    <div
      data-slot="carousel-item"
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 snap-start",
        orientation === "horizontal" ? "basis-full" : "min-h-full basis-full",
        className
      )}
      {...props}
    />
  )
}

/** 移动到上一个轮播项目。 */
function CarouselPrevious({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrevious, canScrollPrevious } = useCarousel()
  const Icon = orientation === "horizontal" ? ChevronLeftIcon : ChevronUpIcon

  return (
    <Button
      type="button"
      data-slot="carousel-previous"
      variant="outline"
      size="icon"
      aria-label="上一项"
      disabled={!canScrollPrevious}
      className={cn(
        "absolute z-10 rounded-full",
        orientation === "horizontal"
          ? "left-2 top-1/2 -translate-y-1/2"
          : "left-1/2 top-2 -translate-x-1/2",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) scrollPrevious()
      }}
      {...props}
    >
      <Icon />
    </Button>
  )
}

/** 移动到下一个轮播项目。 */
function CarouselNext({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()
  const Icon = orientation === "horizontal" ? ChevronRightIcon : ChevronDownIcon

  return (
    <Button
      type="button"
      data-slot="carousel-next"
      variant="outline"
      size="icon"
      aria-label="下一项"
      disabled={!canScrollNext}
      className={cn(
        "absolute z-10 rounded-full",
        orientation === "horizontal"
          ? "right-2 top-1/2 -translate-y-1/2"
          : "bottom-2 left-1/2 -translate-x-1/2",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) scrollNext()
      }}
      {...props}
    >
      <Icon />
    </Button>
  )
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
}
