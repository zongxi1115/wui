import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Descriptions, DescriptionsItem } from "@/registry/ui/descriptions"
import { Progress } from "@/registry/ui/progress"

export default function DescriptionsVertical() {
  return (
    <Descriptions
      title="企业订阅"
      extra={
        <Button size="sm" variant="outline">
          管理订阅
        </Button>
      }
      layout="vertical"
      bordered
      size="sm"
      columns={4}
      className="w-full max-w-3xl"
    >
      <DescriptionsItem label="当前套餐">
        <span className="font-medium">企业版 Plus</span>
      </DescriptionsItem>
      <DescriptionsItem label="席位">
        <span className="tabular-nums">48 / 100</span>
      </DescriptionsItem>
      <DescriptionsItem label="月度费用">
        <span className="font-medium tabular-nums">¥12,800</span>
      </DescriptionsItem>
      <DescriptionsItem label="合约状态">
        <Badge size="sm" variant="success">
          生效中
        </Badge>
      </DescriptionsItem>

      <DescriptionsItem label="本月 API 调用" span={2}>
        <div className="space-y-1.5 pt-0.5">
          <Progress value={38} aria-label="本月 API 调用用量" />
          <div className="text-muted-foreground flex justify-between text-xs tabular-nums">
            <span>已用 380 万次</span>
            <span>额度 1,000 万次</span>
          </div>
        </div>
      </DescriptionsItem>
      <DescriptionsItem label="专属技术顾问" span={2}>
        <span className="font-medium">张晓峰</span>
        <span className="text-muted-foreground ml-2 text-xs">
          7×24 小时 · 15 分钟内响应
        </span>
      </DescriptionsItem>
    </Descriptions>
  )
}
