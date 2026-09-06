import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"

export default function ButtonLink() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="link">Hover me for the underline</Button>
      <Button variant="link">
        Learn more
        <ArrowRightIcon />
      </Button>
    </div>
  )
}
