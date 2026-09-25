import { PlusIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"

export default function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="outline">
        紧凑
      </Button>
      <Button size="default" variant="outline">
        标准
      </Button>
      <Button size="lg" variant="outline">
        突出
      </Button>
      <Button size="icon" variant="outline" aria-label="新建">
        <PlusIcon />
      </Button>
    </div>
  )
}
