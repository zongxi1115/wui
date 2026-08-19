"use client"

import * as React from "react"
import { GiftIcon, TicketIcon } from "lucide-react"

import { InputOTP } from "@/registry/ui/input-otp"
import { Button } from "@/registry/ui/button"

export default function InputOTPAlphanumeric() {
  const [code, setCode] = React.useState("")
  const [redeemed, setRedeemed] = React.useState(false)

  return (
    <div className="bg-background w-full max-w-md rounded-xl border p-6 text-center shadow-xs">
      <div className="mx-auto mb-2 flex size-9 items-center justify-center rounded-lg bg-warning/15 text-warning">
        <TicketIcon className="size-4" />
      </div>
      <h4 className="text-sm font-semibold">兑换企业优惠礼券码</h4>
      <p className="text-muted-foreground mt-1 text-xs">
        支持输入字母与数字混合的 8 位兑换码（`numeric={false}`）
      </p>

      <div className="my-5 flex justify-center">
        <InputOTP
          length={8}
          numeric={false}
          value={code}
          onValueChange={(val) => {
            setCode(val.toUpperCase())
            setRedeemed(false)
          }}
          inputClassName="size-9 text-sm font-mono uppercase"
          aria-label="8位礼品兑换码"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground text-xs font-mono">
          CODE: {code || "--------"}
        </span>
        <Button
          size="sm"
          disabled={code.length < 8 || redeemed}
          onClick={() => setRedeemed(true)}
        >
          <GiftIcon className="size-3.5" />
          {redeemed ? "已成功兑换" : "立即兑换"}
        </Button>
      </div>
    </div>
  )
}
