import { PlusIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHint,
  EmptyStateIllustration,
  EmptyStateMedia,
  EmptyStateTitle,
} from "@/registry/ui/empty-state"

export default function EmptyStateDemo() {
  return (
    <EmptyState className="rounded-lg border border-dashed">
      <EmptyStateMedia>
        <EmptyStateIllustration name="empty-folder" />
      </EmptyStateMedia>
      <EmptyStateTitle>还没有项目</EmptyStateTitle>
      <EmptyStateDescription>
        创建第一个项目，把任务、文件和讨论集中在一个清晰的工作空间里。
      </EmptyStateDescription>
      <EmptyStateActions>
        <Button size="sm">
          <PlusIcon />
          新建项目
        </Button>
        <Button size="sm" variant="outline">
          导入模板
        </Button>
      </EmptyStateActions>
      <EmptyStateHint>也可以直接拖入项目备份文件</EmptyStateHint>
    </EmptyState>
  )
}
