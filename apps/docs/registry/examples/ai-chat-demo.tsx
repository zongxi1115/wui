"use client"

import * as React from "react"
import { PaperclipIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  AiChat,
  AiChatAvatar,
  AiChatLoading,
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
} from "@/registry/ui/ai-chat"
import {
  AiMessageCopy,
  AiMessageFeedback,
  AiMessageRetry,
} from "@/registry/ui/ai-message-actions"
import { AiStream } from "@/registry/ui/ai-stream"

type Message = {
  id: number
  role: "user" | "assistant"
  text: string
}

const REPLIES = [
  "可以先从信息层级入手：把账号、密码和登录按钮收拢为一组，第三方登录放到分隔线下方作为次要入口。错误提示贴近对应字段显示，而不是统一放在表单顶部。",
  "移动端建议把主按钮固定在可触达区域，输入框高度不低于 44px；键盘弹起时保持当前输入框在视口内，避免遮挡提交按钮。",
  "加载状态只禁用提交按钮并在按钮内显示进度，不要锁住整张表单，这样用户仍能检查自己填写的内容。",
]

const INITIAL: Message[] = [
  { id: 1, role: "user", text: "登录页改版，先从哪里开始？" },
  { id: 2, role: "assistant", text: REPLIES[0] },
]

type Status = "idle" | "submitted" | "streaming"

export default function AiChatDemo() {
  const [messages, setMessages] = React.useState(INITIAL)
  const [prompt, setPrompt] = React.useState("")
  const [status, setStatus] = React.useState<Status>("idle")
  const [streamed, setStreamed] = React.useState("")
  const replyIndex = React.useRef(1)
  const target = React.useRef("")

  // submitted: show the typing indicator briefly, then stream the reply.
  React.useEffect(() => {
    if (status !== "submitted") return
    const timer = window.setTimeout(() => setStatus("streaming"), 700)
    return () => window.clearTimeout(timer)
  }, [status])

  React.useEffect(() => {
    if (status !== "streaming") return
    let cursor = 0
    const timer = window.setInterval(() => {
      cursor = Math.min(cursor + 2, target.current.length)
      setStreamed(target.current.slice(0, cursor))
      if (cursor === target.current.length) window.clearInterval(timer)
    }, 30)
    return () => window.clearInterval(timer)
  }, [status])

  React.useEffect(() => {
    if (status === "streaming" && streamed === target.current) finish(streamed)
  })

  function finish(text: string) {
    setMessages((current) => [
      ...current,
      { id: Date.now(), role: "assistant", text },
    ])
    setStreamed("")
    setStatus("idle")
  }

  function send(text: string) {
    target.current = REPLIES[replyIndex.current % REPLIES.length]
    replyIndex.current += 1
    setMessages((current) => [...current, { id: Date.now(), role: "user", text }])
    setStatus("submitted")
  }

  const busy = status !== "idle"

  return (
    <AiChat className="mx-auto h-[520px] max-w-3xl">
      <AiChatMessages>
        {messages.map((message, index) => (
          <AiChatMessage key={message.id} role={message.role}>
            {message.role === "assistant" ? <AiChatAvatar /> : null}
            {message.role === "assistant" ? (
              <div className="min-w-0 max-w-[88%] flex-1 space-y-1">
                <AiChatMessageContent>{message.text}</AiChatMessageContent>
                <AiChatMessageActions className="-ml-1.5">
                  <AiMessageCopy content={message.text} />
                  {index === messages.length - 1 ? (
                    <AiMessageRetry
                      disabled={busy}
                      onClick={() => {
                        setMessages((current) => current.slice(0, -1))
                        target.current = REPLIES[replyIndex.current % REPLIES.length]
                        replyIndex.current += 1
                        setStatus("submitted")
                      }}
                    />
                  ) : null}
                  <AiMessageFeedback />
                </AiChatMessageActions>
              </div>
            ) : (
              <AiChatMessageContent role="user">{message.text}</AiChatMessageContent>
            )}
          </AiChatMessage>
        ))}

        {busy ? (
          <AiChatMessage role="assistant">
            <AiChatAvatar />
            <AiChatMessageContent>
              {status === "submitted" ? (
                <AiChatLoading />
              ) : (
                <AiStream isStreaming caret>
                  {streamed}
                </AiStream>
              )}
            </AiChatMessageContent>
          </AiChatMessage>
        ) : null}
      </AiChatMessages>

      <AiChatScrollButton />
      <AiChatPrompt
        onSubmit={(event) => {
          event.preventDefault()
          const text = prompt.trim()
          if (!text || busy) return
          setPrompt("")
          send(text)
        }}
      >
        <AiChatPromptFooter>
          <AiChatPromptTools>
            <Button type="button" variant="ghost" size="icon" aria-label="添加附件">
              <PaperclipIcon />
            </Button>
          </AiChatPromptTools>
          <AiChatTextarea
            value={prompt}
            placeholder="继续追问…"
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault()
                event.currentTarget.form?.requestSubmit()
              }
            }}
          />
          <AiChatSubmit
            status={status}
            disabled={!busy && !prompt.trim()}
            onClick={() => {
              if (status === "streaming") finish(streamed)
              else if (status === "submitted") setStatus("idle")
            }}
          />
        </AiChatPromptFooter>
      </AiChatPrompt>
    </AiChat>
  )
}
