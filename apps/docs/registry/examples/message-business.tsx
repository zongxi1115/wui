"use client"

import { ArchiveIcon, CopyIcon, UploadCloudIcon } from "lucide-react"

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
    navigator.clipboard?.writeText?.("sk_live_51M0892789123847")
    message.success("生产环境密钥已复制到剪贴板")
  }

  const uploadFile = () => {
    const id = message.loading("正在同步 14 个资源文件至 CDN…")
    window.setTimeout(() => {
      message.update(id, {
        variant: "success",
        title: "同步完成",
        description: "14 个文件已在全部边缘节点生效。",
      })
    }, 2200)
  }

  const archiveProjects = () => {
    const id = message.open({
      closable: true,
      duration: 6000,
      description: (
        <span className="flex items-center justify-between gap-3">
          已将 3 个项目移至归档
          <button
            type="button"
            className="text-primary shrink-0 text-sm font-medium underline-offset-4 hover:underline"
            onClick={() => {
              message.update(id, {
                variant: "info",
                closable: false,
                duration: 2000,
                description: "已撤销归档，项目已恢复。",
              })
            }}
          >
            撤销
          </button>
        </span>
      ),
    })
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="outline" size="sm" onClick={copyApiKey}>
        <CopyIcon /> 复制密钥
      </Button>
      <Button variant="outline" size="sm" onClick={uploadFile}>
        <UploadCloudIcon /> 同步资源
      </Button>
      <Button variant="outline" size="sm" onClick={archiveProjects}>
        <ArchiveIcon /> 归档项目
      </Button>
    </div>
  )
}
