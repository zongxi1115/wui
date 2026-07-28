import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineHeader,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@/registry/ui/timeline"

const events = [
  {
    title: "版本已发布",
    time: "今天 14:32",
    description: "v2.4.0 已部署到生产环境。",
    variant: "success" as const,
  },
  {
    title: "审核已通过",
    time: "今天 11:08",
    description: "设计与无障碍检查均已完成。",
    variant: "primary" as const,
  },
  {
    title: "提交变更",
    time: "昨天 18:46",
    description: "林宁合并了 12 个组件更新。",
    variant: "default" as const,
  },
]

export default function TimelineDemo() {
  return (
    <Timeline className="w-full max-w-lg">
      {events.map((event) => (
        <TimelineItem key={event.title}>
          <TimelineDot variant={event.variant} />
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>{event.title}</TimelineTitle>
              <TimelineTime>{event.time}</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>{event.description}</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
