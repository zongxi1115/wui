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

export interface SpinIndicatorProps
  extends
    React.ComponentProps<typeof motion.svg>,
    VariantProps<typeof spinIndicatorVariants> {
  /** Indicator dimensions. @default "default" */
  size?: "sm" | "default" | "lg"
}

/** The animated orbital mark used by Spin. */
function SpinIndicator({
  className,
  size = "default",
  ...props
}: SpinIndicatorProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.svg
      data-slot="spin-indicator"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn(spinIndicatorVariants({ size }), className)}
      animate={reduceMotion ? undefined : { rotate: 360 }}
      transition={
        reduceMotion
          ? undefined
          : { duration: 0.82, ease: "linear", repeat: Infinity }
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
      <path
        d="M12 3.5a8.5 8.5 0 0 1 8.5 8.5"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
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
      {indicator ?? <SpinIndicator size={size} />}
      {label ? <span>{label}</span> : <span className="sr-only">Loading</span>}
    </motion.div>
  )

  if (fullscreen) {
    return (
      <AnimatePresence>
        {visible ? (
          <motion.div
            data-slot="spin"
            className={cn(
              "bg-background/86 fixed inset-0 z-50 flex items-center justify-center",
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
          "transition-opacity duration-200 motion-reduce:transition-none",
          visible && "pointer-events-none select-none opacity-45"
        )}
      >
        {children}
      </div>
      <AnimatePresence>
        {visible ? (
          <motion.div
            data-slot="spin-overlay"
            className="bg-background/55 absolute inset-0 z-10 flex items-center justify-center"
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

export { Spin, spinIndicatorVariants }
