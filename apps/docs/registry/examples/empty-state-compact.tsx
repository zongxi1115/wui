import { BellOffIcon, Settings2Icon } from "lucide-react"

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
    <div className="bg-popover text-popover-foreground w-full max-w-xs rounded-lg border shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-2.5">
        <p className="text-sm font-medium">通知</p>
        <Button size="icon" variant="ghost" className="size-7" aria-label="通知设置">
          <Settings2Icon />
        </Button>
      </div>
      <EmptyState size="sm">
        <EmptyStateIcon>
          <BellOffIcon />
        </EmptyStateIcon>
        <EmptyStateTitle className="text-sm">暂无新通知</EmptyStateTitle>
        <EmptyStateDescription className="text-xs leading-5">
          有人提及你、指派任务或审批状态变化时，会在这里提醒。
        </EmptyStateDescription>
        <EmptyStateActions className="mt-4">
          <Button size="sm" variant="outline">
            查看历史通知
          </Button>
        </EmptyStateActions>
      </EmptyState>
    </div>
  )
}
