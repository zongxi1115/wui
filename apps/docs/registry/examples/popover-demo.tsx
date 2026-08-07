import { InfoIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/ui/popover"

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <InfoIcon />
          查看说明
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <div className="space-y-2">
          <PopoverTitle>自动保存</PopoverTitle>
          <PopoverDescription>
            编辑内容会实时保存到云端，你可以随时离开当前页面。
          </PopoverDescription>
        </div>
      </PopoverContent>
    </Popover>
  )
}
