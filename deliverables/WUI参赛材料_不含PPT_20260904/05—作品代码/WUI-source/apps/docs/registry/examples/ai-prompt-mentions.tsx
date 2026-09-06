"use client"

import * as React from "react"

import {
  AiPrompt,
  AiPromptContent,
  AiPromptFooter,
  AiPromptHeader,
  AiPromptMention,
  AiPromptMentionMenu,
  AiPromptQuote,
  AiPromptSubmit,
  AiPromptTextarea,
  type AiPromptMentionItem,
} from "@/registry/ui/ai-prompt"
import {
  Avatar,
  AvatarFallback,
} from "@/registry/ui/avatar"

const people: AiPromptMentionItem[] = [
  {
    id: "lin-wan",
    label: "林晚",
    description: "产品设计",
    keywords: ["designer", "product"],
    avatar: (
      <Avatar size="sm">
        <AvatarFallback>林</AvatarFallback>
      </Avatar>
    ),
  },
  {
    id: "chen-xu",
    label: "陈序",
    description: "前端工程",
    keywords: ["frontend", "web"],
    avatar: (
      <Avatar size="sm">
        <AvatarFallback>陈</AvatarFallback>
      </Avatar>
    ),
  },
  {
    id: "docs-agent",
    label: "文档助手",
    description: "团队 Agent",
    keywords: ["agent", "docs"],
    avatar: (
      <Avatar size="sm">
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
    ),
  },
]

export default function AiPromptMentions() {
  const [value, setValue] = React.useState("")
  const [showQuote, setShowQuote] = React.useState(true)

  return (
    <div className="mx-auto w-full max-w-4xl pt-28">
      <AiPromptMention
        value={value}
        onValueChange={setValue}
        items={people}
      >
        <AiPrompt
          onSubmit={(event) => {
            event.preventDefault()
            if (!value.trim()) return
            setValue("")
          }}
        >
          <AiPromptMentionMenu />
          {showQuote ? (
            <AiPromptHeader>
              <AiPromptQuote
                label="来自项目讨论"
                onRemove={() => setShowQuote(false)}
              >
                键盘用户需要能在不离开输入框的情况下选择提及对象。
              </AiPromptQuote>
            </AiPromptHeader>
          ) : null}
          <AiPromptFooter>
            <AiPromptContent className="min-w-0 flex-1">
              <AiPromptTextarea
                placeholder="输入 @ 提及成员或 Agent…"
                onKeyDown={(event) => {
                  if (
                    !event.defaultPrevented &&
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault()
                    event.currentTarget.form?.requestSubmit()
                  }
                }}
              />
            </AiPromptContent>
            <AiPromptSubmit disabled={!value.trim()} />
          </AiPromptFooter>
        </AiPrompt>
      </AiPromptMention>
    </div>
  )
}
