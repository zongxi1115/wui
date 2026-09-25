"use client"

import * as React from "react"
import { ArrowUpIcon, HeadsetIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import {
  Bubble,
  BubbleAvatar,
  BubbleBody,
  BubbleContent,
  BubbleFooter,
  BubbleTyping,
} from "@/registry/ui/bubble"
import { Button } from "@/registry/ui/button"
import { Input } from "@/registry/ui/input"

type Message = {
  id: number
  side: "start" | "end"
  text: string
  time: string
}

const replies = [
  "已查到订单 #20931，包裹今天 09:12 从杭州转运中心发出，预计明天中午前送达。",
  "可以的，我已为你备注「放丰巢快递柜」，派送员出发前会再发短信确认。",
  "不客气！如果还需要改地址或开发票，直接在这里告诉我就好。",
]

const suggestions = ["我的快递到哪了？", "能放快递柜吗？", "好的，谢谢"]

function now() {
  return new Date().toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function BubbleConversation() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 0,
      side: "start",
      text: "你好，我是售后助理小川，有什么可以帮你？",
      time: "10:02",
    },
  ])
  const [draft, setDraft] = React.useState("")
  const [typing, setTyping] = React.useState(false)
  const replyIndex = React.useRef(0)
  const nextId = React.useRef(1)
  const timer = React.useRef<number | undefined>(undefined)
  const listRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  React.useEffect(() => {
    const list = listRef.current
    if (!list) return
    list.scrollTo({ top: list.scrollHeight, behavior: "smooth" })
  }, [messages.length, typing])

  function send(text: string) {
    const content = text.trim()
    if (!content || typing) return

    setMessages((current) => [
      ...current,
      { id: nextId.current++, side: "end", text: content, time: now() },
    ])
    setDraft("")
    setTyping(true)

    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      const reply = replies[replyIndex.current % replies.length]
      replyIndex.current += 1
      setTyping(false)
      setMessages((current) => [
        ...current,
        { id: nextId.current++, side: "start", text: reply, time: now() },
      ])
    }, 1200)
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col overflow-hidden rounded-lg border bg-background">
      <header className="flex items-center gap-2.5 border-b px-4 py-3">
        <Avatar size="sm">
          <AvatarFallback className="bg-primary/10 text-primary">
            <HeadsetIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-medium leading-5">售后助理 · 小川</p>
          <p className="text-muted-foreground text-xs">
            {typing ? "正在输入…" : "通常 1 分钟内回复"}
          </p>
        </div>
      </header>

      <div
        ref={listRef}
        role="log"
        className="flex h-80 flex-col gap-4 overflow-y-auto px-4 py-4"
      >
        {messages.map((message) => (
          <Bubble key={message.id} side={message.side}>
            {message.side === "start" ? (
              <BubbleAvatar>
                <Avatar size="sm">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    川
                  </AvatarFallback>
                </Avatar>
              </BubbleAvatar>
            ) : null}
            <BubbleBody>
              <BubbleContent
                variant={message.side === "end" ? "primary" : "default"}
              >
                {message.text}
              </BubbleContent>
              <BubbleFooter>
                <time>{message.time}</time>
              </BubbleFooter>
            </BubbleBody>
          </Bubble>
        ))}

        {typing ? (
          <Bubble>
            <BubbleAvatar>
              <Avatar size="sm">
                <AvatarFallback className="bg-primary/10 text-primary">
                  川
                </AvatarFallback>
              </Avatar>
            </BubbleAvatar>
            <BubbleBody>
              <BubbleContent className="text-muted-foreground">
                <BubbleTyping label="小川正在输入" />
              </BubbleContent>
            </BubbleBody>
          </Bubble>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-1.5 border-t px-4 pt-3">
        {suggestions.map((item) => (
          <Button
            key={item}
            type="button"
            size="sm"
            variant="outline"
            className="h-7 rounded-full px-2.5 text-xs font-normal"
            disabled={typing}
            onClick={() => send(item)}
          >
            {item}
          </Button>
        ))}
      </div>

      <form
        className="flex items-center gap-2 px-4 pb-4 pt-2.5"
        onSubmit={(event) => {
          event.preventDefault()
          send(draft)
        }}
      >
        <Input
          aria-label="输入消息"
          placeholder="输入消息，回车发送"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <Button
          type="submit"
          size="icon"
          className="size-10 shrink-0"
          aria-label="发送"
          disabled={!draft.trim() || typing}
        >
          <ArrowUpIcon />
        </Button>
      </form>
    </div>
  )
}
