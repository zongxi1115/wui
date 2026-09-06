"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import {
  ArrowDownIcon,
  BotIcon,
  UserIcon,
} from "lucide-react"

import { cn } from "@/registry/lib/utils"
import {
  AiPrompt,
  AiPromptFooter,
  AiPromptSubmit,
  AiPromptTextarea,
  AiPromptTools,
} from "@/registry/ui/ai-prompt"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Button } from "@/registry/ui/button"

type AiChatRole = "user" | "assistant" | "system"
type AiChatStatus = "idle" | "submitted" | "streaming" | "error"

const AiChatContext = React.createContext<{
  atBottom: boolean
  setAtBottom: React.Dispatch<React.SetStateAction<boolean>>
  viewportRef: React.RefObject<HTMLDivElement | null>
  scrollToBottom: (behavior?: ScrollBehavior) => void
} | null>(null)

const aiChatMessageVariants = cva("flex w-full gap-3", {
  variants: {
    role: {
      user: "justify-end",
      assistant: "justify-start",
      system: "justify-center",
    },
  },
  defaultVariants: { role: "assistant" },
})

const aiChatMessageContentVariants = cva(
  "min-w-0 text-sm leading-6",
  {
    variants: {
      role: {
        user:
          "max-w-[82%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-primary-foreground",
        assistant: "max-w-[88%] py-1 text-foreground",
        system:
          "max-w-[88%] rounded-md border bg-muted/40 px-3 py-2 text-center text-xs text-muted-foreground",
      },
    },
    defaultVariants: { role: "assistant" },
  }
)

function useAiChat() {
  const context = React.useContext(AiChatContext)
  if (!context) throw new Error("AI chat parts must be used inside <AiChat />")
  return context
}

export interface AiChatProps extends React.ComponentProps<"section"> {}

/** A composable shell for AI messages, scrolling, and a prompt composer. */
function AiChat({ className, ...props }: AiChatProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const [atBottom, setAtBottom] = React.useState(true)

  const scrollToBottom = React.useCallback((behavior: ScrollBehavior = "smooth") => {
    viewportRef.current?.scrollTo({
      top: viewportRef.current.scrollHeight,
      behavior,
    })
  }, [])

  return (
    <AiChatContext.Provider
      value={{ atBottom, setAtBottom, viewportRef, scrollToBottom }}
    >
      <section
        data-slot="ai-chat"
        className={cn(
          "relative flex min-h-0 w-full flex-col overflow-hidden rounded-lg border bg-background",
          className
        )}
        {...props}
      />
    </AiChatContext.Provider>
  )
}

export interface AiChatMessagesProps extends React.ComponentProps<"div"> {
  /** Keep the newest content in view while the user is already at the bottom. @default true */
  followOutput?: boolean
}

function AiChatMessages({
  className,
  followOutput = true,
  children,
  onScroll,
  ref,
  ...props
}: AiChatMessagesProps) {
  const { viewportRef, atBottom, setAtBottom, scrollToBottom } = useAiChat()

  React.useImperativeHandle(ref, () => viewportRef.current as HTMLDivElement)

  React.useEffect(() => {
    if (followOutput && atBottom) scrollToBottom("auto")
  }, [children, followOutput, atBottom, scrollToBottom])

  return (
    <div
      ref={viewportRef}
      data-slot="ai-chat-messages"
      className={cn(
        "min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5",
        className
      )}
      onScroll={(event) => {
        const element = event.currentTarget
        setAtBottom(
          element.scrollHeight - element.scrollTop - element.clientHeight < 24
        )
        onScroll?.(event)
      }}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        {children}
      </div>
    </div>
  )
}

function AiChatEmptyState({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-chat-empty-state"
      className={cn(
        "mx-auto flex min-h-64 max-w-sm flex-col items-center justify-center px-6 text-center",
        className
      )}
      {...props}
    />
  )
}

export interface AiChatMessageProps extends React.ComponentProps<"article"> {
  /** Sender role, used for alignment and tone. @default "assistant" */
  role?: AiChatRole
}

function AiChatMessage({
  className,
  role = "assistant",
  ...props
}: AiChatMessageProps) {
  return (
    <article
      data-slot="ai-chat-message"
      data-role={role}
      className={cn(aiChatMessageVariants({ role }), className)}
      {...props}
    />
  )
}

export interface AiChatAvatarProps extends React.ComponentProps<"span"> {
  /** Avatar role. @default "assistant" */
  role?: Exclude<AiChatRole, "system">
}

function AiChatAvatar({
  className,
  role = "assistant",
  children,
  ...props
}: AiChatAvatarProps) {
  const Icon = role === "user" ? UserIcon : BotIcon
  return (
    <Avatar
      data-slot="ai-chat-avatar"
      data-role={role}
      size="sm"
      className={cn(
        "mt-0.5 size-7 border",
        role === "user" && "order-2",
        className
      )}
      {...props}
    >
      <AvatarFallback>
        {children ?? <Icon className="size-3.5" />}
      </AvatarFallback>
    </Avatar>
  )
}

export interface AiChatMessageContentProps
  extends React.ComponentProps<"div"> {
  /** Sender role, used for bubble styling. @default "assistant" */
  role?: AiChatRole
}

function AiChatMessageContent({
  className,
  role = "assistant",
  ...props
}: AiChatMessageContentProps) {
  return (
    <div
      data-slot="ai-chat-message-content"
      data-role={role}
      className={cn(aiChatMessageContentVariants({ role }), className)}
      {...props}
    />
  )
}

function AiChatMessageActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-chat-message-actions"
      className={cn(
        "flex items-center gap-0.5 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function AiChatScrollButton({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { atBottom, scrollToBottom } = useAiChat()
  if (atBottom) return null

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="滚动到最新消息"
      data-slot="ai-chat-scroll-button"
      className={cn(
        "absolute bottom-24 left-1/2 z-10 size-8 -translate-x-1/2 rounded-full bg-background",
        className
      )}
      onClick={(event) => {
        scrollToBottom()
        onClick?.(event)
      }}
      {...props}
    >
      <ArrowDownIcon />
    </Button>
  )
}

function AiChatPrompt({
  className,
  ...props
}: React.ComponentProps<typeof AiPrompt>) {
  return (
    <AiPrompt
      data-slot="ai-chat-prompt"
      className={cn(
        "rounded-none border-x-0 border-b-0 bg-background p-2 focus-within:ring-0",
        className
      )}
      {...props}
    />
  )
}

function AiChatTextarea({
  className,
  ...props
}: React.ComponentProps<typeof AiPromptTextarea>) {
  return (
    <AiPromptTextarea
      data-slot="ai-chat-textarea"
      rows={1}
      className={cn(
        "min-h-10 min-w-0 flex-1 px-2 py-2",
        className
      )}
      {...props}
    />
  )
}

function AiChatPromptFooter({
  className,
  ...props
}: React.ComponentProps<typeof AiPromptFooter>) {
  return (
    <AiPromptFooter
      data-slot="ai-chat-prompt-footer"
      className={cn("px-0 py-0", className)}
      {...props}
    />
  )
}

function AiChatPromptTools({
  className,
  ...props
}: React.ComponentProps<typeof AiPromptTools>) {
  return (
    <AiPromptTools
      data-slot="ai-chat-prompt-tools"
      className={className}
      {...props}
    />
  )
}

export interface AiChatSubmitProps
  extends React.ComponentProps<typeof AiPromptSubmit> {
  /** Current generation state. @default "idle" */
  status?: AiChatStatus
}

function AiChatSubmit({
  className,
  status = "idle",
  children,
  ...props
}: AiChatSubmitProps) {
  return (
    <AiPromptSubmit
      data-slot="ai-chat-submit"
      status={status}
      className={className}
      {...props}
    >
      {children}
    </AiPromptSubmit>
  )
}

export {
  AiChat,
  AiChatAvatar,
  AiChatEmptyState,
  AiChatMessage,
  AiChatMessageActions,
  AiChatMessageContent,
  AiChatMessages,
  AiChatPrompt,
  AiChatPromptFooter,
  AiChatPromptTools,
  AiChatScrollButton,
  AiChatSubmit,
  AiChatTextarea,
  aiChatMessageContentVariants,
  aiChatMessageVariants,
}
