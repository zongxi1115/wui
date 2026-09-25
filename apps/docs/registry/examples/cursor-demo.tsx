import { ArrowUpRightIcon } from "lucide-react"

import { Cursor } from "@/registry/ui/cursor"

export default function CursorDemo() {
  return (
    <div className="bg-muted/40 relative flex h-64 w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border">
      <Cursor attachToParent>
        <span className="bg-foreground text-background flex size-12 items-center justify-center rounded-full">
          <ArrowUpRightIcon className="size-5" />
        </span>
      </Cursor>
      <div className="text-center">
        <p className="text-sm font-medium">把鼠标移入此区域</p>
        <p className="text-muted-foreground mt-1 text-sm">
          自定义光标以弹簧跟随指针，只在当前区域内生效
        </p>
      </div>
    </div>
  )
}
