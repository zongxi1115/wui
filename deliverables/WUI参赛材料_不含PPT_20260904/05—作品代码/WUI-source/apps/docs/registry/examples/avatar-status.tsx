import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/registry/ui/avatar"

export default function AvatarStatus() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Avatar>
          <AvatarImage
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            alt="Online User"
          />
          <AvatarFallback>ON</AvatarFallback>
          <AvatarBadge status="online" />
        </Avatar>
        <span className="text-xs text-muted-foreground">在线 (online)</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Avatar>
          <AvatarImage
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
            alt="Away User"
          />
          <AvatarFallback>AW</AvatarFallback>
          <AvatarBadge status="away" />
        </Avatar>
        <span className="text-xs text-muted-foreground">离开 (away)</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Avatar>
          <AvatarImage
            src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"
            alt="Busy User"
          />
          <AvatarFallback>BS</AvatarFallback>
          <AvatarBadge status="busy" />
        </Avatar>
        <span className="text-xs text-muted-foreground">忙碌 (busy)</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Avatar>
          <AvatarImage
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
            alt="Offline User"
          />
          <AvatarFallback>OF</AvatarFallback>
          <AvatarBadge status="offline" />
        </Avatar>
        <span className="text-xs text-muted-foreground">离线 (offline)</span>
      </div>
    </div>
  )
}
