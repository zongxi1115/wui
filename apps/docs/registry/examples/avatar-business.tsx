import { MoreHorizontalIcon } from "lucide-react"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"

const members = [
  {
    name: "林晓雯",
    email: "xiaowen.lin@acme.cn",
    role: "所有者",
    status: "online" as const,
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    name: "陈嘉树",
    email: "jiashu.chen@acme.cn",
    role: "管理员",
    status: "busy" as const,
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    name: "许安然",
    email: "anran.xu@acme.cn",
    role: "成员",
    status: "away" as const,
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  },
]

export default function AvatarBusiness() {
  return (
    <div className="w-full max-w-md">
      <div className="flex items-baseline justify-between pb-3">
        <h4 className="text-sm font-semibold">项目成员</h4>
        <span className="text-muted-foreground text-xs">3 / 10 个席位</span>
      </div>

      <div className="divide-y border-y">
        {members.map((member) => (
          <div key={member.email} className="flex items-center gap-3 py-3">
            <Avatar>
              <AvatarImage src={member.src} alt={member.name} />
              <AvatarFallback>{member.name.slice(0, 1)}</AvatarFallback>
              <AvatarBadge status={member.status} />
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{member.name}</div>
              <div className="text-muted-foreground truncate text-xs">
                {member.email}
              </div>
            </div>
            <Badge
              variant={member.role === "所有者" ? "default" : "secondary"}
              size="sm"
            >
              {member.role}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground size-8"
              aria-label={`管理 ${member.name}`}
            >
              <MoreHorizontalIcon />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
