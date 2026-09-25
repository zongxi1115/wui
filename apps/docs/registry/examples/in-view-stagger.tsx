import { ChartNoAxesColumnIcon, ShieldCheckIcon, WorkflowIcon } from "lucide-react"

import { InView } from "@/registry/ui/in-view"

const features = [
  {
    icon: WorkflowIcon,
    title: "可视化审批流",
    desc: "拖拽节点即可配置会签、或签与条件分支，改动实时生效。",
  },
  {
    icon: ShieldCheckIcon,
    title: "细粒度权限",
    desc: "按部门、角色与数据范围授权，所有操作留有审计记录。",
  },
  {
    icon: ChartNoAxesColumnIcon,
    title: "自助报表",
    desc: "选择字段与维度生成图表，支持定时推送到群聊。",
  },
]

export default function InViewStagger() {
  return (
    <div className="h-80 w-full max-w-lg overflow-y-auto rounded-lg border">
      <div className="px-6 pb-6 pt-8">
        <p className="text-muted-foreground text-xs">向下滚动查看</p>
        <h4 className="mt-2 text-lg font-semibold tracking-tight">
          为协作型团队设计的办公平台
        </h4>
      </div>
      <div className="h-40" />
      <ul className="divide-y border-t">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <InView
              as="li"
              key={feature.title}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              variants={{
                hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)" },
              }}
              viewOptions={{ margin: "0px 0px -15% 0px" }}
              className="flex gap-4 px-6 py-5"
            >
              <Icon className="text-muted-foreground mt-0.5 size-5 shrink-0" />
              <div>
                <p className="text-sm font-medium">{feature.title}</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {feature.desc}
                </p>
              </div>
            </InView>
          )
        })}
      </ul>
      <div className="h-16" />
    </div>
  )
}
