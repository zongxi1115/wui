"use client"

import { AlertCircleIcon, MailIcon, LockIcon } from "lucide-react"
import { Input } from "@/registry/ui/input"

export default function InputStates() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">正常状态 (Default)</label>
        <Input type="email" placeholder="name@example.com" startContent={<MailIcon className="size-4" />} />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">错误校验状态 (aria-invalid="true")</label>
        <Input
          defaultValue="invalid-email-address"
          aria-invalid="true"
          endContent={<AlertCircleIcon className="size-4 text-destructive" />}
        />
        <p className="text-[11px] font-medium text-destructive">请输入有效的电子邮件格式（例如 user@domain.com）</p>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">只读状态 (readOnly)</label>
        <Input value="SYSTEM_GENERATED_ID_8829" readOnly />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">禁用状态 (disabled)</label>
        <Input placeholder="当前不可编辑..." disabled startContent={<LockIcon className="size-4" />} />
      </div>
    </div>
  )
}
