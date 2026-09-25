import { Motion } from "@/registry/ui/motion"

const releases = [
  { version: "v2.4.0", date: "9 月 24 日", note: "新增批量审批与审批流模板市场。" },
  { version: "v2.3.2", date: "9 月 12 日", note: "修复导出报表在 Safari 下的中文乱码问题。" },
  { version: "v2.3.0", date: "8 月 30 日", note: "工作台支持自定义布局，常用入口可拖拽排序。" },
  { version: "v2.2.5", date: "8 月 16 日", note: "权限中心新增角色继承与按部门授权。" },
  { version: "v2.2.0", date: "8 月 02 日", note: "全新消息中心，支持按项目分组与免打扰。" },
]

export default function MotionInView() {
  return (
    <div className="h-80 w-full max-w-md overflow-y-auto rounded-lg border">
      <div className="bg-background/95 sticky top-0 z-10 border-b px-5 py-3 text-sm font-medium">
        更新日志
      </div>
      <p className="text-muted-foreground px-5 pt-4 text-xs">
        向下滚动，条目进入视口时依次浮现。
      </p>
      <ol className="space-y-6 px-5 pb-10 pt-40">
        {releases.map((release) => (
          <Motion
            key={release.version}
            inView
            preset="blur-up"
            transition="gentle"
            viewport={{ once: true, amount: 0.6 }}
            className="border-l-2 pl-4"
          >
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-sm font-medium">
                {release.version}
              </span>
              <span className="text-muted-foreground text-xs">
                {release.date}
              </span>
            </div>
            <p className="text-muted-foreground mt-1 text-sm">{release.note}</p>
          </Motion>
        ))}
      </ol>
    </div>
  )
}
