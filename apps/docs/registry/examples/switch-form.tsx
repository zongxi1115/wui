"use client"

import * as React from "react"
import { BellIcon, EyeIcon, ShieldCheckIcon } from "lucide-react"
import { Switch } from "@/registry/ui/switch"

export default function SwitchForm() {
  const [settings, setSettings] = React.useState({
    securityAlerts: true,
    activityDigest: false,
    profileVisibility: true,
  })

  return (
    <div className="w-full max-w-md divide-y rounded-lg border">
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheckIcon className="mt-0.5 size-5 text-muted-foreground" />
          <label htmlFor="security-alerts" className="flex flex-col gap-0.5 cursor-pointer">
            <span className="text-sm font-medium">安全告警</span>
            <span className="text-xs text-muted-foreground">
              当检测到异常登录或敏感权限变更时立即通知
            </span>
          </label>
        </div>
        <Switch
          id="security-alerts"
          checked={settings.securityAlerts}
          onCheckedChange={(val) =>
            setSettings((prev) => ({ ...prev, securityAlerts: val }))
          }
        />
      </div>

      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-start gap-3">
          <BellIcon className="mt-0.5 size-5 text-muted-foreground" />
          <label htmlFor="activity-digest" className="flex flex-col gap-0.5 cursor-pointer">
            <span className="text-sm font-medium">每周动态汇总</span>
            <span className="text-xs text-muted-foreground">
              每周一早晨汇总过去一周的项目动态与统计
            </span>
          </label>
        </div>
        <Switch
          id="activity-digest"
          checked={settings.activityDigest}
          onCheckedChange={(val) =>
            setSettings((prev) => ({ ...prev, activityDigest: val }))
          }
        />
      </div>

      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-start gap-3">
          <EyeIcon className="mt-0.5 size-5 text-muted-foreground" />
          <label htmlFor="profile-visibility" className="flex flex-col gap-0.5 cursor-pointer">
            <span className="text-sm font-medium">公开个人资料</span>
            <span className="text-xs text-muted-foreground">
              允许组织内的其他成员搜索并查看您的个人主页
            </span>
          </label>
        </div>
        <Switch
          id="profile-visibility"
          checked={settings.profileVisibility}
          onCheckedChange={(val) =>
            setSettings((prev) => ({ ...prev, profileVisibility: val }))
          }
        />
      </div>
    </div>
  )
}
