import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeader,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@/registry/ui/timeline"

const records = [
  ["你更新了项目名称", "15:42"],
  ["林宁将王琪添加为管理员", "14:08"],
  ["系统完成每日数据备份", "09:00"],
  ["陈默导出了成员列表", "昨天"],
]

export default function TimelineCompact() {
  return (
    <Timeline density="compact" className="w-full max-w-lg">
      {records.map(([title, time]) => (
        <TimelineItem key={title}>
          <TimelineDot />
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle className="font-normal">{title}</TimelineTitle>
              <TimelineTime>{time}</TimelineTime>
            </TimelineHeader>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
