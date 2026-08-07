"use client"

import { useAiStream } from "@/registry/hooks/use-ai-stream"
import { Button } from "@/registry/ui/button"
import { Markdown } from "@/registry/ui/markdown"

const responseChunks = [
  { type: "start", messageId: "markdown-stream-demo" },
  { type: "text-start", id: "answer" },
  { type: "text-delta", id: "answer", delta: "## 发布检查\n\n" },
  {
    type: "text-delta",
    id: "answer",
    delta: "本次发布包含 **3 项改动**：\n\n",
  },
  { type: "text-delta", id: "answer", delta: "- [x] 更新依赖\n" },
  { type: "text-delta", id: "answer", delta: "- [x] 通过类型检查\n" },
  { type: "text-delta", id: "answer", delta: "- [ ] 完成生产部署\n\n" },
  {
    type: "text-delta",
    id: "answer",
    delta: '\`\`\`ts\nconst channel = "stable"\n',
  },
  {
    type: "text-delta",
    id: "answer",
    delta: "await deploy(channel)\n\`\`\`\n\n",
  },
  {
    type: "text-delta",
    id: "answer",
    delta: "> 预计 2 分钟后可以完成。",
  },
  { type: "text-end", id: "answer" },
  { type: "finish", finishReason: "stop" },
] as const

function createMarkdownResponse() {
  const encoder = new TextEncoder()
  let index = 0
  let cancelled = false

  return new Response(
    new ReadableStream<Uint8Array>({
      async pull(controller) {
        await new Promise((resolve) => window.setTimeout(resolve, 420))
        if (cancelled) return

        const chunk = responseChunks[index]
        controller.enqueue(
          encoder.encode(
            `data: ${chunk ? JSON.stringify(chunk) : "[DONE]"}\n\n`
          )
        )
        index += 1
        if (!chunk) controller.close()
      },
      cancel() {
        cancelled = true
      },
    }),
    {
      headers: {
        "content-type": "text/event-stream",
        "x-vercel-ai-ui-message-stream": "v1",
      },
    }
  )
}

export default function MarkdownStreamDemo() {
  const { text, status, isStreaming, send, stop, reset } = useAiStream({
    api: "/api/assistant",
    fetch: async () => createMarkdownResponse(),
  })

  function replay() {
    reset()
    void send({ prompt: "检查发布状态" })
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <p className="text-sm font-medium">流式 Markdown</p>
          <p className="text-muted-foreground text-xs">
            累计文本到达时持续重解析
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant={isStreaming ? "outline" : "default"}
          onClick={() => {
            if (isStreaming) stop()
            else replay()
          }}
        >
          {isStreaming ? "停止生成" : text ? "重新播放" : "开始生成"}
        </Button>
      </div>

      {text ? (
        <Markdown isStreaming={isStreaming} featherLength={24}>
          {text}
        </Markdown>
      ) : (
        <p className="text-muted-foreground text-sm">
          点击开始，查看标题、任务列表、代码块和引用随分片逐步成形。
        </p>
      )}

      <p className="text-muted-foreground border-t pt-3 text-xs">
        当前状态：{status}
      </p>
    </div>
  )
}
