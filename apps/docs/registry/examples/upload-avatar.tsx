"use client"

import * as React from "react"
import { AlertCircleIcon, CheckIcon, UserIcon } from "lucide-react"

import { Upload } from "@/registry/ui/upload"

export default function UploadAvatar() {
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const handleUpload = async (files: File[]) => {
    const file = files[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setError("图片大小不得超过 2MB")
      throw new Error("File too large")
    }

    setError(null)
    // 模拟上传延迟
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const url = URL.createObjectURL(file)
    setAvatarUrl(url)
  }

  return (
    <div className="bg-background w-full max-w-sm rounded-xl border p-6 text-center shadow-xs">
      <h4 className="text-sm font-semibold">个人头像上传</h4>
      <p className="text-muted-foreground mt-1 text-xs">
        支持 JPG、PNG 格式，大小不超过 2MB
      </p>

      <div className="my-5 flex flex-col items-center justify-center gap-4">
        <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed bg-muted">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="已上传头像"
              className="size-full object-cover"
            />
          ) : (
            <UserIcon className="size-8 text-muted-foreground" />
          )}
        </div>

        <Upload
          size="compact"
          accept="image/png,image/jpeg,image/webp"
          label="点击或拖拽新头像"
          description="更新公开个人资料图像"
          onUpload={handleUpload}
          className="w-full"
        />
      </div>

      {error ? (
        <div className="text-destructive flex items-center justify-center gap-1.5 text-xs font-medium">
          <AlertCircleIcon className="size-3.5" />
          <span>{error}</span>
        </div>
      ) : avatarUrl ? (
        <div className="text-success flex items-center justify-center gap-1.5 text-xs font-medium">
          <CheckIcon className="size-3.5" />
          <span>头像更新成功</span>
        </div>
      ) : null}
    </div>
  )
}
