import { Settings2Icon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/ui/dialog"

export default function DialogLayout() {
  return (
    <div className="w-full max-w-md">
      <Dialog variant="inline">
        <DialogTrigger asChild>
          <Button variant="outline">
            <Settings2Icon />
            Workspace access
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Workspace access</DialogTitle>
            <DialogDescription>
              Update how members discover and request access to this workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1">
            <label htmlFor="workspace-name" className="text-xs font-medium">
              Workspace name
            </label>
            <input
              id="workspace-name"
              defaultValue="Northstar Design"
              className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" defaultChecked className="size-4 accent-primary" />
            Allow members to request access
          </label>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button size="sm">Save changes</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
