"use client"

import * as React from "react"
import {
  CheckIcon,
  FileArchiveIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
} from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Progress } from "@/registry/ui/progress"

type Status = "idle" | "uploading" | "paused" | "done"

const FILE_MB = 50

export default function ProgressDynamic() {
  const [progress, setProgress] = React.useState(0)
  const [status, setStatus] = React.useState<Status>("idle")

  React.useEffect(() => {
    if (status !== "uploading") return
    const timer = window.setInterval(() => {
      setProgress((current) =>
        Math.min(100, current + 4 + Math.round(Math.random() * 10))
      )
    }, 420)
    return () => window.clearInterval(timer)
  }, [status])

  React.useEffect(() => {
    if (progress >= 100) setStatus("done")
  }, [progress])

  const uploaded = ((FILE_MB * progress) / 100).toFixed(1)
  const remaining = Math.max(1, Math.ceil((100 - progress) / 20))

  const caption = {
    idle: "等待上传 · 50.0 MB",
    uploading: `${uploaded} MB / ${FILE_MB}.0 MB · 剩余约 ${remaining} 秒`,
    paused: `已暂停 · ${uploaded} MB / ${FILE_MB}.0 MB`,
    done: "上传完成，已通过 SHA-256 校验",
  }[status]

  function reset() {
    setProgress(0)
    setStatus("idle")
  }

  return (
    <div className="w-full max-w-md rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md">
          {status === "done" ? (
            <CheckIcon className="text-success size-4" />
          ) : (
            <FileArchiveIcon className="size-4" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <p className="truncate text-sm font-medium">
              release-v2.4.0-assets.tar.gz
            </p>
            <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
              {progress}%
            </span>
          </div>
          <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">
            {caption}
          </p>
        </div>
      </div>

      <Progress
        className="mt-3"
        value={progress}
        color={
          status === "done"
            ? "success"
            : status === "paused"
              ? "warning"
              : "primary"
        }
        aria-label="文件上传进度"
      />

      <div className="mt-4 flex justify-end gap-2">
        {status === "paused" || status === "done" ? (
          <Button size="sm" variant="ghost" onClick={reset}>
            <RotateCcwIcon />
            {status === "done" ? "重新上传" : "取消"}
          </Button>
        ) : null}
        {status === "idle" ? (
          <Button size="sm" onClick={() => setStatus("uploading")}>
            <PlayIcon />
            开始上传
          </Button>
        ) : null}
        {status === "uploading" ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setStatus("paused")}
          >
            <PauseIcon />
            暂停
          </Button>
        ) : null}
        {status === "paused" ? (
          <Button size="sm" onClick={() => setStatus("uploading")}>
            <PlayIcon />
            继续
          </Button>
        ) : null}
      </div>
    </div>
  )
}
