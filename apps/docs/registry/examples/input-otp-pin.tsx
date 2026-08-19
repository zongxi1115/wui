"use client"

import * as React from "react"
import { KeyRoundIcon } from "lucide-react"

import { InputOTP } from "@/registry/ui/input-otp"

export default function InputOTPPin() {
  const [pin, setPin] = React.useState("")
  const [status, setStatus] = React.useState("")

  return (
    <div className="bg-background w-full max-w-sm rounded-xl border p-6 text-center shadow-xs">
      <div className="mx-auto mb-2 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <KeyRoundIcon className="size-4" />
      </div>
      <h4 className="text-sm font-semibold">输入 4 位支付交易密码</h4>
      <p className="text-muted-foreground mt-1 text-xs">
        大尺寸高对比度 PIN 码输入位
      </p>

      <div className="my-5 flex justify-center">
        <InputOTP
          length={4}
          value={pin}
          onValueChange={setPin}
          onComplete={(val) => setStatus(`PIN 码已输入：${val}`)}
          inputClassName="size-12 text-xl font-bold bg-muted/40 focus:bg-background"
          aria-label="支付密码"
        />
      </div>

      <p className="text-muted-foreground min-h-4 text-xs tabular-nums">
        {status || `已输入 ${pin.length} / 4 位`}
      </p>
    </div>
  )
}
