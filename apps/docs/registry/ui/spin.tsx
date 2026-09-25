"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { cn } from "@/registry/lib/utils"

const spinIndicatorVariants = cva("inline-flex shrink-0 text-primary", {
  variants: {
    size: {
      sm: "size-4",
      default: "size-6",
      lg: "size-9",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export type SpinVariant = "ring" | "dots"

export interface SpinIndicatorProps
  extends
    React.ComponentProps<typeof motion.svg>,
    VariantProps<typeof spinIndicatorVariants> {
  /** Indicator dimensions. @default "default" */
  size?: "sm" | "default" | "lg"
  /** Indicator style: a rotating arc that breathes, or three pulsing dots. @default "ring" */
  variant?: SpinVariant
}

/** The animated mark used by Spin. */
function SpinIndicator({
  className,
  size = "default",
  variant = "ring",
  ...props
}: SpinIndicatorProps) {
  const reduceMotion = useReducedMotion()

  if (variant === "dots") {
    return (
      <motion.svg
        data-slot="spin-indicator"
        data-variant="dots"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className={cn(spinIndicatorVariants({ size }), className)}
        {...props}
      >
        {[5, 12, 19].map((cx, index) => (
          <motion.circle
            key={cx}
            cx={cx}
            cy="12"
            r="2.4"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={{ opacity: 0.35, scale: 0.75 }}
            animate={
              reduceMotion
                ? { opacity: 0.7, scale: 1 }
                : { opacity: [0.35, 1, 0.35], scale: [0.75, 1, 0.75] }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 1,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: index * 0.16,
                  }
            }
          />
        ))}
      </motion.svg>
    )
  }

  return (
    <motion.svg
      data-slot="spin-indicator"
      data-variant="ring"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn(spinIndicatorVariants({ size }), className)}
      animate={reduceMotion ? undefined : { rotate: 360 }}
      transition={
        reduceMotion
          ? undefined
          : { duration: 0.9, ease: "linear", repeat: Infinity }
      }
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="8.5"
        stroke="currentColor"
        strokeWidth="2.25"
        opacity="0.16"
      />
      {/* The arc grows and shrinks while the whole mark rotates, so the motion reads as progress rather than a fixed wheel. */}
      <motion.circle
        cx="12"
        cy="12"
        r="8.5"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        initial={{ pathLength: 0.25, rotate: 0 }}
        animate={
          reduceMotion
            ? { pathLength: 0.25 }
            : { pathLength: [0.12, 0.62, 0.12], rotate: [0, 120, 360] }
        }
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 1.6, ease: "easeInOut", repeat: Infinity }
        }
      />
    </motion.svg>
  )
}

export interface SpinProps extends React.ComponentProps<"div"> {
  /** Whether the loading state is visible. @default true */
  spinning?: boolean
  /** Indicator dimensions. @default "default" */
  size?: "sm" | "default" | "lg"
  /** Accessible loading message shown beside the indicator. */
  label?: React.ReactNode
  /** Replace the default orbital indicator. */
  indicator?: React.ReactNode
  /** Built-in indicator style. Ignored when `indicator` is provided. @default "ring" */
  variant?: SpinVariant
  /** Wait before showing the indicator to avoid flashes for fast operations. @default 0 */
  delay?: number
  /** Cover the viewport instead of rendering in document flow. @default false */
  fullscreen?: boolean
}

/** A reduced-motion aware loading indicator for inline, nested, and fullscreen states. */
function Spin({
  className,
  children,
  spinning = true,
  size = "default",
  label,
  indicator,
  variant = "ring",
  delay = 0,
  fullscreen = false,
  ...props
}: SpinProps) {
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = React.useState(spinning && delay <= 0)

  React.useEffect(() => {
    if (!spinning) {
      setVisible(false)
      return
    }
    if (delay <= 0) {
      setVisible(true)
      return
    }
    const timer = window.setTimeout(() => setVisible(true), delay)
    return () => window.clearTimeout(timer)
  }, [delay, spinning])

  const status = (
    <motion.div
      role="status"
      aria-live="polite"
      data-slot="spin-status"
      className="text-muted-foreground flex flex-col items-center justify-center gap-2 text-center text-sm"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 2 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 420, damping: 32, mass: 0.65 }
      }
    >
      {indicator ?? <SpinIndicator size={size} variant={variant} />}
      {label ? <span>{label}</span> : <span className="sr-only">加载中</span>}
    </motion.div>
  )

  if (fullscreen) {
    return (
      <AnimatePresence>
        {visible ? (
          <motion.div
            data-slot="spin"
            className={cn(
              "bg-background/90 fixed inset-0 z-50 flex items-center justify-center",
              className
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
            {...(props as unknown as React.ComponentProps<typeof motion.div>)}
          >
            {status}
          </motion.div>
        ) : null}
      </AnimatePresence>
    )
  }

  if (children === undefined) {
    return (
      <div data-slot="spin" className={cn("inline-flex", className)} {...props}>
        <AnimatePresence>{visible ? status : null}</AnimatePresence>
      </div>
    )
  }

  return (
    <div
      data-slot="spin"
      aria-busy={visible}
      className={cn("relative", className)}
      {...props}
    >
      <div
        data-slot="spin-content"
        className={cn(
          "transition-opacity duration-300 ease-out motion-reduce:transition-none",
          visible && "pointer-events-none select-none opacity-40"
        )}
      >
        {children}
      </div>
      <AnimatePresence>
        {visible ? (
          <motion.div
            data-slot="spin-overlay"
            className="absolute inset-0 z-10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.16, ease: "easeOut" }}
          >
            {status}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export { Spin, SpinIndicator, spinIndicatorVariants }
