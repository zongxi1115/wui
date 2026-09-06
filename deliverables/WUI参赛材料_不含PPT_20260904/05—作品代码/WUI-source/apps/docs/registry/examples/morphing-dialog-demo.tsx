import { BellRingIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from "@/registry/ui/morphing-dialog"

export default function MorphingDialogDemo() {
  return (
    <MorphingDialog>
      <MorphingDialogTrigger>
        <BellRingIcon className="mr-2 size-4" />
        Notification settings
      </MorphingDialogTrigger>
      <MorphingDialogContent>
        <MorphingDialogTitle>Notification settings</MorphingDialogTitle>
        <MorphingDialogSubtitle>
          Choose what deserves your attention.
        </MorphingDialogSubtitle>
        <MorphingDialogDescription>
          Product updates and account activity are enabled. You can change these
          preferences at any time.
        </MorphingDialogDescription>
        <div className="mt-5 space-y-3 border-y py-4 text-sm">
          {[
            ["Account activity", "Security and billing changes"],
            ["Product updates", "A concise weekly digest"],
          ].map(([label, detail]) => (
            <label
              key={label}
              className="flex items-center justify-between gap-6"
            >
              <span>
                <span className="block font-medium">{label}</span>
                <span className="text-muted-foreground">{detail}</span>
              </span>
              <input
                type="checkbox"
                defaultChecked
                className="accent-primary size-4"
              />
            </label>
          ))}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <MorphingDialogClose asChild>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
          </MorphingDialogClose>
          <MorphingDialogClose asChild>
            <Button size="sm">Save changes</Button>
          </MorphingDialogClose>
        </div>
        <MorphingDialogClose />
      </MorphingDialogContent>
    </MorphingDialog>
  )
}
