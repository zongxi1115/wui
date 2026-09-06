"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react"

import { cn } from "@/registry/lib/utils"

const dockVariants = cva(
  "inline-flex items-center gap-2 rounded-2xl border border-border/80 bg-background/80 p-2 shadow-lg backdrop-blur-md",
  {
    variants: {
      direction: {
        horizontal: "flex-row",
        vertical: "flex-col",
      },
    },
    defaultVariants: {
      direction: "horizontal",
    },
  }
)

interface DockContextValue {
  mouseX: ReturnType<typeof useMotionValue<number>>
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

/** macOS 风格的弹性放大悬浮底栏，随着鼠标经过产生流畅的连续缩放微动效。 */
function Dock({
  className,
  direction = "horizontal",
  magnification = 56,
  distance = 120,
  children,
  onMouseMove,
  onMouseLeave,
  ...props
}: DockProps) {
  const mouseX = useMotionValue(Infinity)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseX.set(direction === "horizontal" ? e.pageX : e.pageY)
    onMouseMove?.(e)
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseX.set(Infinity)
    onMouseLeave?.(e)
  }

  return (
    <DockContext.Provider value={{ mouseX, magnification, distance }}>
      <div
        data-slot="dock"
        data-direction={direction}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(dockVariants({ direction }), className)}
        {...props}
      >
        {children}
      </div>
    </DockContext.Provider>
  )
}

export interface DockItemProps extends Omit<React.ComponentProps<typeof motion.button>, "children"> {
  /** 基础默认尺寸（像素）。 @default 40 */
  size?: number
  /** 提示标签文案。 */
  label?: string
  /** 子元素内容。 */
  children?: React.ReactNode
}

function DockItem({
  className,
  size = 40,
  label,
  children,
  ...props
}: DockItemProps) {
  const ref = React.useRef<HTMLButtonElement>(null)
  const context = React.useContext(DockContext)
  const reduceMotion = useReducedMotion()

  const mousePos = context?.mouseX ?? useMotionValue(Infinity)
  const magnification = context?.magnification ?? 56
  const distance = context?.distance ?? 120

  const distanceCalc = useTransform(mousePos, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, y: 0, width: 0, height: 0 }
    const center = bounds.x + bounds.width / 2
    return val - center
  })

  const widthSync = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [size, magnification, size]
  )

  const springConfig = { mass: 0.1, stiffness: 160, damping: 12 }
  const width = useSpring(widthSync, springConfig)

  return (
    <motion.button
      ref={ref}
      type="button"
      data-slot="dock-item"
      title={label}
      aria-label={label}
      style={reduceMotion ? { width: size, height: size } : { width, height: width }}
      className={cn(
        "group relative flex items-center justify-center rounded-xl bg-card border border-border/60 text-foreground transition-colors hover:border-border hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 cursor-pointer shadow-xs",
        className
      )}
      {...props}
    >
      <div className="flex size-full items-center justify-center pointer-events-none">
        {children}
      </div>
      {label && (
        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-popover px-2 py-0.5 text-[10px] font-medium text-popover-foreground shadow-md opacity-0 transition-opacity duration-150 group-hover:opacity-100 whitespace-nowrap">
          {label}
        </span>
      )}
    </motion.button>
  )
}

function DockSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dock-separator"
      className={cn("h-6 w-px bg-border/80 mx-1", className)}
      {...props}
    />
  )
}

export { Dock, DockItem, DockSeparator, dockVariants }
