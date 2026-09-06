import {
  BellIcon,
  CheckIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react"

import { Icon } from "@/registry/ui/icon"

const examples = [SearchIcon, UserIcon, BellIcon, SettingsIcon, CheckIcon]

export default function IconDemo() {
  return (
    <div className="text-foreground flex items-center gap-5">
      {examples.map((icon, index) => (
        <Icon
          key={index}
          icon={icon}
          size={index === 4 ? 28 : "lg"}
          strokeWidth={1.8}
        />
      ))}
    </div>
  )
}
