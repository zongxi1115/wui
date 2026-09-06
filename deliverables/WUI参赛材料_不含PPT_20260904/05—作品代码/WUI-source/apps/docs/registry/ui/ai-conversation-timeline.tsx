"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface AiConversationTimelineItem {
  /** Stable item identifier. */
  id: string
  /** Primary text shown in the preview. */
  title: string
  /** Optional response or contextual summary. */
  description?: string
  /** Optional compact metadata, such as a time or model name. */
  meta?: string
  /** Visual depth of the tick; deeper levels render shorter. @default 1 */
  level?: 1 | 2 | 3
}

export interface AiConversationTimelineProps
  extends Omit<React.ComponentProps<"nav">, "children"> {
  /** Ordered conversation turns. */
  items: readonly AiConversationTimelineItem[]
  /** Controlled active item. */
  activeId?: string
  /** Initial active item in uncontrolled mode. */
  defaultActiveId?: string
  /** Side on which the hover preview appears. @default "right" */
  previewSide?: "left" | "right"
  /** Render the hover preview card. @default true */
  preview?: boolean
  /** Called when a marker becomes active. */
  onActiveChange?: (id: string) => void
  /** Called when the user selects a marker. */
  onNavigate?: (item: AiConversationTimelineItem, index: number) => void
}

/** Vertical pitch of one tick row, in pixels. */
const ROW = 9
/** Vertical padding inside the strip, in pixels. */
const PAD = 6
/**
 * Falloff radius of the pointer magnifier, in pixels. Wide enough for the
 * ticks immediately above and below the pointer to follow with a small lift.
 */
const SPREAD = 14
/** Resting and magnified tick lengths per level. */
const LENGTHS = {
  1: { rest: 12, peak: 46 },
  2: { rest: 9, peak: 38 },
  3: { rest: 6, peak: 30 },
} as const
/** Width of the strip; fits the longest magnified tick. */
const STRIP = 54

const spring = { stiffness: 700, damping: 34, mass: 0.35 } as const

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

/** A compact, hover-expandable navigator for long AI conversations. */
function AiConversationTimeline({
  className,
  style,
  items,
  activeId: controlledActiveId,
  defaultActiveId,
  previewSide = "right",
  preview = true,
  onActiveChange,
  onNavigate,
  "aria-label": ariaLabel = "Conversation timeline",
  ...props
}: AiConversationTimelineProps) {
  const reduceMotion = useReducedMotion()
  const [internalActiveId, setInternalActiveId] = React.useState(
    defaultActiveId ?? items[0]?.id
  )
  const [previewId, setPreviewId] = React.useState<string>()
  const [cardHeight, setCardHeight] = React.useState(0)
  const cardRef = React.useRef<HTMLDivElement>(null)
  const stripRef = React.useRef<HTMLOListElement>(null)
  const activeId = controlledActiveId ?? internalActiveId
  const previewIndex = items.findIndex((item) => item.id === previewId)
  const previewItem = previewIndex >= 0 ? items[previewIndex] : undefined

  // Keep the last previewed turn rendered so the card fades out with content.
  const shown = React.useRef({ item: previewItem, index: previewIndex })
  if (previewItem) shown.current = { item: previewItem, index: previewIndex }
  const cardItem = previewItem ?? shown.current.item
  const cardIndex = previewItem ? previewIndex : shown.current.index

  useIsomorphicLayoutEffect(() => {
    setCardHeight(cardRef.current?.offsetHeight ?? 0)
  }, [previewId, cardItem?.description])

  // Pointer offset from the top of the strip; -1 parks every tick at rest.
  const pointer = useMotionValue(-1)
  const stripHeight = items.length * ROW + PAD * 2

  function selectItem(item: AiConversationTimelineItem, index: number) {
    if (controlledActiveId === undefined) setInternalActiveId(item.id)
    onActiveChange?.(item.id)
    onNavigate?.(item, index)
  }

  const cardY = Math.min(
    Math.max(PAD + Math.max(cardIndex, 0) * ROW + ROW / 2, cardHeight / 2),
    Math.max(stripHeight - cardHeight / 2, cardHeight / 2)
  )

  return (
    <nav
      data-slot="ai-conversation-timeline"
      data-preview-side={previewSide}
      aria-label={ariaLabel}
      className={cn("relative isolate", className)}
      style={{ width: STRIP, ...style }}
      onPointerMove={(event) => {
        if (event.pointerType === "touch") return
        const strip = stripRef.current
        if (!strip) return
        // Measure against the list box, so outer padding never skews the peak.
        pointer.set(event.clientY - strip.getBoundingClientRect().top)
      }}
      onPointerLeave={() => {
        pointer.set(-1)
        setPreviewId(undefined)
      }}
      {...props}
    >
      <ol
        ref={stripRef}
        className={cn(
          "flex w-full flex-col",
          previewSide === "right" ? "items-end" : "items-start"
        )}
        style={{ paddingBlock: PAD }}
      >
        {items.map((item, index) => (
          <Tick
            key={item.id}
            item={item}
            index={index}
            active={item.id === activeId}
            anchor={previewSide}
            pointer={pointer}
            stripRef={stripRef}
            reduceMotion={!!reduceMotion}
            onSelect={() => selectItem(item, index)}
            onPreview={(next) => setPreviewId(next ? item.id : undefined)}
            onFocusCenter={(center) => pointer.set(center)}
          />
        ))}
      </ol>

      {preview ? (
        <motion.div
          aria-hidden
          data-slot="ai-conversation-timeline-preview"
          className={cn(
            "pointer-events-none absolute top-0 z-20 w-64",
            previewSide === "right" ? "left-full ml-2" : "right-full mr-2"
          )}
          initial={false}
          animate={{
            y: cardY,
            opacity: previewItem ? 1 : 0,
            x: previewItem ? 0 : previewSide === "right" ? -6 : 6,
          }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  y: { type: "spring", ...spring },
                  default: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
                }
          }
          style={{ visibility: previewItem ? "visible" : "hidden" }}
        >
          <div
            ref={cardRef}
            className="relative -translate-y-1/2 rounded-xl border border-border/60 bg-popover/85 p-3 text-popover-foreground shadow-[0_8px_28px_-14px_rgb(0_0_0/0.5)] backdrop-blur-md supports-[backdrop-filter]:bg-popover/70"
          >
            <span
              className={cn(
                "absolute top-1/2 h-px w-2 bg-border",
                previewSide === "right" ? "right-full" : "left-full"
              )}
            />
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={cardItem?.id ?? "empty"}
                initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.12 }}
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-[5px] bg-muted px-1.5 py-0.5 font-mono text-[10px] leading-4 tabular-nums text-muted-foreground">
                    {String(Math.max(cardIndex, 0) + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[11px] tabular-nums text-muted-foreground/70">
                    / {items.length}
                  </span>
                  {cardItem?.meta ? (
                    <span className="ml-auto text-[11px] tabular-nums text-muted-foreground">
                      {cardItem.meta}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 line-clamp-2 text-[13px] font-medium leading-5">
                  {cardItem?.title}
                </p>
                {cardItem?.description ? (
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                    {cardItem.description}
                  </p>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      ) : null}
    </nav>
  )
}

function Tick({
  item,
  index,
  active,
  anchor,
  pointer,
  stripRef,
  reduceMotion,
  onSelect,
  onPreview,
  onFocusCenter,
}: {
  item: AiConversationTimelineItem
  index: number
  active: boolean
  anchor: "left" | "right"
  pointer: MotionValue<number>
  stripRef: React.RefObject<HTMLOListElement | null>
  reduceMotion: boolean
  onSelect: () => void
  onPreview: (previewing: boolean) => void
  onFocusCenter: (center: number) => void
}) {
  const { rest, peak } = LENGTHS[item.level ?? 1]
  // Start from the intended pitch, then replace it with the rendered center.
  // This keeps pointer and tick positions in the same coordinate system even
  // when surrounding styles alter the actual row layout.
  const tickRef = React.useRef<HTMLButtonElement>(null)
  const center = useMotionValue(PAD + index * ROW + ROW / 2)

  const measureCenter = React.useCallback(() => {
    const strip = stripRef.current
    const tick = tickRef.current
    if (!strip || !tick) return center.get()

    const stripRect = strip.getBoundingClientRect()
    const tickRect = tick.getBoundingClientRect()
    const nextCenter = tickRect.top - stripRect.top + tickRect.height / 2
    center.set(nextCenter)
    return nextCenter
  }, [center, stripRef])

  useIsomorphicLayoutEffect(() => {
    measureCenter()

    const strip = stripRef.current
    const tick = tickRef.current
    if (!strip || !tick || typeof ResizeObserver === "undefined") return

    const observer = new ResizeObserver(measureCenter)
    observer.observe(strip)
    observer.observe(tick)
    return () => observer.disconnect()
  }, [measureCenter, stripRef])

  // Gaussian falloff: the tick under the pointer peaks, neighbours trail off.
  const proximity = useTransform(() => {
    const y = pointer.get()
    const tickCenter = center.get()
    return y < 0 ? 0 : Math.exp(-((y - tickCenter) ** 2) / (2 * SPREAD ** 2))
  })
  const widthTarget = useTransform(proximity, (p) => rest + (peak - rest) * p)
  const opacityTarget = useTransform(proximity, (p) =>
    Math.min(1, (active ? 0.5 : 0.22) + p * 0.78)
  )
  const springWidth = useSpring(widthTarget, spring)
  const springOpacity = useSpring(opacityTarget, spring)

  return (
    <li className="flex w-full" style={{ height: ROW }}>
      <button
        ref={tickRef}
        type="button"
        aria-label={item.title}
        aria-current={active ? "step" : undefined}
        data-slot="ai-conversation-timeline-tick"
        data-active={active || undefined}
        className={cn(
          "group flex w-full items-center outline-none",
          anchor === "right" ? "justify-end" : "justify-start"
        )}
        style={{ height: ROW }}
        onClick={onSelect}
        onPointerEnter={() => onPreview(true)}
        onFocus={() => {
          onPreview(true)
          onFocusCenter(measureCenter())
        }}
        onBlur={() => onPreview(false)}
      >
        <motion.span
          aria-hidden
          className={cn(
            "block h-0.5 rounded-full bg-foreground group-focus-visible:bg-primary group-focus-visible:opacity-100",
            anchor === "right" ? "origin-right" : "origin-left"
          )}
          style={{
            width: reduceMotion ? widthTarget : springWidth,
            opacity: reduceMotion ? opacityTarget : springOpacity,
          }}
        />
      </button>
    </li>
  )
}

export { AiConversationTimeline }
