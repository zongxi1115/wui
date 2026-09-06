"use client"

import * as React from "react"
import { Descriptions, DescriptionsItem } from "@/registry/ui/descriptions"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"

export default function DescriptionsVertical() {
  return (
    <div className="w-full max-w-3xl space-y-4">
      <Descriptions
        title="企业订阅计划"
        extra={
          <Button size="sm" variant="outline">
            管理计划
          </Button>
        }
        layout="vertical"
        bordered
        size="sm"
        columns={4}
      >
        <DescriptionsItem label="当前套餐">
          <div className="font-semibold">Enterprise Plus</div>
        </DescriptionsItem>
        <DescriptionsItem label="席位配额">
          <div className="tabular-nums">48 / 100 席</div>
        </DescriptionsItem>
        <DescriptionsItem label="月度账单">
          <div className="font-semibold tabular-nums">¥12,800 / 月</div>
        </DescriptionsItem>
        <DescriptionsItem label="合约状态">
          <Badge variant="outline" className="text-success border-success/30 bg-success/10">
            有效中
          </Badge>
        </DescriptionsItem>

        <DescriptionsItem label="API 调用配额" span={2}>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>已用 3.8M</span>
              <span>总量 10.0M 次/月</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary" style={{ width: "38%" }} />
            </div>
          </div>
        </DescriptionsItem>

        <DescriptionsItem label="专属技术顾问" span={2}>
          <div className="flex items-center gap-2">
            <span className="font-medium">张晓峰</span>
            <span className="text-xs text-muted-foreground">
              (响应时间 &lt; 15分钟 · 7x24小时)
            </span>
          </div>
        </DescriptionsItem>
      </Descriptions>
    </div>
  )
}
