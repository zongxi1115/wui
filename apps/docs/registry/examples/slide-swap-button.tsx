import { ArrowRightIcon, DownloadIcon, PlusIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { SlideSwap } from "@/registry/ui/slide-swap"

export default function SlideSwapButton() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button>
        <SlideSwap trigger="parent">
          <span className="flex items-center gap-2">
            立即开始
            <ArrowRightIcon className="size-4" />
          </span>
        </SlideSwap>
      </Button>

      <Button variant="outline">
        <SlideSwap trigger="parent" direction="down">
          <span className="flex items-center gap-2">
            <DownloadIcon className="size-4" />
            下载客户端
          </span>
        </SlideSwap>
      </Button>

      <Button variant="ghost">
        <SlideSwap trigger="parent">
          <span className="flex items-center gap-2">
            <PlusIcon className="size-4" />
            新建项目
          </span>
        </SlideSwap>
      </Button>
    </div>
  )
}
