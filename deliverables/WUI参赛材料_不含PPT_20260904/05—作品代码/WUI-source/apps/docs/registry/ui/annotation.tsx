"use client"

import * as React from "react"
import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type SVGMotionProps,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

const DEFAULT_PATH = "M5 70C35 70 30 17 72 22C108 26 112 61 154 10"

const visiblePath = { opacity: 1, pathLength: 1 }
const hiddenPath = { opacity: 0, pathLength: 0 }

export interface AnnotationPathProps extends Omit<
  SVGMotionProps<SVGSVGElement>,
  "color"
> {
  /** SVG path data to draw. */
  path?: string
  /** Stroke color. @default "currentColor" */
  color?: string
  /** Stroke width in viewBox units. @default 3 */
  strokeWidth?: number
  /** Add an arrowhead after the path finishes drawing. @default true */
  arrow?: boolean
  /** Seconds used to draw the path. @default 0.8 */
  duration?: number
  /** Delay before drawing, in seconds. @default 0 */
  delay?: number
  /** Start drawing when the path enters the viewport. @default true */
  inView?: boolean
  /** Only draw the first time the path enters the viewport. @default true */
  once?: boolean
  /** Additional props forwarded to the animated path element. */
  pathProps?: Omit<SVGMotionProps<SVGPathElement>, "d">
}

/** Draws a curved arrow or any custom SVG path to guide attention. */
function AnnotationPath({
  path = DEFAULT_PATH,
  viewBox = "0 0 160 80",
  color = "currentColor",
  strokeWidth = 3,
  arrow = true,
  duration = 0.8,
  delay = 0,
  inView = true,
  once = true,
  className,
  pathProps,
  ...props
}: AnnotationPathProps) {
  const reduceMotion = useReducedMotion()
  const markerId = `annotation-arrow-${React.useId().replaceAll(":", "")}`
  const transition = {
    duration: reduceMotion ? 0 : duration,
    delay: reduceMotion ? 0 : delay,
    ease: [0.22, 1, 0.36, 1] as const,
  }
  const arrowTransition = {
    duration: reduceMotion ? 0 : Math.min(0.2, duration * 0.25),
    delay: reduceMotion ? 0 : delay + duration * 0.82,
    ease: "easeOut" as const,
  }

  return (
    <motion.svg
      aria-hidden="true"
      data-slot="annotation-path"
      viewBox={viewBox}
      fill="none"
      className={cn("pointer-events-none overflow-visible", className)}
      {...props}
    >
      {arrow ? (
        <defs>
          <marker
            id={markerId}
            viewBox="0 0 10 10"
            refX="8.5"
            refY="5"
            markerWidth="3.5"
            markerHeight="3.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M1 1L9 5L1 9Z" fill={color} />
          </marker>
        </defs>
      ) : null}
      <motion.path
        d={path}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduceMotion ? false : hiddenPath}
        animate={!inView || reduceMotion ? visiblePath : undefined}
        whileInView={inView && !reduceMotion ? visiblePath : undefined}
        viewport={{ once, amount: 0.35 }}
        transition={transition}
        {...pathProps}
      />
      {arrow ? (
        <motion.path
          d={path}
          stroke="transparent"
          strokeWidth={strokeWidth}
          markerEnd={`url(#${markerId})`}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={!inView || reduceMotion ? { opacity: 1 } : undefined}
          whileInView={inView && !reduceMotion ? { opacity: 1 } : undefined}
          viewport={{ once, amount: 0.35 }}
          transition={arrowTransition}
        />
      ) : null}
    </motion.svg>
  )
}

export interface AnnotationHighlightProps extends Omit<
  HTMLMotionProps<"span">,
  "children" | "color"
> {
  /** Inline content placed above the marker stroke. */
  children: React.ReactNode
  /** Shape of the marker stroke. @default "smooth" */
  variant?: "smooth" | "rough"
  /** Marker color. @default "oklch(0.88 0.16 92 / 0.58)" */
  color?: string
  /** Seconds used to sweep across the content. @default 0.65 */
  duration?: number
  /** Delay before highlighting, in seconds. @default 0 */
  delay?: number
  /** Start highlighting when the content enters the viewport. @default true */
  inView?: boolean
  /** Only highlight the first time the content enters the viewport. @default true */
  once?: boolean
}

/** Sweeps a smooth or hand-drawn highlighter stroke behind inline content. */
function AnnotationHighlight({
  children,
  variant = "smooth",
  color = "oklch(0.88 0.16 92 / 0.58)",
  duration = 0.65,
  delay = 0,
  inView = true,
  once = true,
  className,
  ...props
}: AnnotationHighlightProps) {
  const reduceMotion = useReducedMotion()
  const transition = {
    duration: reduceMotion ? 0 : duration,
    delay: reduceMotion ? 0 : delay,
    ease: [0.22, 1, 0.36, 1] as const,
  }
  const activation = {
    initial: reduceMotion ? false : hiddenPath,
    animate: !inView || reduceMotion ? visiblePath : undefined,
    whileInView: inView && !reduceMotion ? visiblePath : undefined,
    viewport: { once, amount: 0.7 },
  }

  return (
    <motion.span
      data-slot="annotation-highlight"
      className={cn(
        "relative isolate inline-block whitespace-nowrap",
        className
      )}
      {...props}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 100 24"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -inset-x-[3%] bottom-[4%] z-0 h-[72%] w-[106%] overflow-visible"
      >
        <motion.path
          d={
            variant === "rough"
              ? "M2 13C14 9 24 16 37 12C52 8 61 16 74 11C84 8 91 14 98 10"
              : "M2 12C28 11.5 72 12.5 98 12"
          }
          fill="none"
          stroke={color}
          strokeWidth={variant === "rough" ? 15 : 14}
          strokeLinecap={variant === "rough" ? "square" : "round"}
          strokeLinejoin="round"
          transition={transition}
          {...activation}
        />
        {variant === "rough" ? (
          <motion.path
            d="M1 16C16 12 27 17 42 14C58 11 70 17 99 13"
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="square"
            transition={{ ...transition, delay: transition.delay + 0.06 }}
            {...activation}
          />
        ) : null}
      </svg>
      <span data-slot="annotation-highlight-content" className="relative z-10">
        {children}
      </span>
    </motion.span>
  )
}

export { AnnotationHighlight, AnnotationPath }
