import { ArrowRightIcon, DownloadIcon, PlusIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"

export default function ButtonWithIcon() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button>
        <PlusIcon />
        新建工作区
      </Button>
      <Button variant="outline">
        <DownloadIcon />
        导出报表
      </Button>
      <Button variant="ghost">
        下一步
        <ArrowRightIcon />
      </Button>
    </div>
  )
}
