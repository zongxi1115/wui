import { CheckIcon } from "lucide-react"

import { AuroraBackground } from "@/registry/ui/aurora-background"
import { Button } from "@/registry/ui/button"

const perks = ["无限项目与成员", "高级动效预设", "优先技术支持"]

export default function AuroraBackgroundCard() {
  return (
    <AuroraBackground
      colors={["var(--chart-5)", "var(--chart-1)", "var(--chart-2)"]}
      duration={14}
      blur={40}
      className="w-full max-w-sm rounded-lg border p-6"
    >
      <p className="text-muted-foreground text-sm">专业版</p>
      <p className="mt-2">
        <span className="text-4xl font-semibold tracking-tight">¥68</span>
        <span className="text-muted-foreground text-sm"> / 月</span>
      </p>
      <ul className="mt-6 space-y-2.5 text-sm">
        {perks.map((perk) => (
          <li key={perk} className="flex items-center gap-2">
            <CheckIcon className="size-4" />
            {perk}
          </li>
        ))}
      </ul>
      <Button className="mt-8 w-full">升级到专业版</Button>
    </AuroraBackground>
  )
}
