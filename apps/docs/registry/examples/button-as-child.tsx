import { ArrowUpRightIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"

export default function ButtonAsChild() {
  return (
    <Button asChild variant="outline">
      <a href="#button">
        前往控制台
        <ArrowUpRightIcon />
      </a>
    </Button>
  )
}
