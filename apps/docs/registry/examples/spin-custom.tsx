"use client"

import { SparklesIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Spin, SpinIndicator } from "@/registry/ui/spin"

export default function SpinCustom() {
  return (
    <div className="grid w-full max-w-lg gap-8">
      <div className="grid grid-cols-3 gap-6">
        <Spin label="同步中" />
        <Spin variant="dots" label="正在生成" />
        <Spin
          label="智能解析中"
          indicator={
            <span className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full">
              <SparklesIcon className="size-4 animate-pulse" />
            </span>
          }
        />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 border-t pt-6">
        <Button disabled>
          <SpinIndicator size="sm" className="text-current" />
          提交中
        </Button>
        <Button variant="outline" disabled>
          <SpinIndicator size="sm" variant="dots" className="text-current" />
          正在加载更多
        </Button>
      </div>
    </div>
  )
}
