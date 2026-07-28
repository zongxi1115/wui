import { BotIcon, UserRoundIcon } from "lucide-react"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/registry/ui/avatar"

export default function AvatarDemo() {
  return (
    <div className="flex items-end gap-5">
      <Avatar size="sm">
        <AvatarFallback>W</AvatarFallback>
      </Avatar>

      <Avatar>
        <AvatarImage
          src="https://github.com/shadcn.png"
          alt="Shadcn"
        />
        <AvatarFallback>SC</AvatarFallback>
        <AvatarBadge status="online" />
      </Avatar>

      <Avatar size="lg">
        <AvatarFallback>
          <UserRoundIcon className="size-5" />
        </AvatarFallback>
        <AvatarBadge status="busy" />
      </Avatar>

      <Avatar>
        <AvatarFallback className="bg-primary text-primary-foreground">
          <BotIcon className="size-4" />
        </AvatarFallback>
      </Avatar>
    </div>
  )
}
