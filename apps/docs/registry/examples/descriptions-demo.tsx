import { Button } from "@/registry/ui/button"
import { Descriptions, DescriptionsItem } from "@/registry/ui/descriptions"

export default function DescriptionsDemo() {
  return (
    <Descriptions
      title="项目详情"
      extra={
        <Button variant="ghost" size="sm">
          编辑
        </Button>
      }
      columns={3}
      bordered
      className="w-full max-w-3xl"
    >
      <DescriptionsItem label="项目名称" span={2}>
        移动端体验升级
      </DescriptionsItem>
      <DescriptionsItem label="状态">
        <span className="text-success inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-current" />
          进行中
        </span>
      </DescriptionsItem>
      <DescriptionsItem label="负责人">林澈</DescriptionsItem>
      <DescriptionsItem label="创建时间">2026-07-12</DescriptionsItem>
      <DescriptionsItem label="优先级">P1</DescriptionsItem>
      <DescriptionsItem label="项目说明" span={3}>
        统一关键流程的视觉反馈、触控手感与无障碍体验，并降低复杂页面的认知负担。
      </DescriptionsItem>
    </Descriptions>
  )
}
