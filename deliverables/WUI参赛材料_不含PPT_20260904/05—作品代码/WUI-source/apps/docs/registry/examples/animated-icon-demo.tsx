import {
  BellRingIcon,
  CopyIcon,
  HeartIcon,
  MenuIcon,
  SettingsIcon,
} from "@animateicons/react/lucide"

import {
  AnimatedIcon,
  type AnimatedIconGlyph,
} from "@/registry/ui/animated-icon"

const examples: Array<{ icon: AnimatedIconGlyph; label: string }> = [
  { icon: BellRingIcon, label: "通知" },
  { icon: CopyIcon, label: "复制" },
  { icon: HeartIcon, label: "收藏" },
  { icon: MenuIcon, label: "菜单" },
  { icon: SettingsIcon, label: "设置" },
]

export default function AnimatedIconDemo() {
  return (
    <div className="flex flex-wrap items-start gap-3">
      {examples.map(({ icon, label }) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <AnimatedIcon
            icon={icon}
            label={label}
            size={24}
            className="bg-background hover:bg-muted focus-visible:ring-ring/40 flex size-12 items-center justify-center rounded-md border outline-none transition-colors focus-visible:ring-[3px]"
            tabIndex={0}
          />
          <span className="text-muted-foreground text-xs">{label}</span>
        </div>
      ))}
    </div>
  )
}
