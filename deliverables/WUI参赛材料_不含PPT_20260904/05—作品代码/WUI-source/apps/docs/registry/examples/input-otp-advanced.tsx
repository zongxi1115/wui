"use client"

import * as React from "react"

import { InputOTP } from "@/registry/ui/input-otp"

export default function InputOTPAdvanced() {
  const [message, setMessage] = React.useState("可以直接粘贴完整验证码")

  return (
    <div className="grid gap-3 text-center">
      <InputOTP
        length={4}
        defaultValue="12"
        onValueChange={() => setMessage("继续输入剩余位数")}
        onComplete={(value) => setMessage(`已完成：${value}`)}
        aria-describedby="otp-status"
        className="justify-center"
        inputClassName="size-12 text-lg"
      />
      <p
        id="otp-status"
        aria-live="polite"
        className="text-muted-foreground text-xs"
      >
        {message}
      </p>
    </div>
  )
}
