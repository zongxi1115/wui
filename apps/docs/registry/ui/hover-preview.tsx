"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
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
  /** Maximum lean in degrees driven by horizontal pointer speed. `0` disables it. @default 6 */
  tilt?: number
  /** Controlled visibility. */
  open?: boolean
  /** Classes applied to the floating preview. */
  previewClassName?: string
}

const followSpring = { stiffness: 420, damping: 34, mass: 0.25 }
const EDGE = 12

/** Displays a spring-following visual preview for a hovered or focused row. */
function HoverPreview({
  children,
  preview,
  offsetX = 24,
  offsetY = 20,
  tilt = 6,
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
  const [mounted, setMounted] = React.useState(false)
  const previewRef = React.useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, followSpring)
  const y = useSpring(rawY, followSpring)
  const velocityX = useVelocity(x)
  const rotate = useTransform(velocityX, [-1600, 1600], [-tilt, tilt], {
    clamp: true,
  })
  const visible = open ?? ((hovered && finePointer) || focused)

  React.useEffect(() => {
    const media = window.matchMedia("(pointer: fine)")
    const update = () => setFinePointer(media.matches)
    update()
    setMounted(true)
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  function setPosition(clientX: number, clientY: number, jump = false) {
    const width = previewRef.current?.offsetWidth ?? 0
    const height = previewRef.current?.offsetHeight ?? 0
    // Flip to the other side of the pointer when the preview would leave the viewport.
    const nextX =
      clientX + offsetX + width > window.innerWidth - EDGE
        ? clientX - offsetX - width
        : clientX + offsetX
    const nextY = Math.min(
      clientY + offsetY,
      window.innerHeight - height - EDGE
    )

    if (jump) {
      rawX.jump(nextX)
      rawY.jump(nextY)
      x.jump(nextX)
      y.jump(nextY)
      return
    }
    rawX.set(nextX)
    rawY.set(nextY)
  }

  return (
    <motion.div
      data-slot="hover-preview"
      className={cn("relative", className)}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") {
          setPosition(event.clientX, event.clientY, !hovered)
          setHovered(true)
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
        setPosition(rect.right, rect.top + rect.height / 2, true)
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
      {mounted
        ? createPortal(
            <AnimatePresence>
              {visible ? (
                <motion.div
                  ref={previewRef}
                  aria-hidden="true"
                  data-slot="hover-preview-content"
                  className={cn(
                    "pointer-events-none fixed left-0 top-0 z-50 origin-top-left overflow-hidden",
                    previewClassName
                  )}
                  style={{
                    x: reduceMotion ? rawX : x,
                    y: reduceMotion ? rawY : y,
                    rotate: reduceMotion || !tilt ? 0 : rotate,
                  }}
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, scale: 0.9, filter: "blur(4px)" }
                  }
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(2px)" }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.22,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {preview}
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </motion.div>
  )
}

export { HoverPreview }
