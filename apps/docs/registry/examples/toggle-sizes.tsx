import { ItalicIcon } from "lucide-react"

import { Toggle } from "@/registry/ui/toggle"

export default function ToggleSizes() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2">
        <Toggle size="sm" aria-label="斜体">
          <ItalicIcon />
        </Toggle>
        <Toggle aria-label="斜体">
          <ItalicIcon />
        </Toggle>
        <Toggle size="lg" aria-label="斜体">
          <ItalicIcon />
        </Toggle>
      </div>
      <div className="flex items-center gap-2">
        <Toggle size="sm" variant="outline" aria-label="斜体">
          <ItalicIcon />
        </Toggle>
        <Toggle variant="outline" aria-label="斜体">
          <ItalicIcon />
        </Toggle>
        <Toggle size="lg" variant="outline" aria-label="斜体">
          <ItalicIcon />
        </Toggle>
      </div>
    </div>
  )
}
