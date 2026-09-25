"use client"

import {
  BellIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  UserIcon,
} from "lucide-react"

import { Switch } from "@/registry/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ui/tabs"

const sections = [
  {
    value: "profile",
    label: "个人资料",
    icon: UserIcon,
    description: "你的姓名与头像会展示在评论、审批记录和成员列表中。",
    rows: [
      ["显示名称", "林澈"],
      ["工作邮箱", "linche@wui.design"],
      ["所属部门", "设计平台组"],
    ],
  },
  {
    value: "security",
    label: "登录安全",
    icon: ShieldCheckIcon,
    description: "建议为管理员账号开启双重验证，并定期检查登录设备。",
    rows: [
      ["双重验证", "已开启 · 验证器应用"],
      ["最近登录", "今天 09:12 · 上海"],
      ["活跃设备", "3 台"],
    ],
  },
  {
    value: "billing",
    label: "账单与套餐",
    icon: CreditCardIcon,
    description: "团队版按席位计费，每月 1 日自动续费。",
    rows: [
      ["当前套餐", "团队版 · 24 席位"],
      ["下次扣款", "10 月 1 日 · ¥2,880"],
      ["付款方式", "对公转账"],
    ],
  },
]

const notificationPrefs = [
  { label: "审批请求", checked: true },
  { label: "评论中提及我", checked: true },
  { label: "每周数据摘要", checked: false },
]

export default function TabsVertical() {
  return (
    <Tabs
      defaultValue="profile"
      orientation="vertical"
      className="w-full max-w-2xl"
    >
      <TabsList variant="underline" className="w-36 shrink-0">
        {sections.map((section) => (
          <TabsTrigger key={section.value} value={section.value}>
            <section.icon />
            {section.label}
          </TabsTrigger>
        ))}
        <TabsTrigger value="notifications">
          <BellIcon />
          通知偏好
        </TabsTrigger>
      </TabsList>

      {sections.map((section) => (
        <TabsContent key={section.value} value={section.value}>
          <h3 className="text-base font-semibold">{section.label}</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            {section.description}
          </p>
          <dl className="mt-4 divide-y border-y text-sm">
            {section.rows.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 py-2.5">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="text-right font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </TabsContent>
      ))}

      <TabsContent value="notifications">
        <h3 className="text-base font-semibold">通知偏好</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          选择你希望接收提醒的事件。
        </p>
        <div className="mt-4 divide-y border-y text-sm">
          {notificationPrefs.map((pref) => (
            <label
              key={pref.label}
              className="flex items-center justify-between gap-4 py-2.5"
            >
              {pref.label}
              <Switch defaultChecked={pref.checked} />
            </label>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
