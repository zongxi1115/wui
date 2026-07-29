"use client"

import * as React from "react"
import { Portal } from "radix-ui"
import { XIcon as CloseIcon } from "lucide-react"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  XIcon,
} from "@animateicons/react/lucide"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

export type MessageVariant =
  | "default"
  | "info"
  | "success"
  | "warning"
  | "destructive"

export type MessagePosition =
  | "top-left"
  | "top"
  | "top-right"
  | "bottom-left"
  | "bottom"
  | "bottom-right"

export interface MessageMotionConfig {
  /** Distance travelled while entering and leaving, in pixels. @default 16 */
  offset: number
  /** Scale at the beginning of the enter animation. @default 0.96 */
  scale: number
  /** Opacity at the beginning of the enter animation. @default 0 */
  initialOpacity: number
  /** Opacity at the end of the exit animation. @default 0 */
  exitOpacity: number
  /** Initial backdrop blur, in pixels. @default 6 */
  blur: number
  /** Enter and layout spring stiffness. @default 420 */
  stiffness: number
  /** Enter and layout spring damping. @default 34 */
  damping: number
  /** Enter and layout spring mass. @default 0.72 */
  mass: number
  /** Exit animation duration, in seconds. @default 0.16 */
  exitDuration: number
}

const defaultMotion: MessageMotionConfig = {
  offset: 16,
  scale: 0.96,
  initialOpacity: 0,
  exitOpacity: 0,
  blur: 6,
  stiffness: 420,
  damping: 34,
  mass: 0.72,
  exitDuration: 0.16,
}

export interface MessageOptions {
  /** Main message content. */
  description: React.ReactNode
  /** Semantic appearance and animated default icon. @default "default" */
  variant?: MessageVariant
  /** Screen position. Uses the provider default when omitted. */
  position?: MessagePosition
  /** Time before dismissal in milliseconds. Set to 0 to persist. */
  duration?: number
  /** Custom leading icon. Pass `false` to hide it. */
  icon?: React.ReactNode | false
  /** Show a close control. @default false */
  closable?: boolean
  /** Override drag-to-dismiss behavior for this message. */
  dragToDismiss?: boolean
  /** Final opacity of the complete message surface. @default 1 */
  opacity?: number
  /** Per-message motion overrides. */
  motion?: Partial<MessageMotionConfig>
  /** Additional class name applied to the floating surface. */
  className?: string
  /** Called after the message has been dismissed. */
  onClose?: () => void
}

export interface MessageProviderProps {
  children: React.ReactNode
  /** Default screen position. @default "top" */
  position?: MessagePosition
  /** Default time before dismissal in milliseconds. @default 3000 */
  duration?: number
  /** Maximum number of visible messages. Older messages are dismissed first. @default 5 */
  maxCount?: number
  /** Distance between the viewport and the window edge, in pixels. @default 20 */
  offset?: number
  /** Space between stacked messages, in pixels. @default 10 */
  gap?: number
  /** Stack messages as overlapping layers instead of a vertical list. @default true */
  stacked?: boolean
  /** Maximum number of visible layers in a stacked queue. @default 3 */
  maxVisibleMessages?: number
  /** Scale reduction applied to each successive stacked layer. @default 0.05 */
  scaleFactor?: number
  /** Expand stacked messages into a list on hover or keyboard focus. @default true */
  expandOnHover?: boolean
  /** Allow messages to be dismissed by dragging horizontally. @default true */
  dragToDismiss?: boolean
  /** Horizontal drag distance required to dismiss, in pixels. @default 72 */
  dragThreshold?: number
  /** Motion defaults shared by all messages. */
  motion?: Partial<MessageMotionConfig>
}

type MessageRecord = MessageOptions & {
  id: string
  position: MessagePosition
}

export interface MessageApi {
  open: (options: MessageOptions) => string
  info: (
    description: React.ReactNode,
    options?: Omit<MessageOptions, "description" | "variant">
  ) => string
  success: (
    description: React.ReactNode,
    options?: Omit<MessageOptions, "description" | "variant">
  ) => string
  warning: (
    description: React.ReactNode,
    options?: Omit<MessageOptions, "description" | "variant">
  ) => string
  error: (
    description: React.ReactNode,
    options?: Omit<MessageOptions, "description" | "variant">
  ) => string
  dismiss: (id: string) => void
  clear: () => void
}

type AnimatedIconHandle = {
  startAnimation: () => void
  stopAnimation: () => void
}

function MessageStatusIcon({ variant }: { variant: MessageVariant }) {
  const ref = React.useRef<AnimatedIconHandle>(null)

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => ref.current?.startAnimation())
    return () => cancelAnimationFrame(frame)
  }, [])

  const props = { ref, size: 18, color: "currentColor" }

  if (variant === "success") return <CircleCheckIcon {...props} />
  if (variant === "warning") return <TriangleAlertIcon {...props} />
  if (variant === "destructive") return <XIcon {...props} />
  return <InfoIcon {...props} />
}

const MessageContext = React.createContext<MessageApi | null>(null)

const messagePositionClasses: Record<MessagePosition, string> = {
  "top-left": "left-0 top-0 items-start",
  top: "left-1/2 top-0 -translate-x-1/2 items-center",
  "top-right": "right-0 top-0 items-end",
  "bottom-left": "bottom-0 left-0 items-start",
  bottom: "bottom-0 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-0 right-0 items-end",
}

const messagePositions = Object.keys(messagePositionClasses) as MessagePosition[]

function getViewportStyle(position: MessagePosition, offset: number, gap: number) {
  return {
    gap,
    ...(position.startsWith("top") ? { top: offset } : { bottom: offset }),
    ...(position.endsWith("left") ? { left: offset } : {}),
    ...(position.endsWith("right") ? { right: offset } : {}),
  }
}

function getMotionOffset(position: MessagePosition, offset: number) {
  if (position === "top-left") return { x: -offset, y: -offset * 0.5 }
  if (position === "top-right") return { x: offset, y: -offset * 0.5 }
  if (position === "bottom-left") return { x: -offset, y: offset * 0.5 }
  if (position === "bottom-right") return { x: offset, y: offset * 0.5 }
  return { y: position === "top" ? -offset : offset }
}

interface MessageItemProps {
  message: MessageRecord
  providerMotion: Partial<MessageMotionConfig>
  dragToDismiss: boolean
  dragThreshold: number
  frontHeight: number
  expanded: boolean
  expandedOffset: number
  hidden: boolean
  stackIndex: number
  stacked: boolean
  stackGap: number
  scaleFactor: number
  onHeightChange: (id: string, height: number) => void
  onHeightRemove: (id: string) => void
  onDismiss: (id: string) => void
}

function MessageItem({
  message,
  providerMotion,
  dragToDismiss,
  dragThreshold,
  frontHeight,
  expanded,
  expandedOffset,
  hidden,
  stackIndex,
  stacked,
  stackGap,
  scaleFactor,
  onHeightChange,
  onHeightRemove,
  onDismiss,
}: MessageItemProps) {
  const itemRef = React.useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const config = {
    ...defaultMotion,
    ...providerMotion,
    ...message.motion,
  }
  const offset = getMotionOffset(message.position, config.offset)
  const opacity = message.opacity ?? 1
  const isFrontmost = !stacked || stackIndex === 0
  const isInteractive = !hidden && (!stacked || expanded || isFrontmost)
  const canDrag = isInteractive && (message.dragToDismiss ?? dragToDismiss)
  const stackDirection = message.position.startsWith("bottom") ? -1 : 1
  const stackY = stacked
    ? expanded
      ? expandedOffset
      : stackDirection * stackIndex * stackGap
    : 0
  const stackScale =
    stacked && !expanded
      ? Math.max(0.7, 1 - stackIndex * scaleFactor)
      : 1
  const enterTransition: Transition = {
    type: "spring",
    stiffness: config.stiffness,
    damping: config.damping,
    mass: config.mass,
  }

  React.useLayoutEffect(() => {
    const element = itemRef.current
    if (!element) return

    const updateHeight = () => onHeightChange(message.id, element.offsetHeight)
    updateHeight()

    const observer = new ResizeObserver(updateHeight)
    observer.observe(element)

    return () => {
      observer.disconnect()
      onHeightRemove(message.id)
    }
  }, [message.id, onHeightChange, onHeightRemove])

  return (
    <motion.div
      ref={itemRef}
      layout="position"
      data-slot="message"
      data-variant={message.variant ?? "default"}
      data-frontmost={isFrontmost || undefined}
      data-hidden={hidden || undefined}
      data-index={stackIndex}
      aria-hidden={hidden || undefined}
      role={
        message.variant === "warning" || message.variant === "destructive"
          ? "alert"
          : "status"
      }
      className={cn(
        "pointer-events-auto flex min-h-10 max-w-full items-center gap-2.5 rounded-md border border-border/80 bg-popover px-3.5 py-2.5 text-sm text-popover-foreground shadow-md",
        stacked && "absolute inset-x-0",
        stacked && message.position.startsWith("top") && "top-0",
        stacked && message.position.startsWith("bottom") && "bottom-0",
        stacked && !expanded && !isFrontmost &&
          "pointer-events-none overflow-hidden",
        hidden && "pointer-events-none",
        canDrag && "cursor-grab active:cursor-grabbing",
        message.className
      )}
      style={{
        zIndex: stacked ? 100 - stackIndex : undefined,
        height:
          stacked && !expanded && !isFrontmost ? frontHeight : undefined,
      }}
      drag={canDrag ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      whileDrag={reduceMotion ? undefined : { scale: 0.985 }}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) >= dragThreshold) onDismiss(message.id)
      }}
      initial={
        reduceMotion
          ? { opacity }
          : {
              opacity: config.initialOpacity,
              scale: config.scale,
              filter: `blur(${config.blur}px)`,
              ...offset,
            }
      }
      animate={{
        opacity: hidden ? 0 : opacity,
        scale: stackScale,
        filter: "blur(0px)",
        x: 0,
        y: stackY,
      }}
      exit={
        reduceMotion
          ? { opacity: 0 }
          : {
              opacity: config.exitOpacity,
              scale: Math.min(0.985, (config.scale + 1) / 2),
              filter: `blur(${config.blur * 0.5}px)`,
              transition: {
                duration: config.exitDuration,
                ease: [0.4, 0, 1, 1],
              },
              ...offset,
            }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              ...enterTransition,
              layout: enterTransition,
              opacity: { duration: 0.2, ease: "easeOut" },
              filter: { duration: 0.2, ease: "easeOut" },
            }
      }
    >
      {message.icon !== false ? (
        <span
          data-slot="message-icon"
          className={cn(
            "flex size-5 shrink-0 items-center justify-center text-muted-foreground [&>div]:flex [&>div]:items-center",
            message.variant === "info" && "text-info",
            message.variant === "success" && "text-success",
            message.variant === "warning" && "text-warning",
            message.variant === "destructive" && "text-destructive"
          )}
        >
          {message.icon ?? (
            <MessageStatusIcon variant={message.variant ?? "default"} />
          )}
        </span>
      ) : null}

      <span data-slot="message-content" className="min-w-0 flex-1 leading-5">
        {message.description}
      </span>

      {message.closable ? (
        <button
          type="button"
          data-slot="message-close"
          aria-label="Close message"
          tabIndex={isInteractive ? undefined : -1}
          className="-mr-1 flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/30 [&_svg]:size-3.5"
          onClick={() => onDismiss(message.id)}
        >
          <CloseIcon />
        </button>
      ) : null}
    </motion.div>
  )
}

/** Provides portal-based transient messages and the imperative `useMessage` API. */
function MessageProvider({
  children,
  position: defaultPosition = "top",
  duration: defaultDuration = 3000,
  maxCount = 5,
  offset = 20,
  gap = 10,
  stacked = true,
  maxVisibleMessages = 3,
  scaleFactor = 0.05,
  expandOnHover = true,
  dragToDismiss = true,
  dragThreshold = 72,
  motion: providerMotion = {},
}: MessageProviderProps) {
  const reduceMotion = useReducedMotion()
  const [messages, setMessages] = React.useState<MessageRecord[]>([])
  const [messageHeights, setMessageHeights] = React.useState<
    Record<string, number>
  >({})
  const [expandedPositions, setExpandedPositions] = React.useState<
    Set<MessagePosition>
  >(() => new Set())
  const sequence = React.useRef(0)
  const timers = React.useRef(new Map<string, ReturnType<typeof setTimeout>>())

  const handleHeightChange = React.useCallback((id: string, height: number) => {
    setMessageHeights((current) =>
      current[id] === height ? current : { ...current, [id]: height }
    )
  }, [])

  const handleHeightRemove = React.useCallback((id: string) => {
    setMessageHeights((current) => {
      if (!(id in current)) return current
      const next = { ...current }
      delete next[id]
      return next
    })
  }, [])

  const dismiss = React.useCallback((id: string) => {
    const timer = timers.current.get(id)
    if (timer) clearTimeout(timer)
    timers.current.delete(id)
    setMessages((current) => {
      const target = current.find((message) => message.id === id)
      target?.onClose?.()
      return current.filter((message) => message.id !== id)
    })
  }, [])

  const open = React.useCallback(
    (options: MessageOptions) => {
      const id = `message-${sequence.current++}`
      const messageDuration = options.duration ?? defaultDuration

      setMessages((current) => {
        const next = [
          ...current,
          {
            ...options,
            id,
            position: options.position ?? defaultPosition,
          },
        ]
        const overflow = Math.max(0, next.length - maxCount)
        next.slice(0, overflow).forEach((message) => {
          const timer = timers.current.get(message.id)
          if (timer) clearTimeout(timer)
          timers.current.delete(message.id)
          message.onClose?.()
        })
        return overflow ? next.slice(overflow) : next
      })

      if (messageDuration > 0) {
        timers.current.set(id, setTimeout(() => dismiss(id), messageDuration))
      }
      return id
    },
    [defaultDuration, defaultPosition, dismiss, maxCount]
  )

  const clear = React.useCallback(() => {
    timers.current.forEach((timer) => clearTimeout(timer))
    timers.current.clear()
    setMessages((current) => {
      current.forEach((message) => message.onClose?.())
      return []
    })
  }, [])

  React.useEffect(
    () => () => {
      timers.current.forEach((timer) => clearTimeout(timer))
      timers.current.clear()
    },
    []
  )

  const api = React.useMemo<MessageApi>(
    () => ({
      open,
      info: (description, options) =>
        open({ ...options, description, variant: "info" }),
      success: (description, options) =>
        open({ ...options, description, variant: "success" }),
      warning: (description, options) =>
        open({ ...options, description, variant: "warning" }),
      error: (description, options) =>
        open({ ...options, description, variant: "destructive" }),
      dismiss,
      clear,
    }),
    [clear, dismiss, open]
  )

  return (
    <MessageContext.Provider value={api}>
      {children}
      <Portal.Root>
        {messagePositions.map((position) => {
          const positionedMessages = messages.filter(
            (message) => message.position === position
          )
          const renderedMessages = stacked
            ? [...positionedMessages].reverse()
            : positionedMessages
          const frontMessage = renderedMessages[0]
          const frontHeight = frontMessage
            ? (messageHeights[frontMessage.id] ?? 40)
            : 0
          const visibleLayerCount = Math.min(
            renderedMessages.length,
            Math.max(1, maxVisibleMessages)
          )
          const isExpanded =
            stacked && expandOnHover && expandedPositions.has(position)
          const visibleMessages = renderedMessages.slice(0, visibleLayerCount)
          const expandedHeight = visibleMessages.reduce(
            (total, message) =>
              total + (messageHeights[message.id] ?? frontHeight),
            Math.max(0, visibleLayerCount - 1) * gap
          )

          function setPositionExpanded(expanded: boolean) {
            if (!stacked || !expandOnHover) return
            setExpandedPositions((current) => {
              const next = new Set(current)
              if (expanded) next.add(position)
              else next.delete(position)
              return next
            })
          }

          return (
            <div
              key={position}
              data-slot="message-viewport"
              data-position={position}
              className={cn(
                "pointer-events-none fixed z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col",
                stacked && "pointer-events-auto",
                !stacked && position.startsWith("bottom") && "flex-col-reverse",
                messagePositionClasses[position]
              )}
              style={{
                ...getViewportStyle(position, offset, stacked ? 0 : gap),
                height: stacked
                  ? isExpanded
                    ? expandedHeight
                    : frontHeight + Math.max(0, visibleLayerCount - 1) * gap
                  : undefined,
                transition: reduceMotion
                  ? "none"
                  : "height 240ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              onPointerEnter={() => setPositionExpanded(true)}
              onPointerLeave={() => setPositionExpanded(false)}
              onFocusCapture={() => setPositionExpanded(true)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setPositionExpanded(false)
                }
              }}
            >
              <AnimatePresence initial={false}>
                {renderedMessages.map((message, index) => {
                  const precedingHeight = renderedMessages
                    .slice(0, index)
                    .reduce(
                      (total, item) =>
                        total + (messageHeights[item.id] ?? frontHeight),
                      0
                    )
                  const direction = position.startsWith("bottom") ? -1 : 1
                  const expandedOffset =
                    direction * (precedingHeight + index * gap)

                  return (
                    <MessageItem
                      key={message.id}
                      message={message}
                      providerMotion={providerMotion}
                      dragToDismiss={dragToDismiss}
                      dragThreshold={dragThreshold}
                      frontHeight={frontHeight}
                      expanded={isExpanded}
                      expandedOffset={expandedOffset}
                      hidden={stacked && index >= maxVisibleMessages}
                      stackIndex={index}
                      stacked={stacked}
                      stackGap={gap}
                      scaleFactor={scaleFactor}
                      onHeightChange={handleHeightChange}
                      onHeightRemove={handleHeightRemove}
                      onDismiss={dismiss}
                    />
                  )
                })}
              </AnimatePresence>
            </div>
          )
        })}
      </Portal.Root>
    </MessageContext.Provider>
  )
}

/** Returns the global message API from the nearest `MessageProvider`. */
function useMessage() {
  const context = React.useContext(MessageContext)
  if (!context) {
    throw new Error("useMessage must be used inside <MessageProvider>.")
  }
  return context
}

export { MessageProvider, useMessage }
