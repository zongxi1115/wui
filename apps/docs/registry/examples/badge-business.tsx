import { GitBranchIcon, LoaderCircleIcon } from "lucide-react"

import { Badge, type BadgeProps } from "@/registry/ui/badge"

const deployments: Array<{
  id: string
  branch: string
  commit: string
  environment: string
  envVariant: BadgeProps["variant"]
  status: string
  statusVariant: BadgeProps["variant"]
  building?: boolean
  time: string
}> = [
  {
    id: "dpl_98a7bc",
    branch: "main",
    commit: "接入企业微信扫码登录",
    environment: "生产",
    envVariant: "default",
    status: "已就绪",
    statusVariant: "success",
    time: "2 分钟前",
  },
  {
    id: "dpl_43f110",
    branch: "feat/billing",
    commit: "修复支付回调签名校验",
    environment: "预览",
    envVariant: "secondary",
    status: "构建中",
    statusVariant: "warning",
    building: true,
    time: "5 分钟前",
  },
  {
    id: "dpl_119ae2",
    branch: "refactor/theme",
    commit: "精简主题 Token 解析逻辑",
    environment: "预发",
    envVariant: "outline",
    status: "失败",
    statusVariant: "destructive",
    time: "14 分钟前",
  },
]

export default function BadgeBusiness() {
  return (
    <div className="w-full max-w-xl divide-y border-y">
      {deployments.map((item) => (
        <div
          key={item.id}
          className="flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-center"
        >
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{item.commit}</span>
              <Badge variant={item.envVariant} size="sm">
                {item.environment}
              </Badge>
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <span className="font-mono">{item.id}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <GitBranchIcon className="size-3" />
                {item.branch}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="text-muted-foreground text-xs">{item.time}</span>
            <Badge variant={item.statusVariant} size="sm">
              {item.building ? (
                <LoaderCircleIcon className="animate-spin motion-reduce:animate-none" />
              ) : null}
              {item.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
