import { LockKeyholeIcon } from "lucide-react"

import { Download } from "@/registry/ui/download"

export default function DownloadStates() {
  return (
    <div className="grid w-full max-w-md gap-3">
      <Download size="compact" filename="发布会现场照片.zip" meta="ZIP · 18 MB" />
      <Download
        size="compact"
        filename="产品演示录屏.mp4"
        meta="MP4 · 126 MB"
        status="downloading"
        progress={64}
      />
      <Download size="compact" filename="第三季度经营分析.pdf" meta="PDF · 3.2 MB" status="complete" />
      <Download size="compact" filename="客户名单导出.xlsx" meta="XLSX · 820 KB" status="error" />
      <Download
        size="compact"
        filename="生产环境证书.key"
        meta="仅管理员可下载"
        fileIcon={<LockKeyholeIcon className="size-4" />}
      />
    </div>
  )
}
