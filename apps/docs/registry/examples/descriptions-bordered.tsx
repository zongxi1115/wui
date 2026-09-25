"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Descriptions, DescriptionsItem } from "@/registry/ui/descriptions"

const endpoint = "https://api.gateway.internal/v2/cluster-alpha"

function CopyButton({ value }: { value: string }) {
  const reduceMotion = useReducedMotion()
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(timer)
  }, [copied])

  return (
    <button
      type="button"
      aria-label={copied ? "已复制访问端点" : "复制访问端点"}
      onClick={() => {
        navigator.clipboard.writeText(value)
        setCopied(true)
      }}
      className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/40 relative flex size-6 items-center justify-center rounded-sm outline-none transition-colors focus-visible:ring-2"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={copied ? "check" : "copy"}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, filter: "blur(2px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, filter: "blur(2px)" }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="flex"
        >
          {copied ? (
            <CheckIcon className="text-success size-3.5" />
          ) : (
            <CopyIcon className="size-3.5" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

export default function DescriptionsBordered() {
  return (
    <Descriptions
      title="云服务器实例"
      extra={
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            重启
          </Button>
          <Button size="sm">升级配置</Button>
        </div>
      }
      bordered
      columns={3}
      labelWidth="7rem"
      className="w-full max-w-4xl"
    >
      <DescriptionsItem label="实例 ID">
        <span className="font-mono text-xs">i-09f4b8102a9d8</span>
      </DescriptionsItem>
      <DescriptionsItem label="运行状态">
        <span className="text-success inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-current" />
          运行中
        </span>
      </DescriptionsItem>
      <DescriptionsItem label="地域">华东 1（杭州）可用区 B</DescriptionsItem>

      <DescriptionsItem label="规格">ecs.c7.2xlarge · 8 vCPU 16 GiB</DescriptionsItem>
      <DescriptionsItem label="操作系统">Debian 12 64 位</DescriptionsItem>
      <DescriptionsItem label="计费方式">包年包月 · 自动续费</DescriptionsItem>

      <DescriptionsItem label="访问端点" span={2}>
        <div className="flex min-w-0 items-center gap-1.5">
          <code className="bg-muted truncate rounded-sm px-1.5 py-0.5 font-mono text-xs">
            {endpoint}
          </code>
          <CopyButton value={endpoint} />
        </div>
      </DescriptionsItem>
      <DescriptionsItem label="内网 IP">
        <span className="font-mono text-xs">172.16.24.108</span>
      </DescriptionsItem>

      <DescriptionsItem label="安全组">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge size="sm" variant="secondary">
            sg-default-web
          </Badge>
          <Badge size="sm" variant="secondary">
            sg-database-access
          </Badge>
          <span className="text-muted-foreground text-xs">
            开放 80、443；22 端口仅允许堡垒机访问
          </span>
        </div>
      </DescriptionsItem>
    </Descriptions>
  )
}
