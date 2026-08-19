"use client"

import { CheckIcon, CopyIcon, Trash2Icon, UploadCloudIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { MessageProvider, useMessage } from "@/registry/ui/message"

export default function MessageBusinessDemo() {
  return (
    <MessageProvider position="top-right" duration={3500}>
      <BusinessScenarioBar />
    </MessageProvider>
  )
}

function BusinessScenarioBar() {
  const message = useMessage()

  const copyApiKey = () => {
    navigator.clipboard?.writeText?.("sk_live_51M089278912384789123")
    message.success(
      <span className="flex items-center gap-1.5 font-medium">
        <CheckIcon className="size-4 text-emerald-500" />
        API 生产密钥已复制到剪贴板
      </span>,
      { icon: false }
    )
  }

  const uploadFile = () => {
    message.open({
      variant: "info",
      description: (
        <span className="flex items-center gap-2">
          <UploadCloudIcon className="size-4 text-sky-500 animate-pulse" />
          <span>正在同步 14 个资源文件至全球 CDN...</span>
        </span>
      ),
      icon: false,
      duration: 3000,
    })
  }

  const batchDelete = () => {
    message.open({
      variant: "destructive",
      description: (
        <div className="flex items-center justify-between gap-3 w-full">
          <span>已将 3 个项目归档至废纸篓</span>
          <button
            type="button"
            className="text-xs font-semibold text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
            onClick={() => {
              message.dismiss("last-delete")
              message.success("归档操作已成功撤销")
            }}
          >
            撤销 (Undo)
          </button>
        </div>
      ),
      icon: false,
      closable: true,
      duration: 5000,
    })
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="outline" size="sm" className="gap-1.5" onClick={copyApiKey}>
        <CopyIcon className="size-3.5" /> 复制密钥
      </Button>

      <Button variant="outline" size="sm" className="gap-1.5" onClick={uploadFile}>
        <UploadCloudIcon className="size-3.5" /> 上传资产
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={batchDelete}
      >
        <Trash2Icon className="size-3.5" /> 批量归档
      </Button>
    </div>
  )
}
