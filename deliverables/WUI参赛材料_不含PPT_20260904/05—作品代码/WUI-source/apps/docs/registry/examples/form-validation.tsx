"use client"

import * as React from "react"
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

interface Errors {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export default function FormValidation() {
  const [values, setValues] = React.useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [touched, setTouched] = React.useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = React.useState(false)

  const validate = () => {
    const errs: Errors = {}
    if (!values.username.trim()) {
      errs.username = "用户名不能为空"
    } else if (values.username.length < 3) {
      errs.username = "用户名至少需要 3 个字符"
    }

    if (!values.email.trim()) {
      errs.email = "电子邮箱为必填项"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errs.email = "请输入有效的电子邮箱格式"
    }

    if (!values.password) {
      errs.password = "请输入登录密码"
    } else if (values.password.length < 8) {
      errs.password = "密码长度不得少于 8 位"
    }

    if (values.password !== values.confirmPassword) {
      errs.confirmPassword = "两次输入的密码不一致"
    }

    return errs
  }

  const errors = validate()

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    })
    if (Object.keys(errors).length === 0) {
      setSubmitted(true)
    }
  }

  return (
    <div className="bg-background w-full max-w-md rounded-xl border p-6 shadow-xs">
      <div className="mb-4">
        <h3 className="text-base font-semibold">开发者账号注册</h3>
        <p className="text-muted-foreground text-xs">
          表单内置动态抖动校验反馈与无障碍 ARIA 关联
        </p>
      </div>

      {submitted ? (
        <div className="bg-success/10 border-success/30 flex items-center gap-3 rounded-lg border p-4">
          <CheckCircle2Icon className="text-success size-5 shrink-0" />
          <div className="text-sm">
            <p className="text-foreground font-medium">账号注册成功！</p>
            <p className="text-muted-foreground text-xs">已向 {values.email} 发送验证邮件。</p>
          </div>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <FormSection>
            <FormField invalid={Boolean(touched.username && errors.username)} required>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input
                  placeholder="例如：alex_developer"
                  value={values.username}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, username: e.target.value }))
                  }
                  onBlur={() => handleBlur("username")}
                  startContent={<UserIcon />}
                />
              </FormControl>
              {touched.username && errors.username ? (
                <FormMessage>{errors.username}</FormMessage>
              ) : (
                <FormDescription>用于公开展示的主页标识</FormDescription>
              )}
            </FormField>

            <FormField invalid={Boolean(touched.email && errors.email)} required>
              <FormLabel>电子邮箱</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="dev@example.com"
                  value={values.email}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, email: e.target.value }))
                  }
                  onBlur={() => handleBlur("email")}
                  startContent={<MailIcon />}
                />
              </FormControl>
              {touched.email && errors.email ? (
                <FormMessage>{errors.email}</FormMessage>
              ) : null}
            </FormField>

            <FormField invalid={Boolean(touched.password && errors.password)} required>
              <FormLabel>安全密码</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="至少 8 位包含字母与数字"
                  value={values.password}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, password: e.target.value }))
                  }
                  onBlur={() => handleBlur("password")}
                  startContent={<LockIcon />}
                />
              </FormControl>
              {touched.password && errors.password ? (
                <FormMessage>{errors.password}</FormMessage>
              ) : null}
            </FormField>

            <FormField
              invalid={Boolean(touched.confirmPassword && errors.confirmPassword)}
              required
            >
              <FormLabel>确认密码</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="再次输入以确认密码"
                  value={values.confirmPassword}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, confirmPassword: e.target.value }))
                  }
                  onBlur={() => handleBlur("confirmPassword")}
                  startContent={<LockIcon />}
                />
              </FormControl>
              {touched.confirmPassword && errors.confirmPassword ? (
                <FormMessage>{errors.confirmPassword}</FormMessage>
              ) : null}
            </FormField>
          </FormSection>

          <FormActions>
            <Button type="submit" className="w-full">
              创建账号
            </Button>
          </FormActions>
        </Form>
      )}
    </div>
  )
}
