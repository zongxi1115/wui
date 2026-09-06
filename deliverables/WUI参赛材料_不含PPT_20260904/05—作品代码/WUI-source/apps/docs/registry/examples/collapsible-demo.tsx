import { LockKeyholeIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/ui/collapsible"

export default function CollapsibleDemo() {
  return (
    <Collapsible defaultOpen className="w-full max-w-md border">
      <CollapsibleTrigger>
        <span className="flex items-center gap-2">
          <LockKeyholeIcon className="size-4 text-muted-foreground" />
          高级权限
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-t px-3 py-4 text-sm text-muted-foreground">
          管理成员角色、项目可见范围和外部共享权限。权限变更会立即应用到整个工作区。
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
