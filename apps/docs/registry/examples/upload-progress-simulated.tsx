"use client"

import * as React from "react"
import { RefreshCwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Upload, type UploadStatus } from "@/registry/ui/upload"

export default function UploadProgressSimulated() {
  const [status, setStatus] = React.useState<UploadStatus>("idle")
  const [progress, setProgress] = React.useState(0)

  const handleFiles = (files: File[]) => {
    if (!files.length) return
    setStatus("uploading")
    setProgress(0)

    let current = 0
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 10
      if (current >= 100) {
        current = 100
        setProgress(100)
        clearInterval(interval)
        setTimeout(() => setStatus("complete"), 300)
      } else {
        setProgress(current)
      }
    }, 200)
  }

  const handleReset = () => {
    setStatus("idle")
    setProgress(0)
  }

  return (
    <div className="grid w-full max-w-md gap-4">
      <Upload
        status={status}
        progress={progress}
        label="上传离线数据包 (.zip / .tar)"
        description="系统将自动解析并在后台校验校验和"
        accept=".zip,.tar,.gz"
        onFilesChange={handleFiles}
      />

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          状态：<span className="text-foreground font-medium">{status}</span>
          {status === "uploading" ? ` (${progress}%)` : null}
        </span>
        {status !== "idle" ? (
          <Button size="sm" variant="ghost" onClick={handleReset}>
            <RefreshCwIcon className="size-3.5 mr-1" />
            重新测试
          </Button>
        ) : null}
      </div>
    </div>
  )
}
