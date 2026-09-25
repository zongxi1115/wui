import type { ReactNode } from "react"

import { Kbd, KbdGroup } from "@/registry/ui/kbd"

export default function KbdDemo() {
  return (
    <div className="w-full max-w-sm divide-y border-y text-sm">
      <Shortcut label="打开全局搜索">
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </Shortcut>
      <Shortcut label="保存更改">
        <Kbd>Ctrl</Kbd>
        <Kbd>S</Kbd>
      </Shortcut>
      <Shortcut label="关闭面板">
        <Kbd>Esc</Kbd>
      </Shortcut>
    </div>
  )
}

function Shortcut({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <span>{label}</span>
      <KbdGroup>{children}</KbdGroup>
    </div>
  )
}
