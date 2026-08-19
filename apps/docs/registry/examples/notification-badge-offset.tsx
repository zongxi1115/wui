import { NotificationBadge } from "@/registry/ui/notification-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar"
import { Button } from "@/registry/ui/button"

export default function NotificationBadgeOffset() {
  return (
    <div className="flex flex-wrap items-center gap-10">
      <div className="flex flex-col items-center gap-2">
        <NotificationBadge dot variant="success" offset={[-2, 2]}>
          <Avatar>
            <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" alt="Avatar" />
            <AvatarFallback>LC</AvatarFallback>
          </Avatar>
        </NotificationBadge>
        <span className="text-xs text-muted-foreground">圆形头像在线点 (offset=[-2, 2])</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <NotificationBadge count={6} offset={[4, -4]}>
          <Button variant="outline">控制台消息</Button>
        </NotificationBadge>
        <span className="text-xs text-muted-foreground">按钮外扩 (offset=[4, -4])</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <NotificationBadge count="HOT" variant="destructive" offset={[6, -2]}>
          <span className="text-sm font-medium">新版特性</span>
        </NotificationBadge>
        <span className="text-xs text-muted-foreground">纯文本标签徽标</span>
      </div>
    </div>
  )
}
