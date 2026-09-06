"use client"

import * as React from "react"
import { Cloud, CheckCircle2 } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Combobox } from "@/registry/ui/combobox"

const clusterRegions = [
  { value: "us-east-1", label: "US East (N. Virginia)", keywords: ["virginia", "aws", "useast"] },
  { value: "us-west-2", label: "US West (Oregon)", keywords: ["oregon", "aws", "uswest"] },
  { value: "eu-central-1", label: "Europe (Frankfurt)", keywords: ["frankfurt", "germany", "eu"] },
  { value: "ap-southeast-1", label: "Asia Pacific (Singapore)", keywords: ["singapore", "sg", "asia"] },
  { value: "ap-northeast-1", label: "Asia Pacific (Tokyo)", keywords: ["tokyo", "japan", "asia"] },
]

const envProfiles = [
  { value: "production", label: "Production (生产环境 - 高可用跨区)", keywords: ["prod", "live"] },
  { value: "staging", label: "Staging (预发环境 - 镜像模拟)", keywords: ["stage", "pre"] },
  { value: "development", label: "Development (开发测试环境)", keywords: ["dev", "test"] },
]

export default function ComboboxForm() {
  const [region, setRegion] = React.useState("ap-southeast-1")
  const [profile, setProfile] = React.useState("production")
  const [saved, setSaved] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground shadow-xs">
      <div className="flex items-center gap-2 border-b pb-3">
        <Cloud className="size-4 text-primary" />
        <h4 className="text-sm font-semibold">服务部署目标集群配置</h4>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground">
          部署地域 (Region)
        </label>
        <Combobox
          options={clusterRegions}
          value={region}
          onValueChange={setRegion}
          placeholder="搜索部署节点…"
          searchPlaceholder="输入城市名或地域代码…"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground">
          运行环境预设 (Environment)
        </label>
        <Combobox
          options={envProfiles}
          value={profile}
          onValueChange={setProfile}
          placeholder="选择运行环境…"
          searchPlaceholder="输入 prod, stage, dev 搜索…"
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        {saved ? (
          <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            集群目标配置已保存
          </span>
        ) : <span />}
        <Button type="submit" size="sm">
          保存并同步配置
        </Button>
      </div>
    </form>
  )
}
