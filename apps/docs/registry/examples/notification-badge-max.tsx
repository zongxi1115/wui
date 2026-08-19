import { NotificationBadge } from "@/registry/ui/notification-badge"
import { Button } from "@/registry/ui/button"

export default function NotificationBadgeMax() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <NotificationBadge count={150} max={99}>
          <Button variant="outline" size="sm">
            收件箱
          </Button>
        </NotificationBadge>
        <span className="text-xs text-muted-foreground">默认 max=99 (显示 99+)</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <NotificationBadge count={25} max={9}>
          <Button variant="outline" size="sm">
            待审批
          </Button>
        </NotificationBadge>
        <span className="text-xs text-muted-foreground">紧凑 max=9 (显示 9+)</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <NotificationBadge count={0} showZero>
          <Button variant="outline" size="sm">
            未读工单
          </Button>
        </NotificationBadge>
        <span className="text-xs text-muted-foreground">showZero=true (显示 0)</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <NotificationBadge count={0}>
          <Button variant="outline" size="sm">
            正常状态
          </Button>
        </NotificationBadge>
        <span className="text-xs text-muted-foreground">count=0 默认自动隐藏</span>
      </div>
    </div>
  )
}
