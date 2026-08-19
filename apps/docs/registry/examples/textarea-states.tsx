"use client"

import { Textarea } from "@/registry/ui/textarea"

export default function TextareaStates() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">正常状态 (Default)</label>
        <Textarea rows={3} placeholder="请输入您的补充说明..." />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">校验错误状态 (aria-invalid="true")</label>
        <Textarea
          rows={3}
          defaultValue="字数过短"
          aria-invalid="true"
        />
        <p className="text-[11px] font-medium text-destructive">描述内容至少需包含 10 个字符，以便我们快速定位问题</p>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">只读状态 (readOnly)</label>
        <Textarea
          rows={3}
          readOnly
          value="----- BEGIN RSA PRIVATE KEY -----\nMIIEowIBAAKCAQEA0Y1o...\n----- END RSA PRIVATE KEY -----"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">禁用状态 (disabled)</label>
        <Textarea rows={3} placeholder="当前工单已关闭，不可追加评论..." disabled />
      </div>
    </div>
  )
}
