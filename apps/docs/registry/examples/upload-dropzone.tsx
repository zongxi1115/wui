"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import {
  Upload,
  UploadFileItem,
  UploadFileList,
  type UploadStatus,
} from "@/registry/ui/upload"

interface QueuedFile {
  id: string
  name: string
  size: number
  status: UploadStatus
  progress: number
}

const MAX_SIZE = 20 * 1024 * 1024

const seedFiles: QueuedFile[] = [
  { id: "seed-1", name: "2026 Q3 审计底稿.pdf", size: 3_565_158, status: "complete", progress: 100 },
  { id: "seed-2", name: "供应商对账单-九月.pdf", size: 1_258_291, status: "complete", progress: 100 },
]

export default function UploadDropzone() {
  const [files, setFiles] = React.useState<QueuedFile[]>(seedFiles)
  const timers = React.useRef(new Map<string, number>())

  React.useEffect(() => {
    const active = timers.current
    return () => active.forEach((timer) => window.clearInterval(timer))
  }, [])

  function patch(id: string, next: Partial<QueuedFile>) {
    setFiles((current) => current.map((file) => (file.id === id ? { ...file, ...next } : file)))
  }

  function simulateUpload(file: QueuedFile) {
    let progress = 0
    const timer = window.setInterval(() => {
      progress = Math.min(100, progress + 8 + Math.random() * 18)
      if (progress >= 100) {
        window.clearInterval(timer)
        timers.current.delete(file.id)
        patch(file.id, { progress: 100, status: "complete" })
      } else {
        patch(file.id, { progress })
      }
    }, 260)
    timers.current.set(file.id, timer)
  }

  function handleFiles(selected: File[]) {
    const queued = selected.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      size: file.size,
      status: (file.size > MAX_SIZE ? "error" : "uploading") as UploadStatus,
      progress: 0,
    }))
    setFiles((current) => [...queued, ...current])
    queued.filter((file) => file.status === "uploading").forEach(simulateUpload)
  }

  function remove(id: string) {
    window.clearInterval(timers.current.get(id))
    timers.current.delete(id)
    setFiles((current) => current.filter((file) => file.id !== id))
  }

  const uploading = files.filter((file) => file.status === "uploading").length

  return (
    <div className="grid w-full max-w-lg gap-4">
      <Upload
        multiple
        accept=".pdf"
        label="拖拽 PDF 到此处，或点击选择"
        description="支持批量上传，单个文件不超过 20 MB"
        onFilesChange={handleFiles}
      />

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {files.length} 个文件{uploading ? `，${uploading} 个上传中` : ""}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground h-7 px-2 text-xs"
          disabled={!files.length}
          onClick={() => files.forEach((file) => remove(file.id))}
        >
          全部移除
        </Button>
      </div>

      <UploadFileList aria-label="已选择的文件">
        {files.map((file) => (
          <UploadFileItem
            key={file.id}
            name={file.name}
            size={file.size}
            status={file.status}
            progress={file.progress}
            description={file.status === "error" ? "文件超过 20 MB，未上传" : undefined}
            onRemove={() => remove(file.id)}
          />
        ))}
      </UploadFileList>
    </div>
  )
}
