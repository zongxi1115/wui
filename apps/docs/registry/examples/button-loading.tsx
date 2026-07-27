import { Loader2Icon } from "lucide-react"

import { Button } from "@/registry/ui/button"

export default function ButtonLoading() {
  return (
    <Button disabled>
      <Loader2Icon className="animate-spin" />
      Please wait
    </Button>
  )
}
