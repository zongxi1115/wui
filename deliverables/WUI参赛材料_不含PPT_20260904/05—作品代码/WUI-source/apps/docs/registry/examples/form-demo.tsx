"use client"

import * as React from "react"
import { ArrowRightIcon, MailIcon } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { Button } from "@/registry/ui/button"
import { Cascader, type CascaderOption } from "@/registry/ui/cascader"
import { Checkbox } from "@/registry/ui/checkbox"
import {
  Form,
  FormActions,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormLegend,
  FormMessage,
  FormSection,
} from "@/registry/ui/form"
import { Input } from "@/registry/ui/input"

const teams: CascaderOption[] = [
  {
    value: "design",
    label: "设计",
    children: [
      { value: "product", label: "产品设计" },
      { value: "brand", label: "品牌设计" },
    ],
  },
  {
    value: "engineering",
    label: "工程",
    children: [
      { value: "web", label: "Web 平台" },
      { value: "mobile", label: "移动端" },
    ],
  },
]

export default function FormDemo() {
  const reduceMotion = useReducedMotion()
  const [email, setEmail] = React.useState("")
  const [team, setTeam] = React.useState<string[]>([])
  const [agreed, setAgreed] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const [touched, setTouched] = React.useState(false)
  const emailInvalid = touched && !/^\S+@\S+\.\S+$/.test(email)

  return (
    <div className="bg-background w-full max-w-lg rounded-2xl border p-6 shadow-sm sm:p-7">
      <Form
        onSubmit={(event) => {
          event.preventDefault()
          setTouched(true)
          if (!/^\S+@\S+\.\S+$/.test(email) || !team.length || !agreed) return
          setSubmitted(true)
        }}
      >
        <FormSection>
          <FormLegend>创建你的工作区</FormLegend>
          <p className="text-muted-foreground -mt-2 text-sm">
            填写以下信息后，即可邀请团队成员加入。
          </p>

          <FormField invalid={emailInvalid} required>
            <FormLabel>工作邮箱</FormLabel>
            <FormControl>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="name@company.com"
                startContent={<MailIcon />}
              />
            </FormControl>
            <FormMessage>请输入有效的工作邮箱。</FormMessage>
            <FormDescription>仅用于向你发送工作区更新。</FormDescription>
          </FormField>

          <FormField invalid={touched && !team.length} required>
            <FormLabel>团队</FormLabel>
            <FormControl>
              <Cascader
                options={teams}
                value={team}
                onValueChange={setTeam}
                placeholder="请选择团队"
              />
            </FormControl>
            <FormMessage>请选择团队后继续。</FormMessage>
          </FormField>

          <FormField invalid={touched && !agreed}>
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <Checkbox
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked === true)}
                className="mt-0.5"
              />
              <span className="text-muted-foreground leading-relaxed">
                我已阅读并同意工作区服务条款与数据政策。
              </span>
            </label>
            <FormMessage>请确认后继续。</FormMessage>
          </FormField>
        </FormSection>

        <FormActions>
          <AnimatePresence mode="wait" initial={false}>
            {submitted ? (
              <motion.span
                key="success"
                initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-success mr-auto text-sm font-medium"
              >
                工作区已创建
              </motion.span>
            ) : null}
          </AnimatePresence>
          <Button type="submit" motion>
            继续
            <ArrowRightIcon />
          </Button>
        </FormActions>
      </Form>
    </div>
  )
}
