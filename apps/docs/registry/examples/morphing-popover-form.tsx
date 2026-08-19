import * as React from "react"
import { SendIcon, SparklesIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  MorphingPopover,
  MorphingPopoverClose,
  MorphingPopoverContent,
  MorphingPopoverTrigger,
} from "@/registry/ui/morphing-popover"

export default function MorphingPopoverForm() {
  const [feedback, setFeedback] = React.useState("")

  return (
    <div className="flex w-full items-center justify-center p-8">
      <MorphingPopover>
        <MorphingPopoverTrigger>
          <SparklesIcon className="mr-2 size-4 text-warning" />
          Give Feedback
        </MorphingPopoverTrigger>
        <MorphingPopoverContent className="w-80">
          <div className="flex items-center gap-2">
            <SparklesIcon className="size-4 text-warning" />
            <h4 className="text-sm font-semibold">Share Your Feedback</h4>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Help us improve the WUI design system and component architecture.
          </p>

          <div className="mt-3">
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What worked well? What felt confusing?"
              className="bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 w-full resize-none rounded-md border px-3 py-2 text-xs outline-none focus-visible:ring-[3px]"
            />
          </div>

          <div className="mt-3 flex items-center justify-between border-t pt-3">
            <span className="text-[10px] text-muted-foreground">
              Directly delivered to DX team
            </span>
            <div className="flex gap-2">
              <MorphingPopoverClose asChild>
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
              </MorphingPopoverClose>
              <MorphingPopoverClose asChild>
                <Button size="sm" disabled={!feedback.trim()}>
                  <SendIcon className="mr-1 size-3" />
                  Send
                </Button>
              </MorphingPopoverClose>
            </div>
          </div>
        </MorphingPopoverContent>
      </MorphingPopover>
    </div>
  )
}
