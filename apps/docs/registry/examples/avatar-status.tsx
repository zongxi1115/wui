import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
  type AvatarBadgeProps,
} from "@/registry/ui/avatar"

const members: Array<{
  name: string
  src: string
  status: NonNullable<AvatarBadgeProps["status"]>
  label: string
}> = [
  {
    name: "林晓雯",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    status: "online",
    label: "在线",
  },
  {
    name: "陈嘉树",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    status: "away",
    label: "离开",
  },
  {
    name: "周沐阳",
    src: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    status: "busy",
    label: "会议中",
  },
  {
    name: "许安然",
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    status: "offline",
    label: "离线",
  },
]

export default function AvatarStatus() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      {members.map((member) => (
        <div key={member.name} className="flex flex-col items-center gap-2">
          <Avatar>
            <AvatarImage src={member.src} alt={member.name} />
            <AvatarFallback>{member.name.slice(0, 1)}</AvatarFallback>
            <AvatarBadge status={member.status} />
          </Avatar>
          <span className="text-muted-foreground text-xs">{member.label}</span>
        </div>
      ))}
    </div>
  )
}
