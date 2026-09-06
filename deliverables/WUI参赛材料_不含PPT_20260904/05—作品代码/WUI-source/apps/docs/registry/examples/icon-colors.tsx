import { SparklesIcon } from "lucide-react"

import { Icon, type IconColor } from "@/registry/ui/icon"

const colors: Array<{ variant: IconColor; label: string }> = [
  { variant: "default", label: "Default" },
  { variant: "primary", label: "Primary" },
  { variant: "secondary", label: "Secondary" },
  { variant: "muted", label: "Muted" },
  { variant: "info", label: "Info" },
  { variant: "success", label: "Success" },
  { variant: "warning", label: "Warning" },
  { variant: "destructive", label: "Destructive" },
]

export default function IconColors() {
  return (
    <div className="flex flex-wrap items-end gap-x-5 gap-y-4">
      {colors.map(({ variant, label }) => (
        <div
          key={variant}
          className="flex min-w-16 flex-col items-center gap-2"
        >
          <Icon icon={SparklesIcon} variant={variant} size="lg" />
          <span className="text-muted-foreground text-xs">{label}</span>
        </div>
      ))}
    </div>
  )
}
