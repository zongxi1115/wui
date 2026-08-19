import { BellIcon, MailIcon, ShieldAlertIcon, CheckCircle2Icon, InfoIcon } from "lucide-react"
import { Button } from "@/registry/ui/button"
import { NotificationBadge } from "@/registry/ui/notification-badge"

export default function NotificationBadgeVariants() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <NotificationBadge count={5} variant="destructive">
        <Button variant="outline" size="icon" aria-label="待处理严重告警">
          <BellIcon />
        </Button>
      </NotificationBadge>

      <NotificationBadge count={12} variant="default">
        <Button variant="outline" size="icon" aria-label="常规系统消息">
          <MailIcon />
        </Button>
      </NotificationBadge>

      <NotificationBadge dot variant="info">
        <Button variant="outline" size="icon" aria-label="版本更新提醒">
          <InfoIcon />
        </Button>
      </NotificationBadge>

      <NotificationBadge count={3} variant="warning">
        <Button variant="outline" size="icon" aria-label="安全凭证到期提醒">
          <ShieldAlertIcon />
        </Button>
      </NotificationBadge>

      <NotificationBadge dot variant="success">
        <Button variant="outline" size="icon" aria-label="自动化任务构建完成">
          <CheckCircle2Icon />
        </Button>
      </NotificationBadge>
    </div>
  )
}
