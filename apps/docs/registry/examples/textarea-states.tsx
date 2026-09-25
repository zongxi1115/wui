import { Textarea } from "@/registry/ui/textarea"

const commitMessage = `feat(upload): 支持断点续传

- 分片大小默认 5 MB
- 失败分片最多自动重试 3 次`

export default function TextareaStates() {
  return (
    <div className="grid w-full max-w-sm gap-5">
      <div className="grid gap-2">
        <label htmlFor="textarea-state-default" className="text-sm font-medium">
          补充说明
        </label>
        <Textarea id="textarea-state-default" rows={3} placeholder="描述问题出现的步骤与期望结果" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="textarea-state-invalid" className="text-sm font-medium">
          问题描述
        </label>
        <Textarea
          id="textarea-state-invalid"
          rows={3}
          defaultValue="页面打不开"
          aria-invalid="true"
          aria-describedby="textarea-state-invalid-message"
        />
        <p id="textarea-state-invalid-message" className="text-destructive text-xs font-medium">
          请至少输入 10 个字，便于我们定位问题
        </p>
      </div>

      <div className="grid gap-2">
        <label htmlFor="textarea-state-readonly" className="text-sm font-medium">
          提交信息（只读）
        </label>
        <Textarea
          id="textarea-state-readonly"
          rows={4}
          readOnly
          defaultValue={commitMessage}
          className="font-mono text-xs"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="textarea-state-disabled" className="text-muted-foreground text-sm font-medium">
          追加评论
        </label>
        <Textarea
          id="textarea-state-disabled"
          rows={3}
          placeholder="工单已关闭，无法追加评论"
          disabled
        />
      </div>
    </div>
  )
}
