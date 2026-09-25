"use client"

import * as React from "react"
import { RotateCcwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Upload, type UploadStatus } from "@/registry/ui/upload"

const statusLabel: Record<UploadStatus, string> = {
  idle: "等待选择文件",
  uploading: "上传中",
  complete: "已完成，正在后台校验",
  error: "上传失败",
}

export default function UploadProgressSimulated() {
  const [status, setStatus] = React.useState<UploadStatus>("idle")
  const [progress, setProgress] = React.useState(0)
  const timer = React.useRef<number>(undefined)

  React.useEffect(() => () => window.clearInterval(timer.current), [])

  function handleFiles(files: File[]) {
    if (!files.length) return
    setStatus("uploading")
    setProgress(0)

    let current = 0
    window.clearInterval(timer.current)
    timer.current = window.setInterval(() => {
      current = Math.min(100, current + 6 + Math.random() * 14)
      setProgress(current)
      if (current >= 100) {
        window.clearInterval(timer.current)
        window.setTimeout(() => setStatus("complete"), 300)
      }
    }, 220)
  }

  function reset() {
    window.clearInterval(timer.current)
    setStatus("idle")
    setProgress(0)
  }

  return (
    <div className="grid w-full max-w-md gap-3">
      <Upload
        status={status}
        progress={progress}
        label="上传离线数据包"
        description="支持 .zip、.tar.gz，上传后自动校验完整性"
        accept=".zip,.tar,.gz"
        onFilesChange={handleFiles}
      />

      <div className="flex h-8 items-center justify-between text-xs">
        <span className="text-muted-foreground tabular-nums" aria-live="polite">
          {statusLabel[status]}
          {status === "uploading" ? ` · ${Math.round(progress)}%` : null}
        </span>
        {status !== "idle" ? (
          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={reset}>
            <RotateCcwIcon />
            重置
          </Button>
        ) : null}
      </div>
    </div>
  )
}
