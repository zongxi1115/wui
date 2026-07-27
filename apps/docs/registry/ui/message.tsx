"use client"

import * as React from "react"
import { Portal } from "radix-ui"
import {
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

export type MessageVariant = "default" | "info" | "success" | "warning" | "destructive"

export type MessagePosition =
  | "top-left"
  | "top"
  | "top-right"
  | "bottom-left"
  | "bottom"
  | "bottom-right"

const messageVariants = cva(
  "relative flex w-full items-start gap-3 rounded-md border px-4 py-3 text-sm shadow-xs",
  {
    variants: {
      variant: {
        default: "border-border bg-background text-foreground",
        info: "border-info/30 bg-background text-foreground",
        success: "border-success/30 bg-background text-foreground",
        warning: "border-warning/30 bg-background text-foreground",
        destructive: "border-destructive/30 bg-background text-foreground",
      },
      size: {
        default: "min-h-12",
        compact: "min-h-10 px-3 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const defaultIcons = {
  default: InfoIcon,
  info: InfoIcon,
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
  destructive: CircleXIcon,
} as const

export interface MessageProps
  extends Omit<HTMLMotionProps<"div">, "children" | "title"> {
  /** Semantic appearance and default icon. @default "default" */
  variant?: MessageVariant
  /** Density preset. @default "default" */
  size?: "default" | "compact"
  /** Direction used by the enter and exit motion. @default "top" */
  position?: MessagePosition
  /** Optional heading displayed above the message body. */
  title?: React.ReactNode
  /** Message body. */
  children?: React.ReactNode
  /** Custom leading icon. Pass `false` to hide the icon. */
  icon?: React.ReactNode | false
  /** Optional action rendered at the end of the message. */
  action?: React.ReactNode
  /** Show a close control. @default false */
  closable?: boolean
  /** Controlled visibility. */
  visible?: boolean
  /** Initial visibility in uncontrolled mode. @default true */
  defaultVisible?: boolean
  /** Called whenever visibility changes. */
  onVisibleChange?: (visible: boolean) => void
  /** Called after the exit animation completes. */
  onExitComplete?: () => void
}

/** A lightweight status message with optional action and dismissal. */
function Message({
  className,
  variant = "default",
  size = "default",
  position = "top",
  title,
  children,
  icon,
  action,
  closable = false,
  visible,
  defaultVisible = true,
  onVisibleChange,
  onExitComplete,
  role,
  ...props
}: MessageProps) {
  const reduceMotion = useReducedMotion()
  const [internalVisible, setInternalVisible] = React.useState(defaultVisible)
  const isVisible = visible ?? internalVisible
  const DefaultIcon = defaultIcons[variant]
  const motionOffset = messageMotionOffsets[position]

  function setVisible(next: boolean) {
    if (visible === undefined) setInternalVisible(next)
    onVisibleChange?.(next)
  }

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {isVisible ? (
        <motion.div
          data-slot="message"
          data-variant={variant}
          data-size={size}
          data-position={position}
          role={role ?? (variant === "warning" || variant === "destructive" ? "alert" : "status")}
          className={cn(messageVariants({ variant, size }), className)}
          layout="position"
          initial={reduceMotion ? false : { opacity: 0, ...motionOffset }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, ...motionOffset }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 500, damping: 36, mass: 0.65 }
          }
          {...props}
        >
          {icon !== false ? (
            <span
              data-slot="message-icon"
              className={cn(
                "mt-0.5 flex shrink-0 text-muted-foreground [&_svg]:size-4",
                variant === "destructive" && "text-destructive",
                variant === "info" && "text-info",
                variant === "success" && "text-success",
                variant === "warning" && "text-warning"
              )}
            >
              {icon ?? <DefaultIcon />}
            </span>
          ) : null}

          <span data-slot="message-content" className="min-w-0 flex-1">
            {title ? (
              <span data-slot="message-title" className="block font-medium leading-5">
                {title}
              </span>
            ) : null}
            {children ? (
              <span
                data-slot="message-description"
                className={cn(
                  "block leading-5 text-muted-foreground",
                  title && "mt-0.5"
                )}
              >
                {children}
              </span>
            ) : null}
          </span>

          {action ? (
            <span data-slot="message-action" className="ml-2 flex shrink-0 items-center">
              {action}
            </span>
          ) : null}

          {closable ? (
            <button
              type="button"
              data-slot="message-close"
              aria-label="Close message"
              className="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/30 [&_svg]:size-4"
              onClick={() => setVisible(false)}
            >
              <XIcon />
            </button>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

const messageMotionOffsets: Record<MessagePosition, { x?: number; y?: number }> = {
  "top-left": { x: -14, y: -8 },
  top: { y: -14 },
  "top-right": { x: 14, y: -8 },
  "bottom-left": { x: -14, y: 8 },
  bottom: { y: 14 },
  "bottom-right": { x: 14, y: 8 },
}

export interface MessageOptions {
  /** Optional heading. */
  title?: React.ReactNode
  /** Main message text. */
  description: React.ReactNode
  /** Semantic appearance. @default "default" */
  variant?: MessageVariant
  /** Screen position. Uses the provider default when omitted. */
  position?: MessagePosition
  /** Time before dismissal in milliseconds. Set to 0 to persist. */
  duration?: number
  /** Custom leading icon. Pass `false` to hide it. */
  icon?: React.ReactNode | false
  /** Optional trailing action. */
  action?: React.ReactNode
  /** Show the close control. @default true */
  closable?: boolean
}

export interface MessageProviderProps {
  children: React.ReactNode
  /** Default screen position. @default "top" */
  position?: MessagePosition
  /** Default time before dismissal in milliseconds. @default 3000 */
  duration?: number
}

type MessageRecord = MessageOptions & {
  id: string
  visible: boolean
  position: MessagePosition
}

export interface MessageApi {
  open: (options: MessageOptions) => string
  info: (description: React.ReactNode, options?: Omit<MessageOptions, "description" | "variant">) => string
  success: (description: React.ReactNode, options?: Omit<MessageOptions, "description" | "variant">) => string
  warning: (description: React.ReactNode, options?: Omit<MessageOptions, "description" | "variant">) => string
  error: (description: React.ReactNode, options?: Omit<MessageOptions, "description" | "variant">) => string
  dismiss: (id: string) => void
  clear: () => void
}

const MessageContext = React.createContext<MessageApi | null>(null)

const messagePositionClasses: Record<MessagePosition, string> = {
  "top-left": "left-4 top-4 items-start",
  top: "left-1/2 top-4 -translate-x-1/2 items-center",
  "top-right": "right-4 top-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  bottom: "bottom-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-4 right-4 items-end",
}

const messagePositions = Object.keys(messagePositionClasses) as MessagePosition[]

/** Provides portal-based messages and the imperative `useMessage` API. */
function MessageProvider({
  children,
  position: defaultPosition = "top",
  duration: defaultDuration = 3000,
}: MessageProviderProps) {
  const [messages, setMessages] = React.useState<MessageRecord[]>([])
  const sequence = React.useRef(0)
  const timers = React.useRef(new Map<string, ReturnType<typeof setTimeout>>())

  const dismiss = React.useCallback((id: string) => {
    const timer = timers.current.get(id)
    if (timer) clearTimeout(timer)
    timers.current.delete(id)
    setMessages((current) =>
      current.map((message) =>
        message.id === id ? { ...message, visible: false } : message
      )
    )
  }, [])

  const open = React.useCallback(
    (options: MessageOptions) => {
      const id = `message-${sequence.current++}`
      const messageDuration = options.duration ?? defaultDuration
      setMessages((current) => [
        ...current,
        {
          ...options,
          id,
          visible: true,
          position: options.position ?? defaultPosition,
        },
      ])
      if (messageDuration > 0) {
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), messageDuration)
        )
      }
      return id
    },
    [defaultDuration, defaultPosition, dismiss]
  )

  const clear = React.useCallback(() => {
    timers.current.forEach((timer) => clearTimeout(timer))
    timers.current.clear()
    setMessages((current) =>
      current.map((message) => ({ ...message, visible: false }))
    )
  }, [])

  const remove = React.useCallback((id: string) => {
    setMessages((current) => current.filter((message) => message.id !== id))
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
          if (positionedMessages.length === 0) return null

          return (
            <div
              key={position}
              data-slot="message-viewport"
              data-position={position}
              className={cn(
                "pointer-events-none fixed z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2",
                position.startsWith("bottom") && "flex-col-reverse",
                messagePositionClasses[position]
              )}
            >
              {positionedMessages.map((message) => (
                <Message
                  key={message.id}
                  visible={message.visible}
                  variant={message.variant}
                  position={message.position}
                  title={message.title}
                  icon={message.icon}
                  action={message.action}
                  closable={message.closable ?? true}
                  className="pointer-events-auto shadow-md"
                  onVisibleChange={(visible) => {
                    if (!visible) dismiss(message.id)
                  }}
                  onExitComplete={() => remove(message.id)}
                >
                  {message.description}
                </Message>
              ))}
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

export { Message, MessageProvider, messageVariants, useMessage }
