"use client"

import * as React from "react"

import { Download, type DownloadStatus } from "@/registry/ui/download"

interface Attachment {
  id: string
  filename: string
  meta: string
  status: DownloadStatus
  progress: number
}

const initialFiles: Attachment[] = [
  { id: "1", filename: "2026 Q2 财务报表.xlsx", meta: "XLSX · 2.4 MB", status: "idle", progress: 0 },
  { id: "2", filename: "系统架构设计 v3.pdf", meta: "PDF · 8.1 MB", status: "idle", progress: 0 },
  { id: "3", filename: "新人入职引导.mp4", meta: "MP4 · 45.6 MB", status: "idle", progress: 0 },
]

export default function DownloadCompact() {
  const [files, setFiles] = React.useState(initialFiles)
  const timers = React.useRef(new Map<string, ReturnType<typeof setInterval>>())

  React.useEffect(() => {
    const map = timers.current
    return () => map.forEach(clearInterval)
  }, [])

  const update = (id: string, patch: Partial<Attachment>) =>
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))

  const handleDownload = (file: Attachment) => {
    if (file.status === "downloading") return
    if (file.status === "complete") {
      update(file.id, { status: "idle", progress: 0 })
      return
    }
    update(file.id, { status: "downloading", progress: 0 })
    let progress = 0
    const timer = setInterval(() => {
      progress = Math.min(100, progress + 12 + Math.random() * 10)
      if (progress >= 100) {
        clearInterval(timer)
        timers.current.delete(file.id)
        update(file.id, { status: "complete", progress: 100 })
      } else {
        update(file.id, { progress })
      }
    }, 180)
    timers.current.set(file.id, timer)
  }

  return (
    <div className="w-full max-w-md space-y-2">
      <div className="text-muted-foreground flex items-center justify-between pb-1 text-xs">
        <span>会话附件</span>
        <span>{files.length} 个文件</span>
      </div>
      {files.map((file) => (
        <Download
          key={file.id}
          size="compact"
          filename={file.filename}
          meta={file.meta}
          status={file.status}
          progress={file.progress}
          onDownload={() => handleDownload(file)}
        />
      ))}
    </div>
  )
}
