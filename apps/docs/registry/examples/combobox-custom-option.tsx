"use client"

import * as React from "react"
import { Database, Server, HardDrive, Network } from "lucide-react"

import { Combobox } from "@/registry/ui/combobox"

const cloudResources = [
  {
    value: "rds-postgres",
    label: (
      <div className="flex items-center gap-2">
        <Database className="size-4 text-sky-500" />
        <span>PostgreSQL 生产集群</span>
      </div>
    ),
    description: "16 vCPU / 64 GiB · 读写分离 · 主从高可用",
    keywords: ["rds", "postgres", "sql", "database"],
  },
  {
    value: "ecs-gateway",
    label: (
      <div className="flex items-center gap-2">
        <Server className="size-4 text-emerald-500" />
        <span>API 网关节点集群</span>
      </div>
    ),
    description: "4 实例负载均衡 · QPS 峰值 50,000",
    keywords: ["ecs", "gateway", "api", "nginx"],
  },
  {
    value: "oss-assets",
    label: (
      <div className="flex items-center gap-2">
        <HardDrive className="size-4 text-amber-500" />
        <span>静态资源对象存储 Bucket</span>
      </div>
    ),
    description: "全球 CDN 加速 · 容量 2.4 TB",
    keywords: ["oss", "s3", "bucket", "storage"],
  },
  {
    value: "vpc-private",
    label: (
      <div className="flex items-center gap-2">
        <Network className="size-4 text-violet-500" />
        <span>核心金融 VPC 隔离网络</span>
      </div>
    ),
    description: "CIDR 172.16.0.0/16 · NAT 网关已就绪",
    keywords: ["vpc", "network", "subnet", "security"],
  },
]

export default function ComboboxCustomOption() {
  const [selected, setSelected] = React.useState("rds-postgres")

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <label className="text-sm font-medium text-foreground">
        关联云端基础设施资源
      </label>
      <Combobox
        options={cloudResources}
        value={selected}
        onValueChange={setSelected}
        placeholder="搜索云资源名称、类型或描述…"
        searchPlaceholder="键入如 postgres, gateway, cdn…"
      />
    </div>
  )
}
