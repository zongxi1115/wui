"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import { InputOTP } from "@/registry/ui/input-otp"

export default function InputOTPPin() {
  const [pin, setPin] = React.useState("")
  const [confirmed, setConfirmed] = React.useState(false)

  return (
    <div className="grid w-full max-w-xs justify-items-center gap-4 text-center">
      <div className="grid gap-1">
        <p className="text-sm font-medium">输入支付密码</p>
        <p className="text-muted-foreground text-xs">向「云端存储 · 年付」支付 ¥ 298.00</p>
      </div>

      <InputOTP
        length={6}
        mask
        value={pin}
        onValueChange={(next) => {
          setPin(next)
          setConfirmed(false)
        }}
        onComplete={() => setConfirmed(true)}
        aria-label="6 位支付密码"
        inputClassName="size-11 text-lg"
      />

      <div className="flex w-full items-center justify-between">
        <Button variant="link" size="sm" className="px-0 text-xs">
          忘记密码
        </Button>
        <span className="text-muted-foreground text-xs tabular-nums" aria-live="polite">
          {confirmed ? "正在验证…" : `${pin.length} / 6`}
        </span>
      </div>
    </div>
  )
}
