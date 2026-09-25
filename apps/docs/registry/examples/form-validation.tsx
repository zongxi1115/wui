"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { CheckCircle2Icon, LockIcon, MailIcon, UserIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Form,
  FormActions,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormSection,
} from "@/registry/ui/form"
import { Input } from "@/registry/ui/input"

type Field = "username" | "email" | "password" | "confirmPassword"

const initialValues: Record<Field, string> = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
}

function validate(values: Record<Field, string>) {
  const errors: Partial<Record<Field, string>> = {}
  if (!values.username.trim()) errors.username = "请输入用户名"
  else if (values.username.trim().length < 3) errors.username = "用户名至少 3 个字符"

  if (!values.email.trim()) errors.email = "请输入邮箱"
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "邮箱格式不正确"

  if (!values.password) errors.password = "请设置密码"
  else if (values.password.length < 8) errors.password = "密码至少 8 位"

  if (!values.confirmPassword) errors.confirmPassword = "请再次输入密码"
  else if (values.confirmPassword !== values.password) errors.confirmPassword = "两次输入的密码不一致"

  return errors
}

export default function FormValidation() {
  const reduceMotion = useReducedMotion()
  const [values, setValues] = React.useState(initialValues)
  const [touched, setTouched] = React.useState<Partial<Record<Field, boolean>>>({})
  const [submitted, setSubmitted] = React.useState(false)
  const errors = validate(values)

  const fieldProps = (field: Field) => ({
    value: values[field],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      setValues((current) => ({ ...current, [field]: event.target.value })),
    onBlur: () => setTouched((current) => ({ ...current, [field]: true })),
  })
  const errorOf = (field: Field) => (touched[field] ? errors[field] : undefined)

  return (
    <div className="w-full max-w-sm">
      <AnimatePresence mode="wait" initial={false}>
        {submitted ? (
          <motion.div
            key="success"
            className="grid justify-items-center gap-2 py-8 text-center"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <CheckCircle2Icon className="text-success size-8" />
            <p className="text-sm font-medium">注册成功</p>
            <p className="text-muted-foreground text-xs">验证邮件已发送至 {values.email}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => {
                setValues(initialValues)
                setTouched({})
                setSubmitted(false)
              }}
            >
              重新填写
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <Form
              onSubmit={(event) => {
                event.preventDefault()
                setTouched({ username: true, email: true, password: true, confirmPassword: true })
                if (Object.keys(errors).length === 0) setSubmitted(true)
              }}
            >
              <div className="grid gap-1">
                <h3 className="text-base font-semibold">创建开发者账号</h3>
                <p className="text-muted-foreground text-xs">
                  离开输入框后校验，错误提示会平滑展开与收起
                </p>
              </div>

              <FormSection>
                <FormField invalid={Boolean(errorOf("username"))} required>
                  <FormLabel>用户名</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="例如 lin_wei"
                      autoComplete="username"
                      startContent={<UserIcon />}
                      {...fieldProps("username")}
                    />
                  </FormControl>
                  <FormMessage>{errorOf("username")}</FormMessage>
                  <FormDescription>将作为你的个人主页地址</FormDescription>
                </FormField>

                <FormField invalid={Boolean(errorOf("email"))} required>
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@company.com"
                      autoComplete="email"
                      startContent={<MailIcon />}
                      {...fieldProps("email")}
                    />
                  </FormControl>
                  <FormMessage>{errorOf("email")}</FormMessage>
                </FormField>

                <FormField invalid={Boolean(errorOf("password"))} required>
                  <FormLabel>密码</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="至少 8 位"
                      autoComplete="new-password"
                      startContent={<LockIcon />}
                      {...fieldProps("password")}
                    />
                  </FormControl>
                  <FormMessage>{errorOf("password")}</FormMessage>
                </FormField>

                <FormField invalid={Boolean(errorOf("confirmPassword"))} required>
                  <FormLabel>确认密码</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="再次输入密码"
                      autoComplete="new-password"
                      startContent={<LockIcon />}
                      {...fieldProps("confirmPassword")}
                    />
                  </FormControl>
                  <FormMessage>{errorOf("confirmPassword")}</FormMessage>
                </FormField>
              </FormSection>

              <FormActions>
                <Button type="submit" className="w-full">
                  创建账号
                </Button>
              </FormActions>
            </Form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
