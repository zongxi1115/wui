import { InboxIcon } from "lucide-react"
import { Button } from "@/registry/ui/button"
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from "@/registry/ui/empty-state"

export default function EmptyStateCompact() {
  return (
    <div className="w-full max-w-sm rounded-lg border bg-card p-4">
      <EmptyState size="sm">
        <EmptyStateIcon>
          <InboxIcon className="size-4 text-muted-foreground" />
        </EmptyStateIcon>
        <EmptyStateTitle className="text-sm">暂无新通知</EmptyStateTitle>
        <EmptyStateDescription className="text-xs">
          当有关于你的提及、任务指派或系统更新时，会在此处展示。
        </EmptyStateDescription>
        <EmptyStateActions className="mt-3">
          <Button size="sm" variant="outline" className="h-7 text-xs">
            通知偏好设置
          </Button>
        </EmptyStateActions>
      </EmptyState>
    </div>
  )
}
