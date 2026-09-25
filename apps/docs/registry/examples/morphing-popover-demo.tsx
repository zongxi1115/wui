import { PlusIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  MorphingPopover,
  MorphingPopoverClose,
  MorphingPopoverContent,
  MorphingPopoverTrigger,
} from "@/registry/ui/morphing-popover"
import { Textarea } from "@/registry/ui/textarea"

export default function MorphingPopoverDemo() {
  return (
    <MorphingPopover>
      <MorphingPopoverTrigger>
        <PlusIcon className="mr-2 size-4" />
        添加备注
      </MorphingPopoverTrigger>
      <MorphingPopoverContent>
        <label htmlFor="quick-note" className="text-sm font-medium">
          快速备注
        </label>
        <Textarea
          id="quick-note"
          rows={3}
          resize="none"
          placeholder="记录一个想法…"
          className="mt-2"
        />
        <div className="mt-3 flex justify-end gap-2">
          <MorphingPopoverClose asChild>
            <Button variant="ghost" size="sm">
              取消
            </Button>
          </MorphingPopoverClose>
          <MorphingPopoverClose asChild>
            <Button size="sm">保存</Button>
          </MorphingPopoverClose>
        </div>
      </MorphingPopoverContent>
    </MorphingPopover>
  )
}
