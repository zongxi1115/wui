import { HeartIcon } from "@animateicons/react/lucide"

import {
  AnimatedIcon,
  type AnimatedIconColor,
} from "@/registry/ui/animated-icon"

const colors: Array<{ variant: AnimatedIconColor; label: string }> = [
  { variant: "default", label: "Default" },
  { variant: "primary", label: "Primary" },
  { variant: "secondary", label: "Secondary" },
  { variant: "muted", label: "Muted" },
  { variant: "info", label: "Info" },
  { variant: "success", label: "Success" },
  { variant: "warning", label: "Warning" },
  { variant: "destructive", label: "Destructive" },
]

export default function AnimatedIconColors() {
  return (
    <div className="flex flex-wrap items-end gap-x-5 gap-y-4">
      {colors.map(({ variant, label }) => (
        <div
          key={variant}
          className="flex min-w-16 flex-col items-center gap-2"
        >
          <AnimatedIcon
            icon={HeartIcon}
            variant={variant}
            size={24}
            label={label}
          />
          <span className="text-muted-foreground text-xs">{label}</span>
        </div>
      ))}
    </div>
  )
}
