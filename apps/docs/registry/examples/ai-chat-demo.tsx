"use client"

import * as React from "react"
import { CopyIcon, PaperclipIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  AiChat,
  AiChatAvatar,
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
  AiReasoning,
  AiReasoningContent,
  AiReasoningStream,
  AiReasoningTrigger,
} from "@/registry/ui/ai-reasoning"
import {
  AiTodo,
  AiTodoHeader,
  AiTodoItem,
  AiTodoList,
} from "@/registry/ui/ai-todo"
import {
  AiTool,
  AiToolCode,
  AiToolContent,
  AiToolLabel,
  AiToolSection,
  AiToolTrigger,
} from "@/registry/ui/ai-tool"

export default function AiChatDemo() {
  const [prompt, setPrompt] = React.useState("")
  const [messages, setMessages] = React.useState<string[]>([])

  return (
    <AiChat className="mx-auto h-[620px] max-w-3xl">
      <AiChatMessages>
        <AiChatMessage role="user">
          <AiChatMessageContent role="user">
            帮我梳理登录页改版需要完成的工作。
          </AiChatMessageContent>
        </AiChatMessage>

        <AiChatMessage role="assistant">
          <AiChatAvatar />
          <div className="min-w-0 max-w-[88%] flex-1 space-y-3">
            <AiChatMessageContent>
              我先检查现有页面结构与设计变量，再整理成可以直接执行的任务。
            </AiChatMessageContent>

            <AiReasoning duration={2.8} defaultOpen>
              <AiReasoningTrigger />
              <AiReasoningContent>
                <AiReasoningStream>
                  先读取登录流程，确认表单、第三方登录和错误反馈；再核对设计变量，沿用现有间距、边框与语义色。
                </AiReasoningStream>
              </AiReasoningContent>
            </AiReasoning>

            <AiTool status="success" defaultOpen>
              <AiToolTrigger name="read_project_files" />
              <AiToolContent>
                <AiToolSection>
                  <AiToolLabel>输入</AiToolLabel>
                  <AiToolCode>{`{ "path": "app/login" }`}</AiToolCode>
                </AiToolSection>
                <AiToolSection>
                  <AiToolLabel>结果</AiToolLabel>
                  找到 6 个相关文件，已读取页面和表单组件。
                </AiToolSection>
              </AiToolContent>
            </AiTool>

            <AiTodo>
              <AiTodoHeader>实施计划 · 1/3</AiTodoHeader>
              <AiTodoList>
                <AiTodoItem
                  status="completed"
                  title="盘点现有登录状态"
                />
                <AiTodoItem
                  status="in-progress"
                  title="重组表单信息层级"
                  description="保留原有校验与提交逻辑。"
                />
                <AiTodoItem status="pending" title="补齐移动端布局" />
              </AiTodoList>
            </AiTodo>

            <AiChatMessageContent>
              计划已经整理好。我会先改信息层级，再处理响应式布局，过程中不改登录接口。
            </AiChatMessageContent>
            <AiChatMessageActions>
              <Button variant="ghost" size="icon" aria-label="复制回复">
                <CopyIcon />
              </Button>
              <Button variant="ghost" size="icon" aria-label="重新生成">
                <RotateCcwIcon />
              </Button>
            </AiChatMessageActions>
          </div>
        </AiChatMessage>

        {messages.map((message, index) => (
          <AiChatMessage key={`${message}-${index}`} role="user">
            <AiChatMessageContent role="user">
              {message}
            </AiChatMessageContent>
          </AiChatMessage>
        ))}
      </AiChatMessages>

      <AiChatScrollButton />
      <AiChatPrompt
        onSubmit={(event) => {
          event.preventDefault()
          if (!prompt.trim()) return
          setMessages((current) => [...current, prompt.trim()])
          setPrompt("")
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
            placeholder="输入消息…"
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                event.currentTarget.form?.requestSubmit()
              }
            }}
          />
          <AiChatSubmit disabled={!prompt.trim()} />
        </AiChatPromptFooter>
      </AiChatPrompt>
    </AiChat>
  )
}
