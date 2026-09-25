"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import { Checkbox } from "@/registry/ui/checkbox"
import {
  Form,
  FormActions,
  FormField,
  FormMessage,
} from "@/registry/ui/form"

export default function CheckboxForm() {
  const [agreed, setAgreed] = React.useState(false)
  const [newsletter, setNewsletter] = React.useState(true)
  const [touched, setTouched] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const invalid = touched && !agreed

  return (
    <Form
      animated={false}
      className="w-full max-w-md"
      onSubmit={(event) => {
        event.preventDefault()
        setTouched(true)
        if (agreed) setSubmitted(true)
      }}
    >
      <div className="grid gap-1">
        <h4 className="text-sm font-semibold">完成注册</h4>
        <p className="text-muted-foreground text-xs">提交前请阅读并确认以下条款</p>
      </div>

      <FormField invalid={invalid}>
        <label htmlFor="agree-terms" className="flex cursor-pointer items-start gap-2.5">
          <Checkbox
            id="agree-terms"
            checked={agreed}
            aria-invalid={invalid}
            onCheckedChange={(value) => {
              setAgreed(value === true)
              setSubmitted(false)
            }}
            className="mt-0.5"
          />
          <span className="text-sm leading-relaxed">
            我已阅读并同意
            <a href="#" className="text-primary mx-0.5 underline-offset-4 hover:underline">
              《用户服务协议》
            </a>
            与
            <a href="#" className="text-primary mx-0.5 underline-offset-4 hover:underline">
              《隐私政策》
            </a>
          </span>
        </label>
        <FormMessage className="pl-7">需要同意服务协议与隐私政策才能继续</FormMessage>
      </FormField>

      <label htmlFor="subscribe-news" className="flex cursor-pointer items-start gap-2.5">
        <Checkbox
          id="subscribe-news"
          checked={newsletter}
          onCheckedChange={(value) => setNewsletter(value === true)}
          className="mt-0.5"
        />
        <span className="text-muted-foreground text-sm leading-relaxed">
          订阅产品更新邮件（每月不超过 2 封，可随时退订）
        </span>
      </label>

      <FormActions className="justify-between border-t pt-4">
        <span className="text-success text-xs font-medium" aria-live="polite">
          {submitted ? "注册成功，欢迎加入" : null}
        </span>
        <Button type="submit">同意并继续</Button>
      </FormActions>
    </Form>
  )
}
