"use client"

import * as React from "react"
import { Progress } from "@/registry/ui/progress"
import { Button } from "@/registry/ui/button"
import { PlayIcon, RotateCcwIcon, CheckCircle2Icon, FileArchiveIcon } from "lucide-react"

export default function ProgressDynamic() {
  const [progress, setProgress] = React.useState(0)
  const [status, setStatus] = React.useState<"idle" | "uploading" | "completed">("idle")

  React.useEffect(() => {
    if (status !== "uploading") return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setStatus("completed")
          return 100
        }
        return prev + Math.floor(Math.random() * 15) + 5
      })
    }, 300)

    return () => clearInterval(interval)
  }, [status])

  const startUpload = () => {
    setProgress(0)
    setStatus("uploading")
  }

  const resetUpload = () => {
    setProgress(0)
    setStatus("idle")
  }

  return (
    <div className="w-full max-w-md space-y-4 rounded-xl border bg-card p-5">
      <div className="flex items-start gap-3.5">
        <div className="rounded-lg bg-muted p-2.5">
          <FileArchiveIcon className="size-5 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium truncate">release-v2.4.0-assets.tar.gz</h4>
            <span className="text-xs font-mono text-muted-foreground tabular-nums">
              {Math.min(100, progress)}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground">48.6 MB / 50.0 MB · 剩余约 3 秒</p>
        </div>
      </div>

      <Progress
        value={progress}
        color={status === "completed" ? "success" : "primary"}
      />

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {status === "completed" ? (
            <span className="flex items-center gap-1 text-success font-medium">
              <CheckCircle2Icon className="size-4" /> 上传校验完成
            </span>
          ) : status === "uploading" ? (
            <span>正在进行多块并行分片上传…</span>
          ) : (
            <span>等待开始上传任务</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {status === "idle" && (
            <Button size="sm" onClick={startUpload}>
              <PlayIcon className="size-3.5" /> 开始上传
            </Button>
          )}
          {status === "uploading" && (
            <Button size="sm" variant="outline" onClick={() => setStatus("idle")}>
              暂停
            </Button>
          )}
          {status === "completed" && (
            <Button size="sm" variant="outline" onClick={resetUpload}>
              <RotateCcwIcon className="size-3.5" /> 重新上传
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
