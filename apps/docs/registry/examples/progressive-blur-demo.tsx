import { ProgressiveBlur } from "@/registry/ui/progressive-blur"

const activity = [
  ["09:42", "王芳 完成了设计评审"],
  ["10:18", "李明 解决了 3 条评论"],
  ["11:06", "原型已分享给产品组"],
  ["12:24", "张伟 起草了发布说明"],
  ["14:10", "v2.4 已发布到生产环境"],
  ["15:32", "赵磊 创建了回归测试计划"],
]

export default function ProgressiveBlurDemo() {
  return (
    <div className="bg-background relative h-72 w-full max-w-md overflow-hidden rounded-lg border">
      <div className="border-b px-5 py-3">
        <p className="text-sm font-medium">最近动态</p>
        <p className="text-muted-foreground text-xs">9 月 26 日 · 星期五</p>
      </div>
      <div className="divide-y px-5">
        {activity.map(([time, label]) => (
          <div key={time} className="flex items-center gap-4 py-3 text-sm">
            <span className="text-muted-foreground w-10 shrink-0 font-mono text-xs tabular-nums">
              {time}
            </span>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <ProgressiveBlur
        direction="bottom"
        blurLayers={8}
        blurIntensity={0.6}
        className="absolute inset-x-0 bottom-0 h-24"
      />
      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t to-transparent" />
    </div>
  )
}
