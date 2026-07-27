import { PlusIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  MorphingPopover,
  MorphingPopoverClose,
  MorphingPopoverContent,
  MorphingPopoverTrigger,
} from "@/registry/ui/morphing-popover"

export default function MorphingPopoverDemo() {
  return (
    <MorphingPopover>
      <MorphingPopoverTrigger>
        <PlusIcon className="mr-2 size-4" />
        Add note
      </MorphingPopoverTrigger>
      <MorphingPopoverContent>
        <label htmlFor="quick-note" className="text-sm font-medium">
          Quick note
        </label>
        <textarea
          id="quick-note"
          rows={4}
          placeholder="Capture a thought…"
          className="bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 mt-2 w-full resize-none rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
        />
        <div className="mt-3 flex justify-end gap-2">
          <MorphingPopoverClose asChild>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
          </MorphingPopoverClose>
          <MorphingPopoverClose asChild>
            <Button size="sm">Add note</Button>
          </MorphingPopoverClose>
        </div>
      </MorphingPopoverContent>
    </MorphingPopover>
  )
}
