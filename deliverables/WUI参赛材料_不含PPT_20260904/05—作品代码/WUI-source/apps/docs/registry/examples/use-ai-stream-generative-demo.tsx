"use client"

import { CheckIcon, CircleIcon, LoaderCircleIcon } from "lucide-react"

import {
  type AiStreamDataPart,
  useAiStream,
} from "@/registry/hooks/use-ai-stream"
import { AiStream } from "@/registry/ui/ai-stream"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Progress } from "@/registry/ui/progress"

type DeploymentStage = {
  label: string
  state: "pending" | "running" | "done"
}

type DeploymentData = {
  project: string
  environment: string
  progress: number
  stages: DeploymentStage[]
}

const snapshots: DeploymentData[] = [
  {
    project: "docs-web",
    environment: "Production",
    progress: 12,
    stages: [
      { label: "解析配置", state: "running" },
      { label: "上传资源", state: "pending" },
      { label: "发布版本", state: "pending" },
    ],
  },
  {
    project: "docs-web",
    environment: "Production",
    progress: 56,
    stages: [
      { label: "解析配置", state: "done" },
      { label: "上传资源", state: "running" },
      { label: "发布版本", state: "pending" },
    ],
  },
  {
    project: "docs-web",
    environment: "Production",
    progress: 88,
    stages: [
      { label: "解析配置", state: "done" },
      { label: "上传资源", state: "done" },
      { label: "发布版本", state: "running" },
    ],
  },
  {
    project: "docs-web",
    environment: "Production",
    progress: 100,
    stages: [
      { label: "解析配置", state: "done" },
      { label: "上传资源", state: "done" },
      { label: "发布版本", state: "done" },
    ],
  },
]

function createDeploymentResponse() {
  const encoder = new TextEncoder()
  const chunks = [
    { type: "start", messageId: "deployment-demo" },
    ...snapshots.map((data) => ({
      type: "data-deployment",
      id: "current-deployment",
      data,
    })),
    { type: "text-start", id: "summary" },
    {
      type: "text-delta",
      id: "summary",
      delta: "部署完成，新版本已经在 Production 生效。",
    },
    { type: "text-end", id: "summary" },
    { type: "finish", finishReason: "stop" },
  ]
  let index = 0

  return new Response(
    new ReadableStream<Uint8Array>({
      async pull(controller) {
        await new Promise((resolve) => window.setTimeout(resolve, 380))
        const chunk = chunks[index]
        controller.enqueue(
          encoder.encode(`data: ${chunk ? JSON.stringify(chunk) : "[DONE]"}\n\n`)
        )
        index += 1
        if (!chunk) controller.close()
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

function StageIcon({ state }: { state: DeploymentStage["state"] }) {
  if (state === "done") return <CheckIcon className="text-success size-4" />
  if (state === "running") {
    return <LoaderCircleIcon className="text-info size-4 animate-spin" />
  }
  return <CircleIcon className="text-muted-foreground size-4" />
}

export default function UseAiStreamGenerativeDemo() {
  const { message, text, isStreaming, consume, reset } = useAiStream<
    unknown,
    DeploymentData
  >()

  const deploymentPart = message?.parts.find(
    (part): part is AiStreamDataPart<DeploymentData> =>
      part.type === "data-deployment"
  )
  const deployment = deploymentPart?.data

  function play() {
    reset()
    void consume(createDeploymentResponse())
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-5">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <p className="text-sm font-medium">Generative UI</p>
          <p className="text-muted-foreground text-xs">
            相同 id 的 data-* 分片原位更新
          </p>
        </div>
        <Button type="button" size="sm" disabled={isStreaming} onClick={play}>
          {isStreaming ? "部署中…" : "模拟部署"}
        </Button>
      </div>

      {deployment ? (
        <section className="space-y-5 border-y py-5" aria-live="polite">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-medium">{deployment.project}</h3>
              <p className="text-muted-foreground mt-1 text-xs">
                {deployment.environment}
              </p>
            </div>
            <Badge
              variant={deployment.progress === 100 ? "success" : "info"}
            >
              {deployment.progress === 100 ? "已完成" : "执行中"}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">部署进度</span>
              <span className="tabular-nums">{deployment.progress}%</span>
            </div>
            <Progress
              value={deployment.progress}
              color={deployment.progress === 100 ? "success" : "blue"}
            />
          </div>

          <ol className="grid gap-3 sm:grid-cols-3">
            {deployment.stages.map((stage) => (
              <li key={stage.label} className="flex items-center gap-2 text-sm">
                <StageIcon state={stage.state} />
                {stage.label}
              </li>
            ))}
          </ol>
        </section>
      ) : (
        <p className="text-muted-foreground text-sm">
          data-deployment 到达后，这里会生成并持续更新部署界面。
        </p>
      )}

      {text ? (
        <AiStream className="text-sm" isStreaming={isStreaming}>
          {text}
        </AiStream>
      ) : null}
    </div>
  )
}
