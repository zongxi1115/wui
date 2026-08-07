"use client"

import * as React from "react"

import { InputOTP } from "@/registry/ui/input-otp"

export default function InputOTPDemo() {
  const [code, setCode] = React.useState("")

  return (
    <div className="grid gap-3 text-center">
      <div>
        <p className="text-sm font-medium">输入验证码</p>
        <p className="text-muted-foreground mt-1 text-xs">
          验证码已发送至尾号 2048 的手机
        </p>
      </div>
      <InputOTP
        value={code}
        onValueChange={setCode}
        aria-label="短信验证码"
        className="justify-center"
      />
    </div>
  )
}
