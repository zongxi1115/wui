"use client"

import * as React from "react"
import { CheckCircle2Icon, Loader2Icon, RefreshCwIcon, ShieldCheckIcon } from "lucide-react"

import { InputOTP } from "@/registry/ui/input-otp"

export default function InputOTPAuthFlow() {
  const [code, setCode] = React.useState("")
  const [countdown, setCountdown] = React.useState(59)
  const [canResend, setCanResend] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [verified, setVerified] = React.useState(false)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleResend = () => {
    setCountdown(60)
    setCanResend(false)
    setCode("")
    setError("")
  }

  const handleComplete = (completedValue: string) => {
    setLoading(true)
    setError("")

    // 模拟服务端校验
    setTimeout(() => {
      setLoading(false)
      if (completedValue === "123456" || completedValue === "888888") {
        setVerified(true)
      } else {
        setError("验证码错误或已过期，请重试（测试正确码：123456）")
      }
    }, 1000)
  }

  return (
    <div className="bg-background w-full max-w-sm rounded-2xl border p-6 text-center shadow-xs">
      <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <ShieldCheckIcon className="size-5" />
      </div>

      <h3 className="text-base font-semibold">安全二次验证</h3>
      <p className="text-muted-foreground mt-1 text-xs">
        请输入发送至 +86 138****8888 的 6 位数字验证码
      </p>

      {verified ? (
        <div className="bg-success/10 border-success/25 my-6 flex flex-col items-center gap-2 rounded-xl border p-4">
          <CheckCircle2Icon className="text-success size-7" />
          <p className="text-sm font-medium">身份验证已通过！</p>
          <p className="text-muted-foreground text-xs">正在自动跳转至控制台...</p>
        </div>
      ) : (
        <div className="my-6 grid gap-4">
          <InputOTP
            length={6}
            value={code}
            onValueChange={(val) => {
              setCode(val)
              if (error) setError("")
            }}
            onComplete={handleComplete}
            disabled={loading}
            className="justify-center"
          />

          {loading ? (
            <div className="text-muted-foreground flex items-center justify-center gap-2 text-xs">
              <Loader2Icon className="size-3.5 animate-spin" />
              <span>正在验证身份凭据...</span>
            </div>
          ) : null}

          {error ? (
            <p role="alert" className="text-destructive text-xs font-medium">
              {error}
            </p>
          ) : null}

          <div className="flex items-center justify-center gap-1 text-xs">
            <span className="text-muted-foreground">没有收到验证码？</span>
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-primary hover:underline font-medium inline-flex items-center gap-1"
              >
                <RefreshCwIcon className="size-3" />
                重新发送
              </button>
            ) : (
              <span className="text-muted-foreground tabular-nums">
                {countdown} 秒后可重发
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
