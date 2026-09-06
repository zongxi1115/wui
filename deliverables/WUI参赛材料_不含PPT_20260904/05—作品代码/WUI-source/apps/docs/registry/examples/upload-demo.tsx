"use client"

import * as React from "react"

import { Download } from "@/registry/ui/download"
import { Upload } from "@/registry/ui/upload"

type UploadedFile = {
  file: File
  url: string
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function UploadDemo() {
  const [files, setFiles] = React.useState<UploadedFile[]>([])

  React.useEffect(
    () => () => files.forEach(({ url }) => URL.revokeObjectURL(url)),
    [files]
  )

  async function uploadFiles(selectedFiles: File[]) {
    await new Promise((resolve) => setTimeout(resolve, 800))
    setFiles((current) => {
      current.forEach(({ url }) => URL.revokeObjectURL(url))
      return selectedFiles.map((file) => ({ file, url: URL.createObjectURL(file) }))
    })
  }

  return (
    <div className="grid w-full max-w-lg gap-3">
      <Upload
        accept="image/*,.pdf,.zip"
        description="PNG, JPG, PDF or ZIP"
        multiple
        onUpload={uploadFiles}
      />

      {files.length > 0 ? (
        <div className="grid gap-2" aria-label="Uploaded files">
          {files.map(({ file, url }) => (
            <Download
              key={`${file.name}-${file.lastModified}`}
              size="compact"
              filename={file.name}
              meta={formatBytes(file.size)}
              href={url}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
