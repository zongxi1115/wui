import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@/registry/ui/timeline"

const milestones = [
  {
    title: "需求对齐",
    time: "7 月 08 日",
    description: "明确核心场景与非目标。",
  },
  {
    title: "交互定稿",
    time: "7 月 14 日",
    description: "完成键盘路径与动态反馈。",
  },
  {
    title: "组件开发",
    time: "7 月 22 日",
    description: "API、示例和文档同步完成。",
  },
  {
    title: "准备发布",
    time: "7 月 28 日",
    description: "完成类型与设计 token 检查。",
  },
]

export default function TimelineAlternate() {
  return (
    <Timeline align="alternate" className="w-full max-w-2xl">
      {milestones.map((item, index) => {
        const side = index % 2 === 0 ? "left" : "right"
        return (
          <TimelineItem key={item.title} side={side}>
            <TimelineDot
              variant={index === milestones.length - 1 ? "primary" : "success"}
            />
            <TimelineContent>
              <TimelineTime>{item.time}</TimelineTime>
              <TimelineTitle className="mt-1">{item.title}</TimelineTitle>
              <TimelineDescription>{item.description}</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        )
      })}
    </Timeline>
  )
}
