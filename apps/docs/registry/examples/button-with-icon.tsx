import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"

export default function ButtonWithIcon() {
  return (
    <Button>
      Continue
      <ArrowRightIcon />
    </Button>
  )
}
