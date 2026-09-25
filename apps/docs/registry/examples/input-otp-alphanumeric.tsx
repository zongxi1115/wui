"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import { InputOTP } from "@/registry/ui/input-otp"

export default function InputOTPAlphanumeric() {
  const [code, setCode] = React.useState("")
  const [redeemed, setRedeemed] = React.useState(false)

  return (
    <div className="grid w-full max-w-md justify-items-center gap-4 text-center">
      <div className="grid gap-1">
        <p className="text-sm font-medium">兑换礼品卡</p>
        <p className="text-muted-foreground text-xs">
          输入卡片背面的 8 位兑换码，字母不区分大小写
        </p>
      </div>

      <InputOTP
        length={8}
        numeric={false}
        value={code}
        onValueChange={(next) => {
          setCode(next.toUpperCase())
          setRedeemed(false)
        }}
        aria-label="8 位礼品卡兑换码"
        inputClassName="size-9 font-mono text-sm"
      />

      <Button disabled={code.length < 8 || redeemed} onClick={() => setRedeemed(true)}>
        {redeemed ? "已兑换 ¥ 100 余额" : "立即兑换"}
      </Button>
    </div>
  )
}
