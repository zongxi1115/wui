import { ItalicIcon } from "lucide-react"

import { Toggle } from "@/registry/ui/toggle"

export default function ToggleSizes() {
  return (
    <div className="flex items-center gap-3">
      <Toggle size="sm" aria-label="小号斜体">
        <ItalicIcon />
      </Toggle>
      <Toggle aria-label="默认斜体">
        <ItalicIcon />
      </Toggle>
      <Toggle size="lg" variant="outline" aria-label="大号斜体">
        <ItalicIcon />
      </Toggle>
    </div>
  )
}
