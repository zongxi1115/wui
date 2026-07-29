"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface HoverPreviewProps extends Omit<
  HTMLMotionProps<"div">,
  "children"
> {
  /** Interactive row, link, or control that activates the preview. */
  children: React.ReactNode
  /** Visual content displayed beside the pointer. */
  preview: React.ReactNode
  /** Horizontal pointer offset in pixels. @default 24 */
  offsetX?: number
  /** Vertical pointer offset in pixels. @default 20 */
  offsetY?: number
  /** Controlled visibility. */
  open?: boolean
  /** Classes applied to the floating preview. */
  previewClassName?: string
}

/** Displays a spring-following visual preview for a hovered or focused row. */
function HoverPreview({
  children,
  preview,
  offsetX = 24,
  offsetY = 20,
  open,
  className,
  previewClassName,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: HoverPreviewProps) {
  const [hovered, setHovered] = React.useState(false)
  const [focused, setFocused] = React.useState(false)
  const [finePointer, setFinePointer] = React.useState(false)
  const reduceMotion = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 420, damping: 34, mass: 0.25 })
  const y = useSpring(rawY, { stiffness: 420, damping: 34, mass: 0.25 })
  const visible = open ?? ((hovered && finePointer) || focused)

  React.useEffect(() => {
    const media = window.matchMedia("(pointer: fine)")
    const update = () => setFinePointer(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  function setPosition(clientX: number, clientY: number) {
    rawX.set(clientX + offsetX)
    rawY.set(clientY + offsetY)
  }

  return (
    <motion.div
      data-slot="hover-preview"
      className={cn("relative", className)}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") {
          setHovered(true)
          setPosition(event.clientX, event.clientY)
        }
        onPointerEnter?.(event)
      }}
      onPointerMove={(event) => {
        if (event.pointerType !== "touch")
          setPosition(event.clientX, event.clientY)
        onPointerMove?.(event)
      }}
      onPointerLeave={(event) => {
        setHovered(false)
        onPointerLeave?.(event)
      }}
      onFocus={(event) => {
        setFocused(true)
        const rect = event.currentTarget.getBoundingClientRect()
        setPosition(rect.right, rect.top + rect.height / 2)
        onFocus?.(event)
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false)
        onBlur?.(event)
      }}
      {...props}
    >
      {children}
      <AnimatePresence>
        {visible ? (
          <motion.div
            aria-hidden="true"
            data-slot="hover-preview-content"
            className={cn(
              "pointer-events-none fixed left-0 top-0 z-50 overflow-hidden",
              previewClassName
            )}
            style={{ x: reduceMotion ? rawX : x, y: reduceMotion ? rawY : y }}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          >
            {preview}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}

export { HoverPreview }
