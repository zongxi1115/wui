"use client"

import * as React from "react"
import { GlobeIcon, MailIcon, CopyIcon, CheckIcon } from "lucide-react"
import { Input } from "@/registry/ui/input"

export default function InputWithIcon() {
  const [copied, setCopied] = React.useState(false)
  const webhookUrl = "https://api.wui.design/v1/webhooks/wh_92kdf0a"

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid w-full max-w-sm gap-4">
      <div className="space-y-1">
        <label htmlFor="user-email" className="text-xs font-medium text-muted-foreground">
          电子邮箱
        </label>
        <Input
          id="user-email"
          type="email"
          placeholder="developer@example.com"
          startContent={<MailIcon className="size-4" />}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="custom-domain" className="text-xs font-medium text-muted-foreground">
          自定义域名
        </label>
        <Input
          id="custom-domain"
          placeholder="yourcompany"
          startContent={<GlobeIcon className="size-4" />}
          endContent={<span className="text-xs font-medium text-muted-foreground">.wui.dev</span>}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="webhook-endpoint" className="text-xs font-medium text-muted-foreground">
          Webhook 回调地址
        </label>
        <Input
          id="webhook-endpoint"
          readOnly
          value={webhookUrl}
          endContent={
            <button
              type="button"
              onClick={handleCopy}
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="复制链接"
            >
              {copied ? (
                <CheckIcon className="size-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <CopyIcon className="size-4" />
              )}
            </button>
          }
        />
      </div>
    </div>
  )
}
