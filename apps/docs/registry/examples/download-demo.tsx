"use client"

import * as React from "react"

import { Download, type DownloadStatus } from "@/registry/ui/download"

export default function DownloadDemo() {
  const [status, setStatus] = React.useState<DownloadStatus>("idle")
  const [progress, setProgress] = React.useState(0)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearInterval(timer.current), [])

  function beginDownload() {
    if (status === "complete") {
      setStatus("idle")
      setProgress(0)
      return
    }
    clearInterval(timer.current)
    setProgress(0)
    setStatus("downloading")
    // 先经历一段“正在准备”的不确定进度，再进入确切进度
    timer.current = setTimeout(() => {
      timer.current = setInterval(() => {
        setProgress((current) => {
          const next = Math.min(100, current + 6)
          if (next === 100) {
            clearInterval(timer.current)
            setStatus("complete")
          }
          return next
        })
      }, 120)
    }, 900)
  }

  return (
    <div className="w-full max-w-md">
      <Download
        filename="品牌视觉规范 2026.zip"
        meta="ZIP · 48.2 MB"
        status={status}
        progress={progress}
        onDownload={beginDownload}
      />
    </div>
  )
}
