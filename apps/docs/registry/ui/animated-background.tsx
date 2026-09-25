"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

/** Props every direct child of `AnimatedBackground` may carry. */
export interface AnimatedBackgroundItemProps {
  /** Unique id of the item, compared with `value`. */
  "data-id": string
  className?: string
  children?: React.ReactNode
  onClick?: React.MouseEventHandler
  onPointerEnter?: React.PointerEventHandler
  onPointerLeave?: React.PointerEventHandler
  onFocus?: React.FocusEventHandler
  onBlur?: React.FocusEventHandler
}

export interface AnimatedBackgroundProps {
  /** Items to highlight. Each direct child needs a unique `data-id`. */
  children:
    | React.ReactElement<AnimatedBackgroundItemProps>
    | React.ReactElement<AnimatedBackgroundItemProps>[]
  /**
   * `click` moves the highlight to the clicked item. `hover` follows the
   * pointer and keyboard focus, then returns to `value` when it leaves.
   * @default "click"
   */
  mode?: "click" | "hover"
  /** Controlled id of the active item. `null` hides the highlight. */
  value?: string | null
  /** Initial active id when uncontrolled. @default null */
  defaultValue?: string | null
  /** Called when a click selects another item. */
  onValueChange?: (value: string) => void
  /** Classes of the moving highlight, e.g. background and radius. */
  highlightClassName?: string
  /** Transition used when the highlight moves between items. */
  transition?: Transition
}

const defaultTransition: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 38,
  mass: 0.7,
}

/**
 * Slides one shared highlight behind the active or hovered child. Renders no
 * wrapper element, so it fits inside any existing flex, grid or list layout.
 */
function AnimatedBackground({
  children,
  mode = "click",
  value,
  defaultValue = null,
  onValueChange,
  highlightClassName,
  transition = defaultTransition,
}: AnimatedBackgroundProps) {
  const layoutId = React.useId()
  const reduceMotion = useReducedMotion()
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const [hoveredId, setHoveredId] = React.useState<string | null>(null)
  const activeId = value !== undefined ? value : internalValue
  const highlightedId = mode === "hover" ? (hoveredId ?? activeId) : activeId

  const select = (id: string) => {
    if (value === undefined) setInternalValue(id)
    onValueChange?.(id)
  }

  return React.Children.map(children, (child) => {
    const props = child.props
    const id = props["data-id"]
    const highlighted = highlightedId === id

    const interaction: Partial<AnimatedBackgroundItemProps> =
      mode === "hover"
        ? {
            onClick: (event) => {
              props.onClick?.(event)
              select(id)
            },
            onPointerEnter: (event) => {
              props.onPointerEnter?.(event)
              setHoveredId(id)
            },
            onPointerLeave: (event) => {
              props.onPointerLeave?.(event)
              setHoveredId((current) => (current === id ? null : current))
            },
            onFocus: (event) => {
              props.onFocus?.(event)
              setHoveredId(id)
            },
            onBlur: (event) => {
              props.onBlur?.(event)
              setHoveredId((current) => (current === id ? null : current))
            },
          }
        : {
            onClick: (event) => {
              props.onClick?.(event)
              select(id)
            },
          }

    return React.cloneElement(
      child,
      {
        ...interaction,
        className: cn("relative isolate", props.className),
        "data-highlighted": highlighted ? "" : undefined,
      } as Partial<AnimatedBackgroundItemProps>,
      <>
        <AnimatePresence initial={false}>
          {highlighted ? (
            <motion.span
              aria-hidden="true"
              data-slot="animated-background-highlight"
              layoutId={layoutId}
              className={cn(
                "pointer-events-none absolute inset-0 -z-10 bg-muted",
                highlightClassName
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : transition}
            />
          ) : null}
        </AnimatePresence>
        {props.children}
      </>
    )
  })
}

export { AnimatedBackground }
