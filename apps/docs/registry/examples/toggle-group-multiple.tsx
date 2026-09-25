import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/registry/ui/toggle-group"

export default function ToggleGroupMultiple() {
  return (
    <ToggleGroup type="multiple" defaultValue={["bold"]} aria-label="文字格式">
      <ToggleGroupItem value="bold" aria-label="加粗">
        <BoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="斜体">
        <ItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="下划线">
        <UnderlineIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="strikethrough" aria-label="删除线">
        <StrikethroughIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
