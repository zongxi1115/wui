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

export default function DownloadCompact() {
  const [files, setFiles] = React.useState<Attachment[]>([
    {
      id: "1",
      filename: "2026_Q2_Financial_Report.xlsx",
      meta: "Excel · 2.4 MB",
      status: "idle",
      progress: 0,
    },
    {
      id: "2",
      filename: "System_Architecture_v3.pdf",
      meta: "PDF 文档 · 8.1 MB",
      status: "idle",
      progress: 0,
    },
    {
      id: "3",
      filename: "Product_Demo_Walkthrough.mp4",
      meta: "MP4 视频 · 45.6 MB",
      status: "idle",
      progress: 0,
    },
  ])

  const handleDownload = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "downloading", progress: 10 } : f))
    )

    const timer = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.id !== id) return f
          const next = f.progress + 25
          if (next >= 100) {
            clearInterval(timer)
            return { ...f, status: "complete", progress: 100 }
          }
          return { ...f, progress: next }
        })
      )
    }, 200)
  }

  return (
    <div className="w-full max-w-md space-y-3 rounded-xl border bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground">会话附件清单 (Compact List)</span>
        <span className="text-[11px] text-muted-foreground">共 3 个文件</span>
      </div>

      <div className="space-y-2">
        {files.map((file) => (
          <Download
            key={file.id}
            size="compact"
            filename={file.filename}
            meta={file.meta}
            status={file.status}
            progress={file.progress}
            onDownload={() => handleDownload(file.id)}
          />
        ))}
      </div>
    </div>
  )
}
