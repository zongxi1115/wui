"use client"

import * as React from "react"
import { Portal } from "radix-ui"
import { XIcon as CloseIcon, LoaderCircleIcon } from "lucide-react"
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
  "default" | "info" | "success" | "warning" | "destructive" | "loading"

export type MessagePosition =
  "top-left" | "top" | "top-right" | "bottom-left" | "bottom" | "bottom-right"

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
  /** Optional title displayed above the message content. */
  title?: React.ReactNode
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
  /** Stack messages as overlapping layers instead of a vertical list. @default false */
  stacked?: boolean
  /** Maximum number of visible layers in a stacked queue. @default 3 */
  maxVisibleMessages?: number
  /** Scale reduction applied to each successive stacked layer. @default 0.05 */
  scaleFactor?: number
  /** Expand stacked messages into a list on hover or keyboard focus. @default true */
  expandOnHover?: boolean
  /** Allow messages to be dismissed by dragging horizontally. @default true */
  dragToDismiss?: boolean
  /** Pause auto-dismiss timers while the pointer rests on a message group. @default true */
  pauseOnHover?: boolean
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
  /** Show a persistent message with a spinner; pair it with `update` to resolve it in place. */
  loading: (
    description: React.ReactNode,
    options?: Omit<MessageOptions, "description" | "variant">
  ) => string
  /**
   * Morph an existing message in place (e.g. loading → success). Passing
   * `duration` restarts its auto-dismiss timer; turning a loading message into
   * another variant without a duration uses the provider default.
   */
  update: (id: string, options: Partial<MessageOptions>) => void
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

  const props = { ref, size: 20, color: "currentColor" }

  if (variant === "success") return <CircleCheckIcon {...props} />
  if (variant === "warning") return <TriangleAlertIcon {...props} />
  if (variant === "destructive") return <XIcon {...props} />
  if (variant === "loading")
    return <LoaderCircleIcon className="size-[18px] animate-spin" />
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

const messagePositions = Object.keys(
  messagePositionClasses
) as MessagePosition[]

function getViewportStyle(
  position: MessagePosition,
  offset: number,
  gap: number
) {
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
  // Set when the message is flung away so it leaves in the drag direction.
  const [swipeDirection, setSwipeDirection] = React.useState(0)
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
    stacked && !expanded ? Math.max(0.7, 1 - stackIndex * scaleFactor) : 1
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
        "text-popover-foreground pointer-events-auto flex min-h-12 max-w-full items-start gap-3 rounded-md border px-4 py-3 text-sm shadow-md",
        (message.variant === undefined ||
          message.variant === "default" ||
          message.variant === "loading") &&
          "border-border bg-popover",
        message.variant === "info" && "border-info-border bg-info-subtle",
        message.variant === "success" &&
          "border-success-border bg-success-subtle",
        message.variant === "warning" &&
          "border-warning-border bg-warning-subtle",
        message.variant === "destructive" &&
          "border-destructive-border bg-destructive-subtle",
        stacked && "absolute inset-x-0",
        stacked && message.position.startsWith("top") && "top-0",
        stacked && message.position.startsWith("bottom") && "bottom-0",
        stacked &&
          !expanded &&
          !isFrontmost &&
          "pointer-events-none overflow-hidden",
        hidden && "pointer-events-none",
        canDrag && "cursor-grab active:cursor-grabbing",
        message.className
      )}
      style={{
        zIndex: stacked ? 100 - stackIndex : undefined,
        height: stacked && !expanded && !isFrontmost ? frontHeight : undefined,
      }}
      drag={canDrag ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      whileDrag={reduceMotion ? undefined : { scale: 0.985 }}
      onDragEnd={(_, info) => {
        if (
          Math.abs(info.offset.x) >= dragThreshold ||
          Math.abs(info.velocity.x) > 800
        ) {
          setSwipeDirection(Math.sign(info.offset.x) || 1)
          onDismiss(message.id)
        }
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
          : swipeDirection
            ? {
                x: swipeDirection * 420,
                opacity: 0,
                transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
              }
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
            "text-muted-foreground flex size-5 shrink-0 items-center justify-center [&>div]:flex [&>div]:items-center",
            message.variant === "info" && "text-info",
            message.variant === "success" && "text-success",
            message.variant === "warning" && "text-warning",
            message.variant === "destructive" && "text-destructive"
          )}
        >
          {message.icon ?? (
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={message.variant ?? "default"}
                className="flex items-center justify-center"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
                transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
              >
                <MessageStatusIcon variant={message.variant ?? "default"} />
              </motion.span>
            </AnimatePresence>
          )}
        </span>
      ) : null}

      <div data-slot="message-content" className="min-w-0 flex-1 leading-5">
        {message.title ? (
          <div
            data-slot="message-title"
            className={cn(
              "font-semibold",
              message.variant === "info" && "text-info",
              message.variant === "success" && "text-success",
              message.variant === "warning" && "text-warning",
              message.variant === "destructive" && "text-destructive"
            )}
          >
            {message.title}
          </div>
        ) : null}
        <div className={cn(message.title && "text-muted-foreground mt-0.5 text-xs")}>
          {message.description}
        </div>
      </div>

      {message.closable ? (
        <button
          type="button"
          data-slot="message-close"
          aria-label="关闭消息"
          tabIndex={isInteractive ? undefined : -1}
          className={cn(
            "text-muted-foreground hover:bg-background hover:text-foreground focus-visible:ring-ring/30 -mr-1 flex size-6 shrink-0 items-center justify-center rounded-sm outline-none transition-colors focus-visible:ring-[3px] [&_svg]:size-3.5",
            message.variant === "info" && "text-info hover:text-info",
            message.variant === "success" && "text-success hover:text-success",
            message.variant === "warning" && "text-warning hover:text-warning",
            message.variant === "destructive" &&
              "text-destructive hover:text-destructive"
          )}
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
  stacked = false,
  maxVisibleMessages = 3,
  scaleFactor = 0.05,
  expandOnHover = true,
  dragToDismiss = true,
  dragThreshold = 72,
  pauseOnHover = true,
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
  // The ref mirrors `messages` synchronously so callbacks (onClose, timers)
  // run outside state updaters and see the latest queue.
  const messagesRef = React.useRef<MessageRecord[]>([])
  const timers = React.useRef(
    new Map<
      string,
      { handle?: ReturnType<typeof setTimeout>; remaining: number; startedAt: number }
    >()
  )
  const pausedPositions = React.useRef(new Set<MessagePosition>())

  const commit = React.useCallback((next: MessageRecord[]) => {
    messagesRef.current = next
    setMessages(next)
  }, [])

  const clearTimer = React.useCallback((id: string) => {
    const timer = timers.current.get(id)
    if (timer?.handle) clearTimeout(timer.handle)
    timers.current.delete(id)
  }, [])

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

  const dismiss = React.useCallback(
    (id: string) => {
      clearTimer(id)
      const target = messagesRef.current.find((message) => message.id === id)
      if (!target) return
      commit(messagesRef.current.filter((message) => message.id !== id))
      target.onClose?.()
    },
    [clearTimer, commit]
  )

  const startTimer = React.useCallback(
    (id: string, position: MessagePosition, duration: number) => {
      clearTimer(id)
      if (duration <= 0) return
      const paused = pauseOnHover && pausedPositions.current.has(position)
      timers.current.set(id, {
        remaining: duration,
        startedAt: Date.now(),
        handle: paused ? undefined : setTimeout(() => dismiss(id), duration),
      })
    },
    [clearTimer, dismiss, pauseOnHover]
  )

  const setPositionPaused = React.useCallback(
    (position: MessagePosition, paused: boolean) => {
      if (!pauseOnHover) return
      if (paused === pausedPositions.current.has(position)) return
      if (paused) pausedPositions.current.add(position)
      else pausedPositions.current.delete(position)

      const now = Date.now()
      messagesRef.current
        .filter((message) => message.position === position)
        .forEach((message) => {
          const timer = timers.current.get(message.id)
          if (!timer) return
          if (paused && timer.handle) {
            clearTimeout(timer.handle)
            timer.handle = undefined
            timer.remaining = Math.max(0, timer.remaining - (now - timer.startedAt))
          } else if (!paused && !timer.handle) {
            timer.startedAt = now
            timer.handle = setTimeout(() => dismiss(message.id), timer.remaining)
          }
        })
    },
    [dismiss, pauseOnHover]
  )

  const open = React.useCallback(
    (options: MessageOptions) => {
      const id = `message-${sequence.current++}`
      const position = options.position ?? defaultPosition
      const messageDuration =
        options.duration ??
        (options.variant === "loading" ? 0 : defaultDuration)

      const next = [...messagesRef.current, { ...options, id, position }]
      const overflow = Math.max(0, next.length - maxCount)
      const evicted = next.slice(0, overflow)
      evicted.forEach((message) => clearTimer(message.id))
      commit(overflow ? next.slice(overflow) : next)
      evicted.forEach((message) => message.onClose?.())

      startTimer(id, position, messageDuration)
      return id
    },
    [clearTimer, commit, defaultDuration, defaultPosition, maxCount, startTimer]
  )

  const update = React.useCallback(
    (id: string, options: Partial<MessageOptions>) => {
      const target = messagesRef.current.find((message) => message.id === id)
      if (!target) return
      const { position: _ignored, ...rest } = options
      const updated: MessageRecord = { ...target, ...rest }
      commit(
        messagesRef.current.map((message) =>
          message.id === id ? updated : message
        )
      )
      const leavesLoading =
        target.variant === "loading" && updated.variant !== "loading"
      if (options.duration !== undefined || leavesLoading) {
        startTimer(
          id,
          target.position,
          options.duration ??
            (updated.variant === "loading" ? 0 : defaultDuration)
        )
      }
    },
    [commit, defaultDuration, startTimer]
  )

  const clear = React.useCallback(() => {
    const current = messagesRef.current
    current.forEach((message) => clearTimer(message.id))
    commit([])
    current.forEach((message) => message.onClose?.())
  }, [clearTimer, commit])

  React.useEffect(
    () => () => {
      timers.current.forEach((timer) => {
        if (timer.handle) clearTimeout(timer.handle)
      })
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
      loading: (description, options) =>
        open({ ...options, description, variant: "loading" }),
      update,
      dismiss,
      clear,
    }),
    [clear, dismiss, open, update]
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
            ? (messageHeights[frontMessage.id] ?? 48)
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
                "pointer-events-none fixed z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col",
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
              onPointerEnter={() => {
                setPositionExpanded(true)
                setPositionPaused(position, true)
              }}
              onPointerLeave={() => {
                setPositionExpanded(false)
                setPositionPaused(position, false)
              }}
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
