"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

const dockVariants = cva(
  "group/dock inline-flex gap-1.5 rounded-xl border bg-background p-1.5 shadow-sm",
  {
    variants: {
      direction: {
        horizontal: "flex-row items-end",
        vertical: "flex-col items-start",
      },
    },
    defaultVariants: {
      direction: "horizontal",
    },
  }
)

interface DockContextValue {
  pointer: MotionValue<number>
  direction: "horizontal" | "vertical"
  magnification: number
  distance: number
}

const DockContext = React.createContext<DockContextValue | null>(null)

export interface DockProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof dockVariants> {
  /** 鼠标悬停时的最大放大尺寸（像素）。 @default 56 */
  magnification?: number
  /** 触发放大影响的鼠标距离阈值（像素）。 @default 120 */
  distance?: number
  /** 排列方向。 @default "horizontal" */
  direction?: "horizontal" | "vertical"
}

/**
 * macOS 风格的弹性放大底栏。图标沿垂直于排列方向的一侧放大溢出，底栏自身
 * 尺寸保持不变，相邻图标被平滑推开。
 */
function Dock({
  className,
  direction = "horizontal",
  magnification = 56,
  distance = 120,
  children,
  onPointerMove,
  onPointerLeave,
  ...props
}: DockProps) {
  const pointer = useMotionValue(Infinity)

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event)
    if (event.pointerType === "touch") return
    pointer.set(direction === "horizontal" ? event.clientX : event.clientY)
  }

  const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event)
    pointer.set(Infinity)
  }

  const context = React.useMemo(
    () => ({ pointer, direction, magnification, distance }),
    [pointer, direction, magnification, distance]
  )

  return (
    <DockContext.Provider value={context}>
      <div
        role="toolbar"
        aria-orientation={direction}
        data-slot="dock"
        data-direction={direction}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={cn(dockVariants({ direction }), className)}
        {...props}
      >
        {children}
      </div>
    </DockContext.Provider>
  )
}

export interface DockItemProps extends Omit<
  React.ComponentProps<typeof motion.button>,
  "children"
> {
  /** 基础默认尺寸（像素）。 @default 40 */
  size?: number
  /** 提示标签文案，同时作为无障碍名称。 */
  label?: string
  /** 标记为当前激活项，在图标下方显示指示点。 */
  active?: boolean
  /** 子元素内容，内部 SVG 图标会随尺寸等比放大。 */
  children?: React.ReactNode
}

const springConfig = { mass: 0.1, stiffness: 170, damping: 14 }

function DockItem({
  className,
  size = 40,
  label,
  active = false,
  children,
  style,
  ...props
}: DockItemProps) {
  const slotRef = React.useRef<HTMLDivElement>(null)
  const fallbackPointer = useMotionValue(Infinity)
  const context = React.useContext(DockContext)
  const reduceMotion = useReducedMotion()

  const pointer = context?.pointer ?? fallbackPointer
  const direction = context?.direction ?? "horizontal"
  const magnification = context?.magnification ?? 56
  const distance = context?.distance ?? 120

  // Measure the in-flow slot; the button is absolutely positioned inside it
  // and overflows the dock as it grows.
  const offset = useTransform(pointer, (value: number) => {
    const bounds = slotRef.current?.getBoundingClientRect()
    if (!bounds || !Number.isFinite(value)) return Infinity
    const center =
      direction === "horizontal"
        ? bounds.left + bounds.width / 2
        : bounds.top + bounds.height / 2
    return value - center
  })
  const targetSize = useTransform(
    offset,
    [-distance, 0, distance],
    [size, magnification, size]
  )
  const animatedSize = useSpring(targetSize, springConfig)
  const itemSize = reduceMotion ? size : animatedSize

  return (
    <motion.div
      ref={slotRef}
      data-slot="dock-item-slot"
      className="relative shrink-0"
      style={
        direction === "horizontal"
          ? { width: itemSize, height: size }
          : { width: size, height: itemSize }
      }
    >
      <motion.button
        type="button"
        data-slot="dock-item"
        data-active={active || undefined}
        aria-label={label}
        style={{ ...style, width: itemSize, height: itemSize }}
        className={cn(
          "group/dock-item absolute flex cursor-pointer items-center justify-center rounded-lg bg-muted/70 text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[active]:bg-muted [&_svg]:size-[45%] [&_svg]:shrink-0",
          direction === "horizontal"
            ? "bottom-0 left-1/2 -translate-x-1/2"
            : "left-0 top-1/2 -translate-y-1/2",
          className
        )}
        {...props}
      >
        {children}
        {active ? (
          <span
            aria-hidden="true"
            className={cn(
              "bg-foreground/70 pointer-events-none absolute size-1 rounded-full",
              direction === "horizontal"
                ? "-bottom-1.5 left-1/2 -translate-x-1/2"
                : "-left-1.5 top-1/2 -translate-y-1/2"
            )}
          />
        ) : null}
        {label ? (
          <span
            aria-hidden="true"
            className={cn(
              "bg-foreground text-background pointer-events-none absolute whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium opacity-0 transition-[opacity,translate] duration-150 ease-out group-hover/dock-item:opacity-100 group-focus-visible/dock-item:opacity-100",
              direction === "horizontal"
                ? "bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-1 group-hover/dock-item:translate-y-0 group-focus-visible/dock-item:translate-y-0"
                : "left-full top-1/2 ml-2 -translate-y-1/2 -translate-x-1 group-hover/dock-item:translate-x-0 group-focus-visible/dock-item:translate-x-0"
            )}
          >
            {label}
          </span>
        ) : null}
      </motion.button>
    </motion.div>
  )
}

function DockSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="separator"
      data-slot="dock-separator"
      className={cn(
        "bg-border shrink-0 self-center",
        "group-data-[direction=horizontal]/dock:mx-1 group-data-[direction=horizontal]/dock:h-6 group-data-[direction=horizontal]/dock:w-px",
        "group-data-[direction=vertical]/dock:my-1 group-data-[direction=vertical]/dock:h-px group-data-[direction=vertical]/dock:w-6",
        className
      )}
      {...props}
    />
  )
}

export { Dock, DockItem, DockSeparator, dockVariants }
