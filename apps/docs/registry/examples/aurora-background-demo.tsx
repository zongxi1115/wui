import { ArrowRightIcon } from "lucide-react"

import { AuroraBackground } from "@/registry/ui/aurora-background"
import { Button } from "@/registry/ui/button"

export default function AuroraBackgroundDemo() {
  return (
    <AuroraBackground
      interactive
      className="flex min-h-[26rem] w-full items-center justify-center rounded-b-lg px-6 py-16"
    >
      <div className="mx-auto max-w-xl text-center">
        <p className="text-muted-foreground text-sm">WUI 2.0 · 动效版本</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          让界面有呼吸感
        </h2>
        <p className="text-muted-foreground mx-auto mt-4 max-w-md leading-7">
          一套以动效为先的组件库。滚动、悬停与转场都经过调校，默认克制，按需生动。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button>
            开始使用
            <ArrowRightIcon />
          </Button>
          <Button variant="outline">查看组件</Button>
        </div>
      </div>
    </AuroraBackground>
  )
}
