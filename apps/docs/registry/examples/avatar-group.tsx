import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/registry/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/ui/tooltip"

const team = [
  {
    name: "林晓雯 · 产品经理",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    fallback: "林",
  },
  {
    name: "陈嘉树 · 前端工程师",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    fallback: "陈",
  },
  {
    name: "周沐阳 · 后端工程师",
    src: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    fallback: "周",
  },
  {
    name: "许安然 · 交互设计师",
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    fallback: "许",
  },
]

export default function AvatarGroupDemo() {
  return (
    <TooltipProvider delayDuration={120}>
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center gap-3">
          <AvatarGroup spreadOnHover>
            {team.map((member) => (
              <Tooltip key={member.name}>
                <TooltipTrigger asChild>
                  <Avatar>
                    <AvatarImage src={member.src} alt={member.name} />
                    <AvatarFallback>{member.fallback}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent size="sm">{member.name}</TooltipContent>
              </Tooltip>
            ))}
            <AvatarGroupCount>+8</AvatarGroupCount>
          </AvatarGroup>
          <span className="text-muted-foreground text-xs">悬停展开成员</span>
        </div>

        <div className="flex items-center gap-3">
          <AvatarGroup>
            {team.slice(0, 3).map((member) => (
              <Avatar key={member.name} size="sm">
                <AvatarImage src={member.src} alt={member.name} />
                <AvatarFallback>{member.fallback}</AvatarFallback>
              </Avatar>
            ))}
            <AvatarGroupCount size="sm">+15</AvatarGroupCount>
          </AvatarGroup>
          <span className="text-muted-foreground text-xs">
            18 人参与本次评审
          </span>
        </div>
      </div>
    </TooltipProvider>
  )
}
