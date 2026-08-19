"use client"

import * as React from "react"
import { Sparkles, CheckCircle2 } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { ColorPicker } from "@/registry/ui/color-picker"

export default function ColorPickerForm() {
  const [primaryColor, setPrimaryColor] = React.useState("oklch(0.546 0.245 262.881)")
  const [accentColor, setAccentColor] = React.useState("oklch(0.666 0.179 58.318)")
  const [surfaceColor, setSurfaceColor] = React.useState("oklch(0.97 0.01 260)")
  const [saved, setSaved] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground shadow-xs">
      <div className="flex items-center gap-2 border-b pb-3">
        <Sparkles className="size-4 text-primary" />
        <h4 className="text-sm font-semibold">企业租户门户主题定制</h4>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-foreground">品牌主色 (Primary)</span>
            <span className="text-[11px] text-muted-foreground">导航栏、主按钮及高亮链接</span>
          </div>
          <ColorPicker value={primaryColor} onValueChange={setPrimaryColor} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-foreground">视觉强调色 (Accent)</span>
            <span className="text-[11px] text-muted-foreground">通知角标、图表关键数据序列</span>
          </div>
          <ColorPicker value={accentColor} onValueChange={setAccentColor} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-foreground">容器底色 (Surface Tint)</span>
            <span className="text-[11px] text-muted-foreground">卡片底板与轻度背景微着色</span>
          </div>
          <ColorPicker value={surfaceColor} onValueChange={setSurfaceColor} />
        </div>
      </div>

      {/* Live Preview Card */}
      <div
        className="flex items-center justify-between rounded-lg p-3 border transition-colors duration-200"
        style={{ backgroundColor: surfaceColor }}
      >
        <span className="text-xs font-medium text-foreground">实时组件预览效果</span>
        <button
          type="button"
          className="rounded-md px-2.5 py-1 text-xs font-medium text-white shadow-xs"
          style={{ backgroundColor: primaryColor }}
        >
          主题按钮
        </button>
      </div>

      <div className="flex items-center justify-between pt-1">
        {saved ? (
          <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            主题色彩方案已保存
          </span>
        ) : <span />}
        <Button type="submit" size="sm">
          保存色彩方案
        </Button>
      </div>
    </form>
  )
}
