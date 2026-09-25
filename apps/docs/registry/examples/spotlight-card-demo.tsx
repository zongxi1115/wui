import { FileTextIcon, KanbanSquareIcon, WorkflowIcon } from "lucide-react"

import { SpotlightCard } from "@/registry/ui/spotlight-card"

const features = [
  {
    icon: FileTextIcon,
    title: "协作文档",
    description: "多人实时编辑，行内评论与版本历史让每次修改都有迹可循。",
    stat: "平均每篇 6.4 位协作者",
  },
  {
    icon: KanbanSquareIcon,
    title: "项目看板",
    description: "拖拽流转任务状态，延期风险会被自动标记并提醒负责人。",
    stat: "交付周期缩短 23%",
  },
  {
    icon: WorkflowIcon,
    title: "自动化规则",
    description: "用触发条件和动作拼出工作流，把重复操作交给系统完成。",
    stat: "每周节省 5.2 小时",
  },
]

export default function SpotlightCardDemo() {
  return (
    <div className="grid w-full max-w-4xl gap-4 md:grid-cols-3">
      {features.map((feature) => (
        <SpotlightCard
          key={feature.title}
          radius={260}
          borderColor="color-mix(in oklab, var(--foreground) 45%, transparent)"
          className="bg-card flex flex-col rounded-lg border p-6"
        >
          <feature.icon className="text-muted-foreground size-5" />
          <h4 className="mt-6 font-medium">{feature.title}</h4>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            {feature.description}
          </p>
          <p className="text-muted-foreground mt-6 border-t pt-4 text-xs">
            {feature.stat}
          </p>
        </SpotlightCard>
      ))}
    </div>
  )
}
