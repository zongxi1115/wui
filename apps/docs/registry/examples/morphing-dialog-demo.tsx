import { BellIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from "@/registry/ui/morphing-dialog"
import { Switch } from "@/registry/ui/switch"

const channels = [
  { id: "approval", label: "审批提醒", detail: "有新的待办或审批结果时通知我", on: true },
  { id: "mention", label: "被提及", detail: "有人在评论或文档中 @ 我", on: true },
  { id: "digest", label: "每周摘要", detail: "每周一早上汇总项目进展", on: false },
]

export default function MorphingDialogDemo() {
  return (
    <MorphingDialog>
      <MorphingDialogTrigger>
        <BellIcon className="mr-2 size-4" />
        通知设置
      </MorphingDialogTrigger>
      <MorphingDialogContent className="max-w-md">
        <MorphingDialogTitle>通知设置</MorphingDialogTitle>
        <MorphingDialogDescription className="mt-2">
          选择哪些事情值得打扰你，设置会同步到桌面端与移动端。
        </MorphingDialogDescription>
        <div className="mt-5 divide-y border-y">
          {channels.map((channel) => (
            <label
              key={channel.id}
              htmlFor={`notify-${channel.id}`}
              className="flex items-center justify-between gap-6 py-3"
            >
              <span>
                <span className="block text-sm font-medium">{channel.label}</span>
                <span className="text-muted-foreground text-sm">
                  {channel.detail}
                </span>
              </span>
              <Switch id={`notify-${channel.id}`} defaultChecked={channel.on} />
            </label>
          ))}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <MorphingDialogClose asChild>
            <Button variant="ghost" size="sm">
              取消
            </Button>
          </MorphingDialogClose>
          <MorphingDialogClose asChild>
            <Button size="sm">保存</Button>
          </MorphingDialogClose>
        </div>
        <MorphingDialogClose />
      </MorphingDialogContent>
    </MorphingDialog>
  )
}
