import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/registry/ui/avatar"

const team = [
  {
    name: "Alex Rivera",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    fallback: "AR",
  },
  {
    name: "Sarah Chen",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    fallback: "SC",
  },
  {
    name: "Michael Scott",
    src: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    fallback: "MS",
  },
  {
    name: "Emily Davis",
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    fallback: "ED",
  },
]

export default function AvatarGroupDemo() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex items-center gap-3">
        <AvatarGroup>
          {team.map((member) => (
            <Avatar key={member.name} size="sm">
              <AvatarImage src={member.src} alt={member.name} />
              <AvatarFallback>{member.fallback}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount size="sm">+8</AvatarGroupCount>
        </AvatarGroup>
        <span className="text-xs text-muted-foreground">小尺寸团队列表</span>
      </div>

      <div className="flex items-center gap-3">
        <AvatarGroup>
          {team.slice(0, 3).map((member) => (
            <Avatar key={member.name}>
              <AvatarImage src={member.src} alt={member.name} />
              <AvatarFallback>{member.fallback}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount>+15</AvatarGroupCount>
        </AvatarGroup>
        <span className="text-xs text-muted-foreground">标准尺寸带剩余计数</span>
      </div>
    </div>
  )
}
