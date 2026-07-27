import { ArrowUpRightIcon } from "lucide-react"

import { Cursor } from "@/registry/ui/cursor"

export default function CursorDemo() {
  return (
    <div className="bg-muted/30 relative flex h-64 w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border">
      <Cursor attachToParent>
        <span className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-full shadow-sm">
          <ArrowUpRightIcon className="size-5" />
        </span>
      </Cursor>
      <div className="text-center">
        <p className="font-medium">Move inside this area</p>
        <p className="text-muted-foreground mt-1 text-sm">
          弹簧光标仅附着在当前区域
        </p>
      </div>
    </div>
  )
}
