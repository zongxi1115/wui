import { BotIcon, SparklesIcon, UserRoundIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar"

export default function AvatarFallbackDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      {/* Fallback with text initials */}
      <Avatar>
        <AvatarImage src="https://invalid-image-url.com/broken.jpg" alt="Zhang San" />
        <AvatarFallback>张三</AvatarFallback>
      </Avatar>

      {/* Fallback with user icon */}
      <Avatar>
        <AvatarFallback>
          <UserRoundIcon className="size-4" />
        </AvatarFallback>
      </Avatar>

      {/* Fallback with customized primary brand theme */}
      <Avatar>
        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
          AI
        </AvatarFallback>
      </Avatar>

      {/* Fallback with bot icon */}
      <Avatar>
        <AvatarFallback className="bg-violet-500/15 text-violet-600 dark:text-violet-400">
          <BotIcon className="size-4" />
        </AvatarFallback>
      </Avatar>

      {/* Fallback with sparkles */}
      <Avatar>
        <AvatarFallback className="bg-amber-500/15 text-amber-600 dark:text-amber-400">
          <SparklesIcon className="size-4" />
        </AvatarFallback>
      </Avatar>
    </div>
  )
}
