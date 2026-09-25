"use client"

import * as React from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/ui/accordion"
import { ToggleGroup, ToggleGroupItem } from "@/registry/ui/toggle-group"

type Variant = "default" | "bordered" | "separated"

const variants: Array<{ value: Variant; label: string }> = [
  { value: "default", label: "通栏" },
  { value: "bordered", label: "外框" },
  { value: "separated", label: "分离" },
]

const faqs = [
  {
    value: "billing",
    question: "套餐到期后数据会被删除吗？",
    answer:
      "不会。套餐到期后工作区进入 30 天只读保留期，期间可随时续费恢复编辑；保留期结束后数据会被加密归档 90 天，再执行彻底删除。",
  },
  {
    value: "seats",
    question: "如何为团队成员分配席位？",
    answer:
      "在「设置 → 成员与权限」中邀请成员并指定角色。管理员可随时回收席位，回收后的席位会立即返还到可用额度中。",
  },
  {
    value: "invoice",
    question: "支持开具增值税专用发票吗？",
    answer:
      "支持。完成企业认证后，可在「账单」页面提交开票信息，专票会在 3 个工作日内以电子形式发送至财务邮箱。",
  },
]

export default function AccordionDemo() {
  const [variant, setVariant] = React.useState<Variant>("bordered")

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <ToggleGroup
        type="single"
        size="sm"
        value={variant}
        onValueChange={(value) => value && setVariant(value as Variant)}
        aria-label="外观样式"
        className="rounded-lg border p-1"
      >
        {variants.map((item) => (
          <ToggleGroupItem key={item.value} value={item.value} className="px-3">
            {item.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <Accordion type="single" collapsible defaultValue="billing" variant={variant}>
        {faqs.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
