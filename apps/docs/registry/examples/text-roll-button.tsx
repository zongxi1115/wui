import { ArrowUpRightIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextRoll } from "@/registry/ui/text-roll"

export default function TextRollButton() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button className="group">
        <TextRoll trigger="parent" duration={0.35}>
          免费试用 14 天
        </TextRoll>
        <ArrowUpRightIcon className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Button>
      <Button variant="outline">
        <TextRoll trigger="parent" duration={0.35}>
          预约产品演示
        </TextRoll>
      </Button>
    </div>
  )
}
