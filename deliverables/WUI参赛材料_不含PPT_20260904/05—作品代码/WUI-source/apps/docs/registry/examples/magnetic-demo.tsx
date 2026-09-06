import { ArrowUpRightIcon } from "lucide-react"

import { Magnetic } from "@/registry/ui/magnetic"

export default function MagneticDemo() {
  return (
    <div className="flex min-h-64 w-full items-center justify-center">
      <Magnetic>
        <button className="bg-foreground text-background inline-flex h-11 items-center gap-2 rounded-md px-5 text-sm font-medium shadow-sm">
          Move toward me
          <ArrowUpRightIcon className="size-4" />
        </button>
      </Magnetic>
    </div>
  )
}
