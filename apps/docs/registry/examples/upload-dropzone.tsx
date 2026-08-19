"use client"

import * as React from "react"
import { FileTextIcon, Trash2Icon } from "lucide-react"

import { Upload } from "@/registry/ui/upload"

interface FileItem {
  id: string
  name: string
  size: string
}

export default function UploadDropzone() {
  const [files, setFiles] = React.useState<FileItem[]>([
    { id: "1", name: "2026_Q3_Financial_Audit.pdf", size: "3.4 MB" },
    { id: "2", name: "Design_Tokens_Specification.pdf", size: "1.2 MB" },
  ])

  const handleFiles = (newFiles: File[]) => {
    const items = newFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    }))
    setFiles((prev) => [...prev, ...items])
  }

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <div className="bg-background w-full max-w-lg rounded-2xl border p-5 shadow-xs">
      <div className="mb-4">
        <h4 className="text-sm font-semibold">项目审计材料上传</h4>
        <p className="text-muted-foreground text-xs">
          支持拖拽多个 PDF 审计底稿与签名凭单
        </p>
      </div>

      <Upload
        multiple
        accept=".pdf"
        label="拖拽文件到此处，或点击浏览选择"
        description="仅支持 PDF 格式，支持批量拖放"
        onFilesChange={handleFiles}
      />

      {files.length > 0 ? (
        <div className="mt-4 grid gap-2">
          <div className="text-muted-foreground flex items-center justify-between text-xs font-medium">
            <span>已选择文件 ({files.length})</span>
            <button
              type="button"
              onClick={() => setFiles([])}
              className="text-destructive hover:underline"
            >
              清空全部
            </button>
          </div>

          <div className="max-h-48 divide-border/60 overflow-y-auto divide-y rounded-lg border">
            {files.map((file) => (
              <div
                key={file.id}
                className="hover:bg-accent/40 flex items-center justify-between p-2.5 text-xs transition-colors"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <FileTextIcon className="text-primary size-4 shrink-0" />
                  <span className="truncate font-medium">{file.name}</span>
                  <span className="text-muted-foreground shrink-0 tabular-nums">
                    ({file.size})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(file.id)}
                  aria-label={`移除 ${file.name}`}
                  className="text-muted-foreground hover:text-destructive ml-2 shrink-0 p-1 transition-colors"
                >
                  <Trash2Icon className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
