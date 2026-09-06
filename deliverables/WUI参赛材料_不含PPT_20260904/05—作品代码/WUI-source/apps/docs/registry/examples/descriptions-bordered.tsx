"use client"

import * as React from "react"
import { Descriptions, DescriptionsItem } from "@/registry/ui/descriptions"
import { Button } from "@/registry/ui/button"
import { Badge } from "@/registry/ui/badge"
import { CopyIcon, CheckIcon } from "lucide-react"

export default function DescriptionsBordered() {
  const [copied, setCopied] = React.useState(false)
  const endpoint = "https://api.gateway.internal/v2/cluster-alpha"

  const handleCopy = () => {
    navigator.clipboard.writeText(endpoint)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-4xl space-y-4">
      <Descriptions
        title="云服务器实例详情"
        extra={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              重启实例
            </Button>
            <Button size="sm">配置升配</Button>
          </div>
        }
        bordered
        columns={3}
        labelWidth="7.5rem"
      >
        <DescriptionsItem label="实例 ID">
          <span className="font-mono text-xs">i-09f4b8102a9d8</span>
        </DescriptionsItem>
        <DescriptionsItem label="运行状态">
          <Badge variant="outline" className="text-success border-success/30 bg-success/10 font-normal">
            <span className="size-1.5 rounded-full bg-success mr-1.5 inline-block" />
            运行正常
          </Badge>
        </DescriptionsItem>
        <DescriptionsItem label="所属区域">华东 1 (杭州) - 可用区 B</DescriptionsItem>

        <DescriptionsItem label="规格类型">ecs.c7.2xlarge (8 vCPU / 16 GiB)</DescriptionsItem>
        <DescriptionsItem label="操作系统">Debian 12 64位 (Linux 6.1)</DescriptionsItem>
        <DescriptionsItem label="计费模式">包年包月 (自动续费)</DescriptionsItem>

        <DescriptionsItem label="访问端点" span={2}>
          <div className="flex items-center gap-2">
            <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs">
              {endpoint}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="复制端点"
            >
              {copied ? <CheckIcon className="size-3.5 text-success" /> : <CopyIcon className="size-3.5" />}
            </button>
          </div>
        </DescriptionsItem>
        <DescriptionsItem label="内网 IP">
          <span className="font-mono text-xs">172.16.24.108</span>
        </DescriptionsItem>

        <DescriptionsItem label="安全策略" span={3}>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">sg-default-web</Badge>
            <Badge variant="secondary">sg-database-access</Badge>
            <span className="text-xs text-muted-foreground ml-2">
              开放端口: 80, 443, 22 (SSH 仅限堡垒机 IP 访问)
            </span>
          </div>
        </DescriptionsItem>

        <DescriptionsItem label="备注说明" span={3}>
          承载核心结算网关服务，已配置跨可用区负载均衡与多副本热备容灾策略。
        </DescriptionsItem>
      </Descriptions>
    </div>
  )
}
