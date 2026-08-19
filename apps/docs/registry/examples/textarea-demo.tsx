"use client"

import { Textarea } from "@/registry/ui/textarea"

export default function TextareaDemo() {
  return (
    <div className="w-full max-w-md space-y-2">
      <label htmlFor="project-desc" className="text-xs font-medium text-muted-foreground">
        项目详细说明
      </label>
      <Textarea
        id="project-desc"
        rows={4}
        placeholder="请补充项目的业务目标、涉及模块或跨团队协作要点..."
      />
      <p className="text-[11px] text-muted-foreground">
        说明内容将自动同步给当前工作区的所有成员。
      </p>
    </div>
  )
}
