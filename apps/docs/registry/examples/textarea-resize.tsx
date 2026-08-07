import { Textarea } from "@/registry/ui/textarea"

export default function TextareaResize() {
  return (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <div className="space-y-2">
        <label htmlFor="fixed-feedback" className="text-sm font-medium">
          固定高度
        </label>
        <Textarea
          id="fixed-feedback"
          resize="none"
          rows={5}
          placeholder="该输入区域不会被拖动改变尺寸。"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="vertical-feedback" className="text-sm font-medium">
          仅垂直调整
        </label>
        <Textarea
          id="vertical-feedback"
          resize="vertical"
          rows={5}
          className="max-h-64 min-h-32"
          placeholder="可以上下拉伸，但不会破坏横向布局。"
        />
      </div>
    </div>
  )
}
