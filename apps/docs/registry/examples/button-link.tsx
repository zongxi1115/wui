import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"

export default function ButtonLink() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="link">查看更新日志</Button>
      <Button variant="link">
        了解计费规则
        <ArrowRightIcon />
      </Button>
    </div>
  )
}
