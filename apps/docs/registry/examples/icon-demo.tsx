import { BellIcon } from "lucide-react"

import { Icon, iconSizes, type IconSize } from "@/registry/ui/icon"

const sizes = Object.keys(iconSizes) as IconSize[]

export default function IconDemo() {
  return (
    <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
      {sizes.map((size) => (
        <div key={size} className="flex min-w-12 flex-col items-center gap-2">
          <Icon icon={BellIcon} size={size} strokeWidth={1.75} />
          <span className="text-muted-foreground font-mono text-xs">
            {size} · {iconSizes[size]}
          </span>
        </div>
      ))}
    </div>
  )
}
