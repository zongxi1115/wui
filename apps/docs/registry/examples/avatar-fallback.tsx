import { BotIcon, UserRoundIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar"

export default function AvatarFallbackDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Avatar>
          <AvatarImage src="https://invalid-image-url.com/broken.jpg" alt="张三" />
          <AvatarFallback>张三</AvatarFallback>
        </Avatar>
        <span className="text-muted-foreground text-xs">姓名缩写</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Avatar>
          <AvatarFallback>
            <UserRoundIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <span className="text-muted-foreground text-xs">匿名用户</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            <BotIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <span className="text-muted-foreground text-xs">智能助理</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Avatar className="rounded-md">
          <AvatarFallback className="bg-info/15 text-info font-semibold">
            研
          </AvatarFallback>
        </Avatar>
        <span className="text-muted-foreground text-xs">团队 / 组织</span>
      </div>
    </div>
  )
}
