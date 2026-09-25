"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { Button } from "@/registry/ui/button"
import { ColorPicker } from "@/registry/ui/color-picker"

const initialTheme = {
  primary: "oklch(0.546 0.245 262.881)", // wui-token-audit-allow -- user-picked sample color
  accent: "oklch(0.666 0.179 58.318)", // wui-token-audit-allow -- user-picked sample color
  surface: "oklch(0.97 0.01 260)", // wui-token-audit-allow -- user-picked sample color
}

type ThemeKey = keyof typeof initialTheme

const fields: Array<{ key: ThemeKey; label: string; description: string }> = [
  { key: "primary", label: "主色", description: "主按钮、选中态与链接" },
  { key: "accent", label: "强调色", description: "角标与图表关键序列" },
  { key: "surface", label: "页面底色", description: "卡片与页面背景" },
]

/** Picks black or white text for any background via CSS relative color syntax. */
function readableOn(color: string) {
  return `oklch(from ${color} clamp(0, (0.68 - l) * 100, 1) 0 0)` // wui-token-audit-allow -- computed contrast color
}

export default function ColorPickerForm() {
  const reduceMotion = useReducedMotion()
  const [theme, setTheme] = React.useState(initialTheme)
  const [saved, setSaved] = React.useState(false)

  return (
    <form
      className="grid w-full max-w-md gap-5"
      onSubmit={(event) => {
        event.preventDefault()
        setSaved(true)
      }}
    >
      <div className="grid gap-3">
        {fields.map((field) => (
          <div key={field.key} className="flex items-center justify-between gap-4">
            <div className="grid gap-1">
              <span className="text-sm font-medium leading-none">{field.label}</span>
              <span className="text-muted-foreground text-xs">{field.description}</span>
            </div>
            <ColorPicker
              label={`选择${field.label}`}
              value={theme[field.key]}
              onValueChange={(value) => {
                setTheme((current) => ({ ...current, [field.key]: value }))
                setSaved(false)
              }}
            />
          </div>
        ))}
      </div>

      <div
        className="grid gap-3 rounded-lg border p-4 transition-colors duration-200"
        style={{ backgroundColor: theme.surface, color: readableOn(theme.surface) }}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">季度增长报告</span>
          <span
            className="rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors duration-200"
            style={{ backgroundColor: theme.accent, color: readableOn(theme.accent) }}
          >
            新
          </span>
        </div>
        <p className="text-xs opacity-70">预览会随颜色调整实时更新。</p>
        <div className="flex gap-2">
          <span
            className="inline-flex h-8 items-center rounded-md px-3 text-xs font-medium transition-colors duration-200"
            style={{ backgroundColor: theme.primary, color: readableOn(theme.primary) }}
          >
            查看报告
          </span>
          <span
            className="inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium transition-colors duration-200"
            style={{ borderColor: theme.primary, color: theme.primary }}
          >
            导出
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <AnimatePresence initial={false}>
          {saved ? (
            <motion.span
              key="saved"
              className="text-success text-xs font-medium"
              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              配色方案已保存
            </motion.span>
          ) : (
            <span key="empty" />
          )}
        </AnimatePresence>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setTheme(initialTheme)
              setSaved(false)
            }}
          >
            恢复默认
          </Button>
          <Button type="submit">保存配色</Button>
        </div>
      </div>
    </form>
  )
}
