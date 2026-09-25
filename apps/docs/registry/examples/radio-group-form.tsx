"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import {
  Form,
  FormActions,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from "@/registry/ui/form"
import { RadioGroup, RadioGroupItem } from "@/registry/ui/radio-group"

const roles = [
  { value: "admin", label: "管理员", description: "管理成员、账单与全部项目配置" },
  { value: "developer", label: "开发者", description: "推送代码、运行流水线并部署到测试环境" },
  { value: "viewer", label: "访客", description: "仅可查看看板、日志与文档" },
]

export default function RadioGroupForm() {
  const [role, setRole] = React.useState("")
  const [touched, setTouched] = React.useState(false)
  const [invited, setInvited] = React.useState(false)
  const invalid = touched && !role

  return (
    <Form
      animated={false}
      className="w-full max-w-md"
      onSubmit={(event) => {
        event.preventDefault()
        setTouched(true)
        if (role) setInvited(true)
      }}
    >
      <FormField invalid={invalid} required>
        <FormLabel id="invite-role-label">成员角色</FormLabel>
        <FormDescription>邀请 lin.wei@example.com 加入「增长实验」工作区</FormDescription>
        <RadioGroup
          value={role}
          onValueChange={(value) => {
            setRole(value)
            setInvited(false)
          }}
          aria-labelledby="invite-role-label"
          aria-invalid={invalid}
          className="mt-2 gap-3"
        >
          {roles.map((item) => (
            <label
              key={item.value}
              htmlFor={`role-${item.value}`}
              className="flex cursor-pointer items-start gap-3"
            >
              <RadioGroupItem
                value={item.value}
                id={`role-${item.value}`}
                aria-invalid={invalid}
                className="mt-px"
              />
              <span className="grid gap-1">
                <span className="text-sm font-medium leading-none">{item.label}</span>
                <span className="text-muted-foreground text-xs">{item.description}</span>
              </span>
            </label>
          ))}
        </RadioGroup>
        <FormMessage className="mt-1">请选择一个角色后再发送邀请</FormMessage>
      </FormField>

      <FormActions className="justify-between border-t pt-4">
        <span className="text-success text-xs font-medium" aria-live="polite">
          {invited ? `已发送邀请：${roles.find((item) => item.value === role)?.label}` : null}
        </span>
        <Button type="submit">发送邀请</Button>
      </FormActions>
    </Form>
  )
}
