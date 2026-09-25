"use client"

import * as React from "react"
import { Slot } from "radix-ui"
import { LoaderCircleIcon } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const buttonVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md text-sm font-medium outline-none transition-[color,background-color,border-color,box-shadow,opacity,scale] duration-200 ease-out active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[loading]:disabled:opacity-80 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        // `link` keeps a transparent surface; the animated underline is drawn by
        // the wrapped label below (see `LinkLabel`). `group` lets that pseudo
        // element react to hover on the button itself.
        link: "group text-primary hover:text-primary/80 active:scale-100",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps extends React.ComponentProps<"button"> {
  /** Visual style of the button. */
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link"
  /** Height and padding preset. Use `icon` for square icon-only buttons. */
  size?: "default" | "sm" | "lg" | "icon"
  /** Render as the single child element via Radix Slot, e.g. to wrap an `<a>`. */
  asChild?: boolean
  /**
   * Enable a subtle spring press/hover micro-interaction (powered by motion).
   * Composable with `ripple`. Ignored when `asChild` is set, and automatically
   * disabled when the user prefers reduced motion.
   */
  motion?: boolean
  /**
   * Enable a Material-style click ripple that radiates from the pointer.
   * Composable with `motion`. Ignored when `asChild` is set, and automatically
   * disabled when the user prefers reduced motion.
   */
  ripple?: boolean
  /**
   * Show an inline spinner and block interaction while an async action runs.
   * The spinner slides in before the label (or replaces the glyph for
   * `size="icon"`). Sets `aria-busy` and disables the button.
   */
  loading?: boolean
}

const spring = { type: "spring", stiffness: 520, damping: 38, mass: 0.7 } as const

type Ripple = { key: number; x: number; y: number; size: number }

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  motion: enableMotion = false,
  ripple: enableRipple = false,
  loading: loadingProp,
  disabled,
  onClick,
  children,
  ...props
}: ButtonProps) {
  const reduceMotion = useReducedMotion()
  const loading = loadingProp === true
  const [ripples, setRipples] = React.useState<Ripple[]>([])
  const rippleKey = React.useRef(0)

  const isLink = variant === "link"
  const classes = cn(
    buttonVariants({ variant, size }),
    // `asChild` hands the element to the caller, so the wrapped-label underline
    // can't apply — fall back to a text-hugging (non-animated) underline.
    isLink && asChild && "underline-offset-4 hover:underline",
    className
  )
  const dataProps = {
    "data-slot": "button",
    "data-variant": variant,
    "data-size": size,
    "data-loading": loading || undefined,
    "aria-busy": loading || undefined,
    disabled: disabled || loading,
  }

  // asChild renders the caller's element verbatim — no effect layers injected.
  if (asChild) {
    return (
      <Slot.Root {...dataProps} className={classes} onClick={onClick} {...props}>
        {children}
      </Slot.Root>
    )
  }

  const useRipple = enableRipple && !reduceMotion
  const useMotion = enableMotion && !reduceMotion

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (useRipple) {
      const rect = event.currentTarget.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height) * 2
      setRipples((prev) => [
        ...prev,
        {
          key: rippleKey.current++,
          x: event.clientX - rect.left - size / 2,
          y: event.clientY - rect.top - size / 2,
          size,
        },
      ])
    }
    onClick?.(event)
  }

  // Icon buttons only get the crossfade wrapper when they opt into `loading`,
  // so existing `[&>svg]` overrides keep matching the glyph directly.
  const isIcon = size === "icon" && loadingProp !== undefined
  const swap = reduceMotion ? { duration: 0 } : spring
  const gap = size === "sm" ? 6 : 8

  const label = isLink ? <LinkLabel>{children}</LinkLabel> : children

  const content = (
    <>
      {isIcon ? (
        <>
          <motion.span
            data-slot="button-label"
            className="inline-flex items-center justify-center"
            initial={false}
            animate={{ opacity: loading ? 0 : 1, scale: loading ? 0.6 : 1 }}
            transition={swap}
          >
            {children}
          </motion.span>
          <AnimatePresence initial={false}>
            {loading ? (
              <motion.span
                key="spinner"
                aria-hidden
                data-slot="button-spinner"
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={swap}
              >
                <LoaderCircleIcon className="animate-spin motion-reduce:animate-none" />
              </motion.span>
            ) : null}
          </AnimatePresence>
        </>
      ) : (
        <>
          <AnimatePresence initial={false}>
            {loading ? (
              <motion.span
                key="spinner"
                aria-hidden
                data-slot="button-spinner"
                className="inline-flex shrink-0 items-center overflow-hidden"
                initial={{ width: 0, opacity: 0, marginInlineEnd: -gap }}
                animate={{ width: 16, opacity: 1, marginInlineEnd: 0 }}
                exit={{ width: 0, opacity: 0, marginInlineEnd: -gap }}
                transition={swap}
              >
                <LoaderCircleIcon className="animate-spin motion-reduce:animate-none" />
              </motion.span>
            ) : null}
          </AnimatePresence>
          {label}
        </>
      )}
      {useRipple ? (
        <span
          aria-hidden
          data-slot="button-ripple"
          className="pointer-events-none absolute inset-0"
        >
          {ripples.map((r) => (
            <motion.span
              key={r.key}
              className="absolute rounded-full bg-current"
              style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
              initial={{ scale: 0, opacity: 0.35 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              onAnimationComplete={() =>
                setRipples((prev) => prev.filter((p) => p.key !== r.key))
              }
            />
          ))}
        </span>
      ) : null}
    </>
  )

  if (useMotion) {
    return (
      <motion.button
        {...dataProps}
        className={classes}
        onClick={handleClick}
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.6 }}
        {...(props as unknown as HTMLMotionProps<"button">)}
      >
        {content}
      </motion.button>
    )
  }

  return (
    <button {...dataProps} className={classes} onClick={handleClick} {...props}>
      {content}
    </button>
  )
}

/**
 * Wraps a `link`-variant button's label so an animated underline can hug the
 * text (independent of the button's padding) and slide in on hover.
 */
function LinkLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      data-slot="button-label"
      className="relative inline-flex items-center gap-2 after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-out group-hover:after:origin-left group-hover:after:scale-x-100"
    >
      {children}
    </span>
  )
}

export { Button, buttonVariants }
