"use client"

import * as React from "react"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/ui/accordion"

export default function AccordionDemo() {
  const [variant, setVariant] = React.useState<"default" | "bordered" | "separated">("bordered")

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant={variant === "bordered" ? "default" : "outline"}
          size="sm"
          onClick={() => setVariant("bordered")}
        >
          Bordered (边框卡片)
        </Button>
        <Button
          variant={variant === "separated" ? "default" : "outline"}
          size="sm"
          onClick={() => setVariant("separated")}
        >
          Separated (独立间距)
        </Button>
        <Button
          variant={variant === "default" ? "default" : "outline"}
          size="sm"
          onClick={() => setVariant("default")}
        >
          Default (通栏分割)
        </Button>
      </div>

      <Accordion
        type="single"
        collapsible
        defaultValue="item-1"
        variant={variant}
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <span>什么是 wui 组件库的设计原则？</span>
              <Badge variant="secondary" className="text-[10px] py-0">核心</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            wui 坚持代码所有权原则，组件直接拷贝至项目内按需管理。采用 Tailwind CSS v4 与 OKLCH 语义化设计 Token，兼具极简结构、清晰密度与出色手感。
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <span>如何配置无障碍与键盘导航？</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            所有交互状态完全基于 Radix UI 无障碍规范，原生支持 Tab、方向键切换焦点、Enter/Space 展开折叠，并完整绑定 WAI-ARIA 属性。
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <span>支持平滑动效与减弱动效降级吗？</span>
              <Badge variant="outline" className="text-[10px] py-0">Motion</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            内置展开与折叠高度缓动曲线。当系统开启 prefers-reduced-motion 时，自动切除过渡动画并瞬时呈现终态，保障阅读体验。
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
