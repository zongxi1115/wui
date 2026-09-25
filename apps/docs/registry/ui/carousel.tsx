"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "lucide-react"
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type AnimationPlaybackControls,
  type MotionValue,
} from "motion/react"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"

const SPRING = { type: "spring", stiffness: 520, damping: 38, mass: 0.7 } as const

type CarouselContextValue = {
  orientation: "horizontal" | "vertical"
  /** Index of the snap position currently aligned with the viewport start. */
  currentIndex: number
  /** Number of distinct snap positions (pages). */
  count: number
  /** Whether autoplay is enabled. */
  autoplay: boolean
  /** Autoplay progress of the current page, from 0 to 1. */
  progress: MotionValue<number>
  layoutId: string
  setViewport: (viewport: HTMLDivElement | null) => void
  updateState: () => void
  scrollTo: (index: number) => void
  scrollPrevious: () => void
  scrollNext: () => void
  canScrollPrevious: boolean
  canScrollNext: boolean
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null)

/** 读取最近的 Carousel 状态，可用于构建计数器等自定义指示器。 */
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
  /**
   * 自动播放。传入数字时作为每页停留的毫秒数，`true` 为 5000ms。
   * 指针悬停、键盘焦点位于轮播内或页面隐藏时自动暂停；到达末页后回到第一页。
   * @default false
   */
  autoplay?: boolean | number
}

/** 使用原生滚动和 scroll-snap 展示一组可逐项浏览的内容。 */
function Carousel({
  className,
  orientation = "horizontal",
  loop = false,
  defaultIndex = 0,
  onIndexChange,
  autoplay = false,
  onKeyDown,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  children,
  ...props
}: CarouselProps) {
  const reduceMotion = useReducedMotion()
  const layoutId = React.useId()
  const [viewport, setViewport] = React.useState<HTMLDivElement | null>(null)
  const [currentIndex, setCurrentIndex] = React.useState(defaultIndex)
  const [snapPoints, setSnapPoints] = React.useState<number[]>([])
  const [hovered, setHovered] = React.useState(false)
  const [focused, setFocused] = React.useState(false)
  const [documentHidden, setDocumentHidden] = React.useState(false)
  const initializedRef = React.useRef(false)
  const currentIndexRef = React.useRef(defaultIndex)
  const onIndexChangeRef = React.useRef(onIndexChange)
  const progress = useMotionValue(0)
  const autoplayControls = React.useRef<AnimationPlaybackControls | null>(null)
  const count = snapPoints.length
  const autoplayDelay =
    autoplay === true ? 5000 : typeof autoplay === "number" ? autoplay : 0
  const autoplayPaused = hovered || focused || documentHidden

  React.useEffect(() => {
    onIndexChangeRef.current = onIndexChange
  }, [onIndexChange])

  const getSnapPoints = React.useCallback(() => {
    if (!viewport) return []
    const horizontal = orientation === "horizontal"
    const maxScroll = horizontal
      ? viewport.scrollWidth - viewport.clientWidth
      : viewport.scrollHeight - viewport.clientHeight
    const points: number[] = []
    for (const item of Array.from(viewport.children) as HTMLElement[]) {
      const offset = horizontal ? item.offsetLeft : item.offsetTop
      const point = Math.min(Math.max(offset, 0), maxScroll)
      if (!points.some((existing) => Math.abs(existing - point) < 2)) {
        points.push(point)
      }
    }
    return points
  }, [orientation, viewport])

  const updateState = React.useCallback(() => {
    if (!viewport) return
    const horizontal = orientation === "horizontal"
    const points = getSnapPoints()
    const position = horizontal ? viewport.scrollLeft : viewport.scrollTop
    const nextIndex = points.reduce(
      (closest, point, index) =>
        Math.abs(point - position) < Math.abs(points[closest] - position)
          ? index
          : closest,
      0
    )

    // Mark slides that are mostly inside the viewport so they can be styled
    // with `data-[active]:` without re-rendering every item on scroll.
    const size = horizontal ? viewport.clientWidth : viewport.clientHeight
    for (const item of Array.from(viewport.children) as HTMLElement[]) {
      const start = (horizontal ? item.offsetLeft : item.offsetTop) - position
      const length = horizontal ? item.offsetWidth : item.offsetHeight
      const visible = Math.min(start + length, size) - Math.max(start, 0)
      item.toggleAttribute("data-active", visible > length / 2)
    }

    setSnapPoints((current) =>
      current.length === points.length &&
      current.every((point, index) => point === points[index])
        ? current
        : points
    )
    if (nextIndex !== currentIndexRef.current) {
      currentIndexRef.current = nextIndex
      setCurrentIndex(nextIndex)
      onIndexChangeRef.current?.(nextIndex)
    }
  }, [getSnapPoints, orientation, viewport])

  const scrollTo = React.useCallback(
    (index: number, behavior?: ScrollBehavior) => {
      if (!viewport) return
      const point = getSnapPoints()[index]
      if (point === undefined) return
      viewport.scrollTo({
        [orientation === "horizontal" ? "left" : "top"]: point,
        behavior: behavior ?? (reduceMotion ? "auto" : "smooth"),
      })
    },
    [getSnapPoints, orientation, reduceMotion, viewport]
  )

  React.useLayoutEffect(() => {
    if (!viewport) return
    if (!initializedRef.current) {
      initializedRef.current = true
      scrollTo(defaultIndex, "auto")
    }
    updateState()
    const resizeObserver = new ResizeObserver(updateState)
    resizeObserver.observe(viewport)
    for (const item of Array.from(viewport.children)) {
      resizeObserver.observe(item)
    }
    const mutationObserver = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of Array.from(record.addedNodes)) {
          if (node instanceof Element) resizeObserver.observe(node)
        }
      }
      updateState()
    })
    mutationObserver.observe(viewport, { childList: true })
    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [defaultIndex, scrollTo, updateState, viewport])

  React.useEffect(() => {
    function handleVisibilityChange() {
      setDocumentHidden(document.visibilityState === "hidden")
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  // One linear tween drives both the timer and the progress fill in
  // CarouselDots, so the visual indicator can never drift from the timer.
  React.useEffect(() => {
    progress.set(0)
    if (!autoplayDelay || count < 2) return
    const controls = animate(progress, 1, {
      duration: autoplayDelay / 1000,
      ease: "linear",
      onComplete: () => scrollTo((currentIndex + 1) % count),
    })
    autoplayControls.current = controls
    return () => {
      controls.stop()
      autoplayControls.current = null
    }
  }, [autoplayDelay, count, currentIndex, progress, scrollTo])

  React.useEffect(() => {
    if (autoplayPaused) autoplayControls.current?.pause()
    else autoplayControls.current?.play()
  }, [autoplayPaused, currentIndex, count])

  const canScrollPrevious = count > 1 && (loop || currentIndex > 0)
  const canScrollNext = count > 1 && (loop || currentIndex < count - 1)

  function scrollPrevious() {
    if (!canScrollPrevious) return
    scrollTo(currentIndex > 0 ? currentIndex - 1 : count - 1)
  }

  function scrollNext() {
    if (!canScrollNext) return
    scrollTo(currentIndex < count - 1 ? currentIndex + 1 : 0)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const target = event.target as HTMLElement
    if (target.matches("input, textarea, select, [contenteditable=true]")) {
      return
    }
    const previousKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp"
    const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown"
    if (event.key === previousKey) {
      event.preventDefault()
      scrollPrevious()
    } else if (event.key === nextKey) {
      event.preventDefault()
      scrollNext()
    }
  }

  return (
    <CarouselContext.Provider
      value={{
        orientation,
        currentIndex,
        count,
        autoplay: autoplayDelay > 0,
        progress,
        layoutId,
        setViewport,
        updateState,
        scrollTo,
        scrollPrevious,
        scrollNext,
        canScrollPrevious,
        canScrollNext,
      }}
    >
      <div
        data-slot="carousel"
        data-orientation={orientation}
        data-paused={autoplayDelay && autoplayPaused ? "" : undefined}
        role="region"
        aria-roledescription="carousel"
        className={cn("relative", className)}
        onKeyDown={handleKeyDown}
        onPointerEnter={(event) => {
          onPointerEnter?.(event)
          if (event.pointerType === "mouse") setHovered(true)
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event)
          setHovered(false)
        }}
        onFocus={(event) => {
          onFocus?.(event)
          if ((event.target as HTMLElement).matches(":focus-visible")) {
            setFocused(true)
          }
        }}
        onBlur={(event) => {
          onBlur?.(event)
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setFocused(false)
          }
        }}
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
  const { orientation, autoplay, setViewport, updateState } = useCarousel()

  return (
    <div
      ref={setViewport}
      data-slot="carousel-content"
      aria-live={autoplay ? "off" : "polite"}
      className={cn(
        "relative flex overscroll-contain scroll-smooth [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden",
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

/**
 * 单个轮播项目。位于视口内的项目会带上 `data-active` 属性，
 * 可使用 `data-[active]:` 变体为当前项目设置样式。
 */
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

/**
 * 页码指示器。当前页的圆点拉伸为胶囊并在圆点间滑动；
 * 开启 `autoplay` 时，胶囊内会显示本页的播放进度。
 */
function CarouselDots({ className, ...props }: React.ComponentProps<"div">) {
  const {
    orientation,
    currentIndex,
    count,
    autoplay,
    progress,
    layoutId,
    scrollTo,
  } = useCarousel()
  const reduceMotion = useReducedMotion()
  const horizontal = orientation === "horizontal"
  const transition = reduceMotion ? { duration: 0 } : SPRING

  if (count < 2) return null

  return (
    <div
      data-slot="carousel-dots"
      role="group"
      aria-label="选择页面"
      className={cn(
        "flex items-center justify-center",
        horizontal ? "flex-row" : "flex-col",
        className
      )}
      {...props}
    >
      {Array.from({ length: count }, (_, index) => {
        const active = index === currentIndex
        return (
          <button
            key={index}
            type="button"
            data-slot="carousel-dot"
            data-active={active ? "" : undefined}
            aria-label={`第 ${index + 1} 页，共 ${count} 页`}
            aria-current={active ? "true" : undefined}
            className={cn(
              "group/dot flex items-center justify-center rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
              horizontal ? "h-6 px-1" : "w-6 py-1"
            )}
            onClick={() => scrollTo(index)}
          >
            <motion.span
              layout
              transition={transition}
              style={{ borderRadius: 999 }}
              className={cn(
                "relative block overflow-hidden bg-foreground/20 transition-colors group-hover/dot:bg-foreground/35",
                horizontal
                  ? cn("h-1.5", active ? "w-5" : "w-1.5")
                  : cn("w-1.5", active ? "h-5" : "h-1.5")
              )}
            >
              {active ? (
                <motion.span
                  layoutId={`${layoutId}-carousel-dot`}
                  transition={transition}
                  style={{ borderRadius: 999 }}
                  className={cn(
                    "absolute inset-0 overflow-hidden",
                    autoplay ? "bg-primary/30" : "bg-primary"
                  )}
                >
                  {autoplay ? (
                    <motion.span
                      className={cn(
                        "absolute inset-0 bg-primary",
                        horizontal ? "origin-left" : "origin-top"
                      )}
                      style={horizontal ? { scaleX: progress } : { scaleY: progress }}
                    />
                  ) : null}
                </motion.span>
              ) : null}
            </motion.span>
          </button>
        )
      })}
    </div>
  )
}

export {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
}
