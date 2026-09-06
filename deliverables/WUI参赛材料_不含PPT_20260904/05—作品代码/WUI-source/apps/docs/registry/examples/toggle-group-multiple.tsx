import { AlignCenterIcon, BoldIcon, ItalicIcon } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/registry/ui/toggle-group"

export default function ToggleGroupMultiple() {
  return (
    <ToggleGroup type="multiple" defaultValue={["bold"]} aria-label="文本格式">
      <ToggleGroupItem value="bold" aria-label="粗体">
        <BoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="斜体">
        <ItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="居中">
        <AlignCenterIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
